// Görüşme asistanı için sunucu tarafı vekil (proxy). Model sağlayıcısı: OpenRouter.
// Gizlilik: istemciden gelen bağlam izin listesine göre yeniden süzülür ve tüm serbest
// metinler sunucuda yeniden maskelenir. İçerik kaydedilmez.
import { ASSISTANT_SYSTEM_PROMPT, ASSISTANT_TASK_PROMPTS, ASSISTANT_TASKS, type AssistantTask } from '../constants/assistant';
import { contextToText, sanitizeContext, scrubText } from '../services/deidentify';
import { callOpenRouter, json, readBody, type ChatMessage } from './_lib/openrouter';

const MAX_INPUT = 1500;
const MAX_HISTORY = 8;
const MAX_HISTORY_CHARS = 2500;
const MAX_BODY_BYTES = 60_000;

type HistoryItem = { role: 'user' | 'assistant'; text: string };

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return json(res, 405, { error: 'Yalnızca POST desteklenir.' });

    let body: any;
    try {
        body = await readBody(req, MAX_BODY_BYTES);
    } catch (err: any) {
        return json(res, err?.message === 'TOO_LARGE' ? 413 : 400, { error: 'İstek okunamadı.' });
    }

    const task = body?.task as AssistantTask;
    const taskInfo = ASSISTANT_TASKS.find(t => t.id === task);
    if (!taskInfo) return json(res, 400, { error: 'Geçersiz görev.' });

    const rawInput = typeof body?.input === 'string' ? body.input.trim() : '';
    if (rawInput.length > MAX_INPUT) return json(res, 400, { error: `Metin en fazla ${MAX_INPUT} karakter olabilir.` });
    if (taskInfo.inputRequired && !rawInput) return json(res, 400, { error: 'Lütfen bir metin yazın.' });

    // İstemci zaten maskeler; sunucu güvenmez ve tekrar maskeler.
    const input = scrubText(rawInput, 'full');
    const context = sanitizeContext(body?.context);

    const history: HistoryItem[] = (Array.isArray(body?.history) ? body.history : [])
        .slice(-MAX_HISTORY)
        .filter((h: any) => (h?.role === 'user' || h?.role === 'assistant') && typeof h?.text === 'string')
        .map((h: any) => ({
            role: h.role,
            // Kullanıcı metinleri tam maskelenir; model yanıtlarında yalnızca yüksek kesinlikli kurallar uygulanır.
            text: scrubText(h.text.slice(0, MAX_HISTORY_CHARS), h.role === 'user' ? 'full' : 'storage')
        }));

    const messages: ChatMessage[] = [
        { role: 'system', content: `${ASSISTANT_SYSTEM_PROMPT}\n\nAnonim danışan özeti:\n${contextToText(context)}` },
        ...history.map(h => ({ role: h.role, content: h.text }) as ChatMessage),
        {
            role: 'user',
            content: `${ASSISTANT_TASK_PROMPTS[task]}\n\n${task === 'next' ? 'Hekimin notu' : task === 'ask' ? 'Soru' : 'Danışanın ifadesi'}: ${input || '(not yok)'}`
        }
    ];

    const result = await callOpenRouter(messages, { maxTokens: 700, temperature: 0.4, title: 'Gorusme Asistani' });
    if (result.ok === false) return json(res, result.status, { error: result.error });
    return json(res, 200, { text: result.text, sentInput: input });
}

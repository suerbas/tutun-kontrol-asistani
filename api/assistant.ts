// Görüşme asistanı için sunucu tarafı vekil (proxy). Model sağlayıcısı: OpenRouter.
// Gizlilik: istemciden gelen bağlam izin listesine göre yeniden süzülür ve tüm serbest
// metinler sunucuda yeniden maskelenir. İçerik kaydedilmez.
// Güvenilirlik: model uygulamanın ilaç kartlarıyla beslenir; cevap kurallara göre denetlenir,
// ihlalde bir kez düzeltme istenir, yine ihlal varsa ihlalli satırlar çıkarılır.
import { ASSISTANT_SYSTEM_PROMPT, ASSISTANT_TASK_PROMPTS, ASSISTANT_TASKS, type AssistantTask } from '../constants/assistant.js';
import { contextToText, sanitizeContext, scrubText } from '../services/deidentify.js';
import { buildKnowledgeBlock, correctionPrompt, deriveSituation, drugStatuses, stripViolations, validateAnswer } from '../services/assistantGuard.js';
import { callOpenRouter, json, readBody, type ChatMessage } from './_lib/openrouter.js';

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

    // Doğrulanmış ilaç bilgisi ve bu danışan için uygulamanın güvenlik kontrolü (hekim notundaki durumlar dahil)
    const situation = deriveSituation(context, input);
    const statuses = drugStatuses(situation);

    const messages: ChatMessage[] = [
        {
            role: 'system',
            content: `${ASSISTANT_SYSTEM_PROMPT}\n\nAnonim danışan özeti:\n${contextToText(context)}\n\n${buildKnowledgeBlock(statuses, situation.notes)}`
        },
        ...history.map(h => ({ role: h.role, content: h.text }) as ChatMessage),
        {
            role: 'user',
            content: `${ASSISTANT_TASK_PROMPTS[task]}\n\n${task === 'next' ? 'Hekimin notu' : task === 'ask' ? 'Soru' : 'Danışanın ifadesi'}: ${input || '(not yok)'}`
        }
    ];

    const opts = { maxTokens: 900, temperature: 0.2, title: 'Gorusme Asistani' };
    const first = await callOpenRouter(messages, opts);
    if (first.ok === false) return json(res, first.status, { error: first.error });

    let text = first.text;
    let violations = validateAnswer(text, { task, statuses, finishReason: first.finishReason });
    const guard: GuardReport = { retried: false, removedLines: 0, notes: [] };

    // İhlal varsa model bir kez, ihlaller söylenerek yeniden yazdırılır.
    if (violations.length) {
        guard.retried = true;
        const second = await callOpenRouter(
            [...messages, { role: 'assistant', content: text }, { role: 'user', content: correctionPrompt(violations) }],
            opts
        );
        if (second.ok) {
            const secondViolations = validateAnswer(second.text, { task, statuses, finishReason: second.finishReason });
            // Daha az ihlalli cevap tutulur.
            if (secondViolations.length <= violations.length) {
                text = second.text;
                violations = secondViolations;
            }
        }
    }

    // Hâlâ ihlal varsa ihlalli satırlar çıkarılır ve hekime bildirilir.
    if (violations.length) {
        const stripped = stripViolations(text, violations);
        text = stripped.text;
        guard.removedLines = stripped.removed;
        guard.notes = violations.map(v => v.message);
        if (!text.trim()) return json(res, 502, { error: 'Cevap güvenlik denetiminden geçemedi. Soruyu farklı biçimde sorun.' });
    }

    return json(res, 200, { text, sentInput: input, guard });
}

type GuardReport = { retried: boolean; removedLines: number; notes: string[] };

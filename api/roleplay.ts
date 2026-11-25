// BDT rol oyunu için sunucu tarafı vekil (proxy). Model sağlayıcısı: OpenRouter.
// API anahtarı yalnızca sunucuda okunur ve tarayıcıya gönderilmez.
// Konuşma içeriği kaydedilmez; yalnızca yanıtı üretmek için iletilir.
import { ROLEPLAY_COACH_PROMPT, ROLEPLAY_PERSONAS } from '../constants/roleplay.js';
import { callOpenRouter, json, readBody, type ChatMessage } from './_lib/openrouter.js';

const MAX_MESSAGES = 40;
const MAX_CHARS = 800;
const MAX_BODY_BYTES = 40_000;

type Turn = { role: 'clinician' | 'client'; text: string };

const validate = (body: any): { ok: true; personaId: string; mode: 'reply' | 'feedback'; turns: Turn[] } | { ok: false; error: string } => {
    const personaId = typeof body?.personaId === 'string' ? body.personaId : '';
    if (!ROLEPLAY_PERSONAS.some(p => p.id === personaId)) return { ok: false, error: 'Geçersiz senaryo.' };

    const mode = body?.mode === 'feedback' ? 'feedback' : 'reply';
    const raw = Array.isArray(body?.turns) ? body.turns : null;
    if (!raw || raw.length === 0 || raw.length > MAX_MESSAGES) return { ok: false, error: 'Konuşma geçersiz veya çok uzun.' };

    const turns: Turn[] = [];
    for (const t of raw) {
        if ((t?.role !== 'clinician' && t?.role !== 'client') || typeof t?.text !== 'string') {
            return { ok: false, error: 'Konuşma biçimi geçersiz.' };
        }
        const text = t.text.trim();
        if (!text || text.length > MAX_CHARS) return { ok: false, error: `Her mesaj 1-${MAX_CHARS} karakter olmalı.` };
        turns.push({ role: t.role, text });
    }
    if (mode === 'reply' && turns[turns.length - 1].role !== 'clinician') {
        return { ok: false, error: 'Yanıt için son mesaj hekime ait olmalı.' };
    }
    return { ok: true, personaId, mode, turns };
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return json(res, 405, { error: 'Yalnızca POST desteklenir.' });

    let body: any;
    try {
        body = await readBody(req, MAX_BODY_BYTES);
    } catch (err: any) {
        return json(res, err?.message === 'TOO_LARGE' ? 413 : 400, { error: 'İstek okunamadı.' });
    }

    const checked = validate(body);
    if (checked.ok === false) return json(res, 400, { error: checked.error });

    const persona = ROLEPLAY_PERSONAS.find(p => p.id === checked.personaId)!;
    const isFeedback = checked.mode === 'feedback';

    // Hekim = user, danışan = assistant. Geri bildirimde tüm konuşma tek metin olarak verilir.
    const messages: ChatMessage[] = isFeedback
        ? [{
            role: 'user',
            content: 'Aşağıdaki konuşmayı değerlendir:\n\n' + checked.turns
                .map(t => `${t.role === 'clinician' ? 'Hekim' : 'Danışan'}: ${t.text}`)
                .join('\n')
        }]
        : checked.turns.map(t => ({ role: t.role === 'clinician' ? 'user' : 'assistant', content: t.text }));

    // Çoğu model konuşmanın kullanıcı mesajıyla başlamasını bekler; danışanın açılış cümlesi ilk asistan mesajıdır.
    if (!isFeedback && messages[0].role !== 'user') {
        messages.unshift({ role: 'user', content: '(Görüşme başladı. Danışan konuşmaya başlar.)' });
    }

    const result = await callOpenRouter(
        [{ role: 'system', content: isFeedback ? ROLEPLAY_COACH_PROMPT : persona.systemPrompt }, ...messages],
        { maxTokens: isFeedback ? 900 : 300, temperature: isFeedback ? 0.3 : 0.9, title: 'BDT Rol Oyunu' }
    );

    if (result.ok === false) return json(res, result.status, { error: result.error });
    return json(res, 200, { text: result.text });
}

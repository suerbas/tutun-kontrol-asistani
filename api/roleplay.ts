// BDT rol oyunu için sunucu tarafı vekil (proxy). Model sağlayıcısı: OpenRouter.
// API anahtarı yalnızca sunucuda okunur ve tarayıcıya gönderilmez.
// Konuşma içeriği kaydedilmez; yalnızca yanıtı üretmek için iletilir.
import { ROLEPLAY_COACH_PROMPT, ROLEPLAY_PERSONAS } from '../constants/roleplay';

const MAX_MESSAGES = 40;
const MAX_CHARS = 800;
const MAX_BODY_BYTES = 40_000;

type Turn = { role: 'clinician' | 'client'; text: string };

const json = (res: any, status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
};

const readBody = (req: any): Promise<any> => {
    if (req.body !== undefined) {
        return typeof req.body === 'string' ? Promise.resolve(JSON.parse(req.body || '{}')) : Promise.resolve(req.body);
    }
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => {
            size += c.length;
            if (size > MAX_BODY_BYTES) {
                reject(new Error('TOO_LARGE'));
                req.destroy();
                return;
            }
            chunks.push(c);
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
            } catch {
                reject(new Error('BAD_JSON'));
            }
        });
        req.on('error', reject);
    });
};

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

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;
    if (!apiKey) return json(res, 500, { error: 'Sunucuda OPENROUTER_API_KEY tanımlı değil.' });
    if (!model) return json(res, 500, { error: 'Sunucuda OPENROUTER_MODEL tanımlı değil.' });

    let body: any;
    try {
        body = await readBody(req);
    } catch (err: any) {
        return json(res, err?.message === 'TOO_LARGE' ? 413 : 400, { error: 'İstek okunamadı.' });
    }

    const checked = validate(body);
    if (checked.ok === false) return json(res, 400, { error: checked.error });

    const persona = ROLEPLAY_PERSONAS.find(p => p.id === checked.personaId)!;
    const isFeedback = checked.mode === 'feedback';

    // Hekim = user, danışan = assistant. Geri bildirimde tüm konuşma tek metin olarak verilir.
    const messages = isFeedback
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

    // OpenRouter, OpenAI uyumlu biçimi kullanır: sistem talimatı ilk mesajdır.
    const upstream = await fetch(`${process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Title': 'BDT Rol Oyunu'
        },
        body: JSON.stringify({
            model,
            max_tokens: isFeedback ? 900 : 300,
            temperature: isFeedback ? 0.3 : 0.9,
            messages: [
                { role: 'system', content: isFeedback ? ROLEPLAY_COACH_PROMPT : persona.systemPrompt },
                ...messages
            ]
        })
    }).catch(() => null);

    if (!upstream) return json(res, 502, { error: 'Yapay zekâ servisine ulaşılamadı.' });
    if (upstream.status === 429) return json(res, 429, { error: 'Modelin istek sınırına ulaşıldı. Biraz sonra tekrar deneyin.' });
    if (!upstream.ok) return json(res, 502, { error: 'Yapay zekâ servisi bir hata döndürdü.' });

    const data: any = await upstream.json();
    const text = String(data?.choices?.[0]?.message?.content ?? '').trim();

    if (!text) return json(res, 502, { error: 'Boş yanıt alındı.' });
    return json(res, 200, { text });
}

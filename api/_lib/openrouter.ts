// OpenRouter çağrıları için ortak yardımcılar. "_" ile başlayan klasör Vercel'de
// ayrı bir uç nokta olarak yayınlanmaz.

export const json = (res: any, status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
};

export const readBody = (req: any, maxBytes: number): Promise<any> => {
    if (req.body !== undefined) {
        return typeof req.body === 'string' ? Promise.resolve(JSON.parse(req.body || '{}')) : Promise.resolve(req.body);
    }
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => {
            size += c.length;
            if (size > maxBytes) {
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

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type ChatResult = { ok: true; text: string; finishReason?: string } | { ok: false; status: number; error: string };

/** OpenRouter sohbet tamamlama isteği. Hata metinleri kullanıcıya gösterilecek biçimdedir. */
export const callOpenRouter = async (
    messages: ChatMessage[],
    opts: { maxTokens: number; temperature: number; title: string }
): Promise<ChatResult> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;
    if (!apiKey) return { ok: false, status: 500, error: 'Sunucuda OPENROUTER_API_KEY tanımlı değil.' };
    if (!model) return { ok: false, status: 500, error: 'Sunucuda OPENROUTER_MODEL tanımlı değil.' };

    const body: Record<string, unknown> = {
        model,
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        messages
    };
    // İsteğe bağlı: yalnızca veriyi saklamayan sağlayıcılara yönlendir.
    if (process.env.OPENROUTER_DATA_COLLECTION === 'deny') {
        body.provider = { data_collection: 'deny' };
    }
    // İsteğe bağlı: modelin cevap öncesi "düşünmesini" kapatır. Düşünme token'ları max_tokens'ı tüketip
    // cevabı yarıda bırakabiliyor; kısa cevaplarda kapatmak daha hızlı ve ucuz.
    if (process.env.OPENROUTER_REASONING === 'off') {
        body.reasoning = { enabled: false };
    }

    const upstream = await fetch(`${process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            // Başlıklar ASCII olmalı.
            'X-Title': opts.title
        },
        body: JSON.stringify(body)
    }).catch(() => null);

    if (!upstream) return { ok: false, status: 502, error: 'Yapay zekâ servisine ulaşılamadı.' };
    if (upstream.status === 429) return { ok: false, status: 429, error: 'Modelin istek sınırına ulaşıldı. Biraz sonra tekrar deneyin.' };
    if (upstream.status === 404 && body.provider) {
        return { ok: false, status: 502, error: 'Seçili model, veri saklamayan bir sağlayıcıda bulunamadı. OPENROUTER_MODEL ayarını değiştirin.' };
    }
    if (!upstream.ok) return { ok: false, status: 502, error: 'Yapay zekâ servisi bir hata döndürdü.' };

    const data: any = await upstream.json().catch(() => null);
    const text = String(data?.choices?.[0]?.message?.content ?? '').trim();
    if (!text) return { ok: false, status: 502, error: 'Boş yanıt alındı.' };
    return { ok: true, text, finishReason: data?.choices?.[0]?.finish_reason ?? undefined };
};

// Aynı rol oyunu konuşmasını birden fazla OpenRouter modeliyle çalıştırıp yanıtları karşılaştırır.
// Kullanım: node scripts/compare-roleplay-models.mjs
// API anahtarı: .env.local içinde OPENROUTER_API_KEY=... (ya da ortam değişkeni). Anahtarı kodda tutmayın.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const loadEnvFile = (file) => {
    if (!fs.existsSync(file)) return {};
    return Object.fromEntries(
        fs.readFileSync(file, 'utf8')
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('#') && l.includes('='))
            .map(l => {
                const i = l.indexOf('=');
                return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
            })
    );
};

const env = { ...loadEnvFile(path.join(root, '.env.local')), ...process.env };
const apiKey = env.OPENROUTER_API_KEY;
if (!apiKey) {
    console.error('OPENROUTER_API_KEY bulunamadı. .env.local dosyasına ekleyin.');
    process.exit(1);
}

// Karşılaştırma için tek senaryo (ertelemeci-erkek). Sistem talimatı constants/roleplay.ts ile aynıdır.
const ALL_MODELS = [
    'google/gemma-4-31b-it:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'baidu/ernie-5.5-flash-preview:free'
];
// ONLY_MODEL ortam değişkeniyle tek bir model seçilebilir.
const MODELS = env.ONLY_MODEL ? [env.ONLY_MODEL] : ALL_MODELS;

const SYSTEM = `Sen 42 yaşında, iki çocuk babası bir erkeksin. Sigarayı gerçekten bırakmak istiyorsun ve bunun önemli olduğunu biliyorsun. Ama her seferinde "yarın" ya da "işler yoluna girince" diyerek erteliyorsun. Büyük planlardan korkuyorsun, küçük bir adım atmak sana daha kolay geliyor.

Kurallar:
- Her zaman Türkçe konuş ve yalnızca bu karakter olarak yanıt ver.
- Karakter dışına çıkma; danışman, yapay zekâ veya eğitmen olduğunu asla söyleme.
- Yanıtların kısa olsun: en fazla 2-3 cümle.
- Danışman sert veya suçlayıcı konuşursa daha savunmacı ol; empatik ve açık uçlu sorularda yavaşça açıl.`;

const OPENING = 'Evet, bırakmak istiyorum. Ama şu an değil, önümüzdeki aylarda işler sakinleşince.';

// Hekim tarafı sabit: aynı konuşma tüm modellerde tekrarlanır.
const CLINICIAN_TURNS = [
    'Önümüzdeki aylar derken aklınızda ne var? Bu konuyu bir an düşünelim mi?',
    'Bırakmak istediğinizi duymak güzel. Bugün küçük bir adım atabileceğiniz bir şey olsa ne olurdu?',
    'Bu hafta sigara isteği geldiğinde 10 dakika bekleyip su içmeyi deneyebilir misiniz?'
];

const callModel = async (model, turns) => {
    const messages = [{ role: 'system', content: SYSTEM }];
    for (const t of turns) messages.push({ role: t.role === 'clinician' ? 'user' : 'assistant', content: t.text });
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Title': 'BDT Rol Oyunu (karsilastirma)' },
        body: JSON.stringify({ model, max_tokens: 300, temperature: 0.9, messages })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status} ${data?.error?.message || ''}`.trim());
    return String(data?.choices?.[0]?.message?.content ?? '').trim();
};

for (const model of MODELS) {
    console.log(`\n==================== ${model} ====================`);
    const turns = [{ role: 'client', text: OPENING }];
    console.log(`Danışan: ${OPENING}`);
    for (const clin of CLINICIAN_TURNS) {
        turns.push({ role: 'clinician', text: clin });
        console.log(`Hekim:   ${clin}`);
        try {
            const reply = await callModel(model, turns);
            turns.push({ role: 'client', text: reply });
            console.log(`Danışan: ${reply}`);
        } catch (err) {
            console.log(`HATA: ${err.message}`);
            break;
        }
    }
}

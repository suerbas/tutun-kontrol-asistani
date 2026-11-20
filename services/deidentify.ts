// Kimliksizleştirme katmanı.
// Hem tarayıcıda (kayıt ve önizleme) hem sunucuda (LLM'e gitmeden önce ikinci kontrol)
// aynı kurallar çalışır. Amaç: doğrudan tanımlayıcıları ve dolaylı tanımlayıcıları
// (ad, yer, iletişim, tarih, tam yaş) metinden çıkarmak.
import { COMORBIDITIES, Gender, Patient, SpecialProfile } from '../types';
import { COGNITIVE_DISTORTIONS, EMOTIONS, MOTIVATION_CATEGORIES } from '../constants/content';
import { PHARMACOLOGICAL_TREATMENTS } from '../constants/clinical';
import { PSYCHOSOCIAL_SCENARIOS } from '../constants/scenarios';

export const MASK = {
    NAME: '[İSİM]',
    PROPER: '[ÖZEL AD]',
    EMAIL: '[E-POSTA]',
    URL: '[BAĞLANTI]',
    PHONE: '[TELEFON]',
    ID: '[KİMLİK NO]',
    NUMBER: '[NUMARA]',
    ADDRESS: '[ADRES]',
    DATE: '[TARİH]',
    AGE: '[YAŞ]'
} as const;

export const MASK_PATTERN = /\[(?:İSİM|ÖZEL AD|E-POSTA|BAĞLANTI|TELEFON|KİMLİK NO|NUMARA|ADRES|TARİH|YAŞ)\]/gu;

const lower = (s: string) => s.toLocaleLowerCase('tr-TR');

// Sık kullanılan Türkçe ad ve soyadlar. Cümle başında da yakalanır.
// Gündelik kelimeyle çakışanlar (Can, Nur, Umut vb.) bilinçli olarak listede yok.
const COMMON_NAMES = new Set([
    'ahmet', 'mehmet', 'mustafa', 'ali', 'hüseyin', 'hasan', 'ibrahim', 'ismail', 'osman', 'yusuf', 'murat', 'ömer',
    'halil', 'süleyman', 'abdullah', 'mahmut', 'salih', 'kemal', 'recep', 'fatih', 'emre', 'burak', 'serkan',
    'kadir', 'orhan', 'erkan', 'volkan', 'hakan', 'sinan', 'tolga', 'onur', 'okan', 'kaan', 'cem', 'cengiz', 'selim',
    'veli', 'yasin', 'yunus', 'enes', 'furkan', 'berk', 'mert', 'emir', 'eymen', 'ilker', 'gökhan', 'tuncay', 'ercan',
    'erdal', 'levent', 'tamer', 'bülent', 'cihan', 'cihat', 'adem', 'ayhan', 'cafer', 'celal', 'kenan', 'nihat',
    'necati', 'nevzat', 'rıza', 'sabri', 'şükrü', 'yakup', 'zeki', 'kerem', 'tarık', 'taner', 'ozan', 'suat',
    'fatma', 'ayşe', 'emine', 'hatice', 'zeynep', 'elif', 'meryem', 'şerife', 'zehra', 'sultan', 'hanife', 'merve',
    'özlem', 'yasemin', 'hacer', 'esra', 'leyla', 'büşra', 'rabia', 'derya', 'gamze', 'songül', 'gülsüm',
    'kübra', 'tuğba', 'havva', 'sibel', 'aynur', 'hülya', 'filiz', 'serpil', 'nurten', 'nurcan',
    'gülay', 'esma', 'ebru', 'pınar', 'aslı', 'burcu', 'ceren', 'didem', 'ece', 'gizem', 'irem', 'nazlı',
    'selin', 'seda', 'sevda', 'tuba', 'yeliz', 'zerrin', 'feride', 'nermin', 'saadet', 'semra', 'şükran', 'türkan',
    'yılmaz', 'kaya', 'demir', 'şahin', 'çelik', 'yıldırım', 'öztürk', 'aydın', 'özdemir', 'arslan', 'doğan', 'kılıç',
    'çetin', 'koç', 'özkan', 'şimşek', 'polat', 'korkmaz', 'karataş', 'erdoğan', 'aktaş', 'yüksel', 'güler', 'bulut',
    'ünal', 'turan', 'tekin', 'karakaya', 'bozkurt', 'tunç'
]);

// Uygulamanın kendi metinlerinde geçen büyük harfli kelimeler (ilaç, duygu, motivasyon vb.)
// ve kimlik bildirmeyen özel adlar maskelenmez.
const BASE_ALLOWED = [
    'allah', 'rabbim', 'türkiye', 'türk', 'türkçe', 'ramazan', 'bayram', 'kurban', 'yılbaşı', 'noel', 'cuma',
    'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cumartesi', 'pazar',
    'ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık',
    'nikotin', 'sigara', 'nargile', 'puro', 'tütün', 'elektronik', 'champix', 'zyban', 'wellbutrin', 'nicorette',
    'tabex', 'nikitabs', 'vareniklin', 'bupropion', 'sitizin', 'cytisine', 'fagerström', 'alo', 'hekim', 'doktor',
    'doktorum', 'danışan', 'hasta', 'hemşire', 'covid', 'whatsapp', 'instagram', 'google'
];

const HONORIFIC_WORDS = new Set(['bey', 'hanım', 'hanımefendi', 'abla', 'abi', 'ağabey', 'amca', 'teyze', 'dayı', 'hoca', 'usta', 'efendi', 'bayan', 'bay']);

// "bu bey", "o hanım" gibi ad olmayan kalıplar
const STOP_BEFORE_HONORIFIC = new Set(['bu', 'şu', 'o', 'bir', 'yaşlı', 'genç', 'bizim', 'sizin', 'onun', 'diğer', 've', 'ile', 'da', 'de']);

const CAP_WORD_RE =/[A-ZÇĞİÖŞÜÂÎÛ][a-zçğıöşüâîû]+/gu;

let allowedCache: Set<string> | null = null;
const allowedWords = (): Set<string> => {
    if (allowedCache) return allowedCache;
    const source = JSON.stringify([
        COGNITIVE_DISTORTIONS, EMOTIONS, MOTIVATION_CATEGORIES, PHARMACOLOGICAL_TREATMENTS,
        COMORBIDITIES, Object.values(SpecialProfile), PSYCHOSOCIAL_SCENARIOS
    ]);
    const set = new Set(BASE_ALLOWED);
    for (const m of source.matchAll(CAP_WORD_RE)) {
        const w = lower(m[0]);
        // Uygulama metninde geçse bile yaygın kişi adları serbest bırakılmaz.
        if (!COMMON_NAMES.has(w)) set.add(w);
    }
    allowedCache = set;
    return set;
};

const isAllowed = (word: string) => {
    const w = lower(word);
    return allowedWords().has(w) || HONORIFIC_WORDS.has(w);
};

export type ScrubLevel = 'storage' | 'full';

const MONTHS = 'Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık';
const UP = 'A-ZÇĞİÖŞÜÂÎÛ';
const LO = 'a-zçğıöşüâîû';
const NOT_LETTER_BEFORE = `(?<![${UP}${LO}\\d])`;
const NOT_LETTER_AFTER = `(?![${UP}${LO}])`;

/**
 * Metindeki tanımlayıcıları maskeler.
 * - storage: yalnızca yüksek kesinlikli kurallar (iletişim, kimlik no, adres, unvanlı ve yaygın adlar).
 *   Kayıtlı veride hekim notunu bozmadan uygulanır.
 * - full: ek olarak tarih, tam yaş ve cümle içindeki özel adlar. LLM'e giden her metinde kullanılır.
 */
export const scrubText = (input: string, level: ScrubLevel = 'full'): string => {
    if (!input) return '';
    let t = String(input);

    t = t.replace(/[\p{L}\d._%+-]+@[\p{L}\d.-]+\.\p{L}{2,}/gu, MASK.EMAIL);
    t = t.replace(/(?:https?:\/\/|www\.)\S+/giu, MASK.URL);
    t = t.replace(/(?<!\d)(?:\+?90[\s.-]*)?(?:\(0?\d{3}\)|0?\d{3})[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}(?!\d)/g, MASK.PHONE);
    t = t.replace(/(?<!\d)[1-9]\d{10}(?!\d)/g, MASK.ID);
    t = t.replace(/(?<!\d)\d{7,}(?!\d)/g, MASK.NUMBER);

    // Adres parçaları
    t = t.replace(
        new RegExp(`(?:[${UP}][${LO}]+\\s+)*(?:Mahallesi|Mah\\.|Sokağı|Sokak|Sok\\.|Caddesi|Cad\\.|Bulvarı|Apartmanı|Apt\\.|Sitesi|Köyü)(?:\\s*,?\\s*No\\s*[:.]?\\s*\\d+[\\w/]*)?(?:\\s*,?\\s*Daire\\s*[:.]?\\s*\\d+)?`, 'gu'),
        MASK.ADDRESS
    );
    t = t.replace(/(?<![\p{L}])(?:No|Daire|Kat)\s*[:.]\s*\d+(?:\s*\/\s*\d+)?/gu, MASK.ADDRESS);

    // Unvan + ad (Sayın Ahmet Yılmaz, Dr. Ayşe) ve ad + hitap (Ahmet Bey, Fatma Teyze)
    t = t.replace(
        new RegExp(`(Sayın|Dr\\.|Doktor|Prof\\.|Doç\\.|Hemşire|Av\\.|Öğretmen|Bay|Bayan)\\s+(?!(?:Bey|Hanım)${NOT_LETTER_AFTER})[${UP}][${LO}]+(?:\\s+[${UP}][${LO}]+)?`, 'gu'),
        `$1 ${MASK.NAME}`
    );
    t = t.replace(
        new RegExp(`${NOT_LETTER_BEFORE}[${UP}][${LO}]+(?:\\s+[${UP}][${LO}]+)?(?=\\s+(?:Bey|Hanım|Hanımefendi|Abla|Abi|Ağabey|Amca|Teyze|Dayı|Hoca|Usta|Efendi)${NOT_LETTER_AFTER})`, 'gu'),
        // Hitaptan hemen önceki kelime ad kabul edilir; ondan önceki kelime yalnızca yaygın bir adsa maskelenir
        // ("Patronum Mehmet Bey" → "Patronum [İSİM] Bey").
        (m) => {
            const words = m.split(/\s+/);
            const last = words[words.length - 1];
            const first = words.length > 1 ? words[0] : null;
            const maskedLast = isAllowed(last) ? last : MASK.NAME;
            if (!first) return maskedLast;
            return `${COMMON_NAMES.has(lower(first)) ? MASK.NAME : first} ${maskedLast}`;
        }
    );
    // Küçük harfle yazılmış ad + Bey/Hanım (ör. "ahmet bey")
    t = t.replace(
        new RegExp(`${NOT_LETTER_BEFORE}[${LO}]+(?=\\s+(?:bey|hanım|Bey|Hanım)${NOT_LETTER_AFTER})`, 'gu'),
        (m) => isAllowed(m) || STOP_BEFORE_HONORIFIC.has(m) ? m : MASK.NAME
    );

    // Yaygın ad/soyadlar (cümle başında da)
    t = t.replace(new RegExp(`${NOT_LETTER_BEFORE}[${UP}][${LO}]+`, 'gu'), (m) => COMMON_NAMES.has(lower(m)) ? MASK.NAME : m);

    if (level === 'storage') return collapse(t);

    // Tarihler ve tam yaş
    t = t.replace(/(?<!\d)\d{1,2}[./-]\d{1,2}[./-](?:\d{4}|\d{2})(?!\d)/g, MASK.DATE);
    t = t.replace(new RegExp(`${NOT_LETTER_BEFORE}\\d{1,2}\\s+(?:${MONTHS})(?:\\s+\\d{4})?${NOT_LETTER_AFTER}`, 'giu'), MASK.DATE);
    t = t.replace(/(?<!\d)\d{1,3}(?=\s*yaş)/gu, MASK.AGE);

    // Kesme işaretli özel adlar (İzmir'de, Ayşe'nin)
    t = t.replace(new RegExp(`${NOT_LETTER_BEFORE}[${UP}][${LO}]+(?=['’][${LO}])`, 'gu'), (m) => isAllowed(m) ? m : MASK.PROPER);

    // Cümle içinde büyük harfle başlayan kelimeler özel ad kabul edilir.
    t = t.replace(new RegExp(`${NOT_LETTER_BEFORE}[${UP}][${LO}]+`, 'gu'), (m, offset: number, whole: string) => {
        if (isAllowed(m)) return m;
        const before = whole.slice(0, offset).replace(/\s+$/u, '');
        const prev = before.slice(-1);
        const sentenceStart = before === '' || /[.!?…:;\n"“”'‘’(«»\-–—•*\/]/u.test(prev);
        return sentenceStart ? m : MASK.PROPER;
    });

    return collapse(t);
};

// Arka arkaya gelen aynı maskeleri tek maskeye indirir: "[İSİM] [İSİM]" → "[İSİM]"
const collapse = (t: string) => t.replace(/(\[[^\]]+\])(?:\s+\1)+/gu, '$1');

export const hasMasks = (t: string) => new RegExp(MASK_PATTERN.source, 'u').test(t);

// ---------------------------------------------------------------------------
// LLM bağlamı: yalnızca genelleştirilmiş klinik bilgi. Kod, kimlik, tarih, tam yaş yok.
// ---------------------------------------------------------------------------

export const AGE_BANDS = ['18 yaş altı', '18-24', '25-34', '35-44', '45-54', '55-64', '65 ve üzeri'] as const;
export const DAILY_BANDS = ['1-10', '11-20', '21-30', '30 üzeri'] as const;
export const START_BANDS = ['15 yaş altı', '15-17', '18 ve üzeri'] as const;
const STAGES = ['Resistance', 'Ambivalence', 'Action'] as const;
const STAGE_TR: Record<string, string> = { Resistance: 'Direnç', Ambivalence: 'Kararsızlık', Action: 'Eylem' };

export interface AssistantContext {
    ageBand: typeof AGE_BANDS[number];
    gender: Gender;
    dailyBand: typeof DAILY_BANDS[number];
    startBand: typeof START_BANDS[number];
    fagerstrom: number | null;
    comorbidities: string[];
    profile: SpecialProfile | null;
    stage: typeof STAGES[number] | null;
    readiness: number | null;
    sessionCount: number;
    quitting: boolean | null;
    motivation: string[];
    homework: string;
    treatment: { drug: string; active: boolean } | null;
    thoughtRecords: { trigger: string; thought: string; emotion: string; intensity: number; distortion: string; alternative: string }[];
}

const ageBand = (age: number): AssistantContext['ageBand'] =>
    age < 18 ? AGE_BANDS[0] : age < 25 ? AGE_BANDS[1] : age < 35 ? AGE_BANDS[2] : age < 45 ? AGE_BANDS[3]
        : age < 55 ? AGE_BANDS[4] : age < 65 ? AGE_BANDS[5] : AGE_BANDS[6];
const dailyBand = (n: number): AssistantContext['dailyBand'] =>
    n <= 10 ? DAILY_BANDS[0] : n <= 20 ? DAILY_BANDS[1] : n <= 30 ? DAILY_BANDS[2] : DAILY_BANDS[3];
const startBand = (n: number): AssistantContext['startBand'] =>
    n < 15 ? START_BANDS[0] : n < 18 ? START_BANDS[1] : START_BANDS[2];

const clampInt = (v: unknown, min: number, max: number): number | null => {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return Math.min(max, Math.max(min, Math.round(n)));
};
const cut = (s: unknown, max: number) => scrubText(String(s ?? '').slice(0, max), 'full').trim();

const KNOWN_COMORBIDITIES = new Set(Object.values(COMORBIDITIES));
const KNOWN_DRUGS = new Set(PHARMACOLOGICAL_TREATMENTS.map(d => d.name));
const EMOTION_NAMES = new Map(EMOTIONS.map(e => [e.id, e.name]));
const DISTORTION_NAMES = new Map(COGNITIVE_DISTORTIONS.map(d => [d.id, d.name]));
const KNOWN_EMOTIONS = new Set(EMOTIONS.map(e => e.name));
const KNOWN_DISTORTIONS = new Set(COGNITIVE_DISTORTIONS.map(d => d.name));

/** Danışan kaydından LLM'e gidebilecek en az bilgiyi üretir. */
export const buildAssistantContext = (patient: Patient): AssistantContext => {
    const s = patient.psychosocialStatus;
    const records = (s?.thoughtRecords || []).slice(-3);
    return sanitizeContext({
        ageBand: ageBand(patient.age),
        gender: patient.gender,
        dailyBand: dailyBand(patient.dailyAmount),
        startBand: startBand(patient.firstSmokingAge),
        fagerstrom: patient.fagerstromScore ?? null,
        comorbidities: patient.comorbidities,
        profile: s?.profile ?? null,
        stage: s?.lastStage ?? null,
        readiness: s?.lastScore ?? null,
        sessionCount: s?.sessionCount ?? 0,
        quitting: s ? s.isQuitting : null,
        motivation: (s?.motivation || '').split(',').map(x => x.trim()).filter(Boolean),
        homework: s?.homework || '',
        treatment: patient.activeTreatment ? { drug: patient.activeTreatment.drugName, active: patient.activeTreatment.isActive } : null,
        thoughtRecords: records.map(r => ({
            trigger: r.trigger,
            thought: r.automaticThought,
            emotion: EMOTION_NAMES.get(r.emotion) || '',
            intensity: r.emotionIntensity,
            distortion: DISTORTION_NAMES.get(r.cognitiveDistortion) || '',
            alternative: r.alternativeThought
        }))
    });
};

/**
 * Bağlamı izin listesine göre süzer. Sunucu, istemciden gelen bağlama güvenmez ve
 * bu fonksiyonla yeniden doğrular; tanımsız alanlar düşer, serbest metinler yeniden maskelenir.
 */
export const sanitizeContext = (raw: any): AssistantContext => {
    const r = raw && typeof raw === 'object' ? raw : {};
    const pick = <T extends string>(v: unknown, list: readonly T[], fallback: T | null): T | null =>
        list.includes(v as T) ? (v as T) : fallback;

    const records = Array.isArray(r.thoughtRecords) ? r.thoughtRecords.slice(-3) : [];
    return {
        ageBand: pick(r.ageBand, AGE_BANDS, AGE_BANDS[3])!,
        gender: pick(r.gender, Object.values(Gender), Gender.Male)!,
        dailyBand: pick(r.dailyBand, DAILY_BANDS, DAILY_BANDS[1])!,
        startBand: pick(r.startBand, START_BANDS, START_BANDS[2])!,
        fagerstrom: r.fagerstrom === null || r.fagerstrom === undefined ? null : clampInt(r.fagerstrom, 0, 10),
        comorbidities: (Array.isArray(r.comorbidities) ? r.comorbidities : []).filter((c: unknown) => KNOWN_COMORBIDITIES.has(c as string)),
        profile: pick(r.profile, Object.values(SpecialProfile), null),
        stage: pick(r.stage, STAGES, null),
        readiness: r.readiness === null || r.readiness === undefined ? null : clampInt(r.readiness, 0, 10),
        sessionCount: clampInt(r.sessionCount, 0, 99) ?? 0,
        quitting: typeof r.quitting === 'boolean' ? r.quitting : null,
        motivation: (Array.isArray(r.motivation) ? r.motivation : []).slice(0, 8).map((m: unknown) => cut(m, 80)).filter(Boolean),
        homework: cut(r.homework, 300),
        treatment: r.treatment && KNOWN_DRUGS.has(r.treatment.drug)
            ? { drug: r.treatment.drug, active: r.treatment.active === true }
            : null,
        thoughtRecords: records.map((t: any) => ({
            trigger: cut(t?.trigger, 300),
            thought: cut(t?.thought, 300),
            emotion: KNOWN_EMOTIONS.has(t?.emotion) ? t.emotion : '',
            intensity: clampInt(t?.intensity, 1, 10) ?? 5,
            distortion: KNOWN_DISTORTIONS.has(t?.distortion) ? t.distortion : '',
            alternative: cut(t?.alternative, 300)
        })).filter((t: any) => t.trigger || t.thought)
    };
};

/** Bağlamın LLM'e giden metin hali. Önizlemede de aynısı gösterilir. */
export const contextToText = (c: AssistantContext): string => {
    const lines = [
        `Yaş grubu: ${c.ageBand}`,
        `Cinsiyet: ${c.gender}`,
        `Günlük sigara: ${c.dailyBand} adet`,
        `Başlama yaşı: ${c.startBand}`,
        `Fagerström: ${c.fagerstrom === null ? 'ölçülmedi' : `${c.fagerstrom}/10`}`,
        `Ek durumlar: ${c.comorbidities.length ? c.comorbidities.join(', ') : 'yok'}`
    ];
    if (c.profile) lines.push(`Profil: ${c.profile}`);
    if (c.stage) lines.push(`Son görüşmedeki evre: ${STAGE_TR[c.stage]}`);
    if (c.readiness !== null) lines.push(`Hazır olma puanı: ${c.readiness}/10`);
    lines.push(`Psikososyal görüşme sayısı: ${c.sessionCount}`);
    if (c.quitting !== null) lines.push(`Bırakma sürecinde: ${c.quitting ? 'evet' : 'hayır'}`);
    if (c.motivation.length) lines.push(`Motivasyon kaynakları: ${c.motivation.join(', ')}`);
    if (c.homework) lines.push(`Son verilen ödev: ${c.homework}`);
    if (c.treatment) lines.push(`İlaç tedavisi: ${c.treatment.drug} (${c.treatment.active ? 'devam ediyor' : 'sonlandı'})`);
    c.thoughtRecords.forEach((t, i) => {
        lines.push(`Düşünce kaydı ${i + 1}: Durum: ${t.trigger || '-'} | Otomatik düşünce: ${t.thought || '-'} | Duygu: ${t.emotion || '-'} (${t.intensity}/10) | Çarpıtma: ${t.distortion || '-'} | Alternatif: ${t.alternative || '-'}`);
    });
    return lines.join('\n');
};

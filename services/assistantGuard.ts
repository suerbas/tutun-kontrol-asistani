// Görüşme asistanı için kural katmanı.
// 1) Modele uygulamanın doğrulanmış ilaç kartlarını ve bu danışan için güvenlik kontrolü sonucunu verir.
// 2) Model cevabını kurallara göre denetler (doz, kontrendikasyon, istatistik, kaynak, kurum, uydurma süre...).
// 3) Düzeltilemeyen cevapta ihlalli satırları çıkarır.
import { PHARMACOLOGICAL_TREATMENTS } from '../constants/clinical';
import type { AssistantTask } from '../constants/assistant';
import { COMORBIDITIES, Gender, Patient } from '../types';
import {
    checkDrugSafety, DRUG_BUPROPION, DRUG_NRT_BANT, DRUG_NRT_SAKIZ, DRUG_SITIZIN, DRUG_VARENIKLIN
} from '../components/intervention/safety';
import type { AssistantContext } from './deidentify';

// Kartlardaki ilaçların metinde geçebilecek adları
const DRUG_ALIASES: Record<string, RegExp> = {
    [DRUG_NRT_BANT]: /nikotin\s+band|nikotin\s+bant|\bbant\b|\bband[ıi]?\b|\bbantlar|\bpatch|plaster|deri\s+(?:yapıştırıcı|bandı)/iu,
    [DRUG_NRT_SAKIZ]: /sakız|\bgum\b/iu,
    [DRUG_BUPROPION]: /bupropi?y?on|zyban|wellbutrin/iu,
    [DRUG_VARENIKLIN]: /varenikl?in|varenicline|champix/iu,
    [DRUG_SITIZIN]: /sitizin|sitisin|cytisin|tabex|nikitabs/iu
};

const SHORT_NAME: Record<string, string> = {
    [DRUG_NRT_BANT]: 'Nikotin bandı',
    [DRUG_NRT_SAKIZ]: 'Nikotin sakızı',
    [DRUG_BUPROPION]: 'Bupropion',
    [DRUG_VARENIKLIN]: 'Vareniklin',
    [DRUG_SITIZIN]: 'Sitizin'
};

// --------------------------------------------------------------------------
// Durum çıkarımı: özet + hekimin o anki notu
// --------------------------------------------------------------------------

export interface DerivedSituation {
    patient: Patient;
    recentMI: boolean;
    notes: string[];
}

const minAge = (band: string) => (band.startsWith('18 yaş altı') ? 16 : Number(band.match(/\d+/)?.[0] ?? 40));

/** Özetten ve hekimin yazdığı metinden güvenlik kontrolüne girecek durumları çıkarır. */
export const deriveSituation = (ctx: AssistantContext, input: string): DerivedSituation => {
    const comorbidities = new Set(ctx.comorbidities);
    const notes: string[] = [];
    const text = input.toLocaleLowerCase('tr-TR');

    if (/gebe|hamile|emziri?yor|emzirme/u.test(text) && !comorbidities.has(COMORBIDITIES.PREGNANCY)) {
        comorbidities.add(COMORBIDITIES.PREGNANCY);
        notes.push('Hekim notunda gebelik/emzirme geçiyor.');
    }
    if (/epilep|nöbet/u.test(text) && !comorbidities.has(COMORBIDITIES.EPILEPSY)) {
        comorbidities.add(COMORBIDITIES.EPILEPSY);
        notes.push('Hekim notunda epilepsi/nöbet geçiyor.');
    }
    let age = minAge(ctx.ageBand);
    if (/ergen|\b1[0-7]\s*yaş/u.test(text) && age >= 18) {
        age = 16;
        notes.push('Hekim notunda 18 yaş altı geçiyor.');
    }
    const mentionsMI = /kalp\s*kriz|enfarktüs|miyokard|koroner\s+sendrom|\bmi\b|\bami\b/u.test(text);
    const recent = /\d+\s*(?:gün|hafta)|yeni\s|yakın\s*zaman|geçen\s+hafta|bu\s+ay|geçireli/u.test(text) && !/\d+\s*(?:ay|yıl)\s*(?:önce|olmuş)/u.test(text);
    const recentMI = mentionsMI && recent;
    if (recentMI) {
        comorbidities.add(COMORBIDITIES.CVD);
        notes.push('Hekim notunda son 1 ay içinde kalp krizi geçiyor.');
    }

    const patient: Patient = {
        id: 'ctx', code: 'ctx', age, gender: ctx.gender ?? Gender.Male, firstSmokingAge: 18, dailyAmount: 20,
        comorbidities: [...comorbidities], visits: [], createdAt: ''
    };
    return { patient, recentMI, notes };
};

export interface DrugStatus {
    drug: string;
    blocked: string[];
    warnings: string[];
}

/** Uygulamanın güvenlik kurallarını (ve hekim notundan çıkan yakın MI'yı) uygular. */
export const drugStatuses = (sit: DerivedSituation): DrugStatus[] =>
    PHARMACOLOGICAL_TREATMENTS.map(d => {
        const s = checkDrugSafety(sit.patient, d.name);
        const blocked = [...s.blocking];
        const warnings = [...s.warnings];
        if (sit.recentMI && d.name === DRUG_NRT_BANT) blocked.push('Son 1 ay içinde akut miyokard enfarktüsü bant için kontrendikasyondur (ilaç kartı).');
        if (sit.recentMI && d.name === DRUG_SITIZIN) blocked.push('Yakın zamanda MI sitizin için kontrendikasyondur (ilaç kartı).');
        if (sit.recentMI && d.name === DRUG_NRT_SAKIZ) warnings.push('Yakın MI: kardiyoloji değerlendirmesi olmadan başlanmamalı.');
        return { drug: d.name, blocked, warnings };
    });

// --------------------------------------------------------------------------
// Modele verilecek doğrulanmış bilgi
// --------------------------------------------------------------------------

export const buildKnowledgeBlock = (statuses: DrugStatus[], sitNotes: string[]): string => {
    const cards = PHARMACOLOGICAL_TREATMENTS.map(d => [
        `### ${d.name} (${d.commercialName})`,
        `Doz: ${d.dosage}`,
        `Titrasyon: ${d.titration.replace(/\n+/g, ' ').replace(/[⚠️*]/gu, '').trim()}`,
        `Süre: ${d.duration}`,
        `Kontrendikasyonlar: ${d.contraindications.join('; ')}`,
        `Başlıca yan etkiler: ${d.sideEffects.map(s => s.effect).join('; ')}`,
        `Not: ${d.notes}`
    ].join('\n')).join('\n\n');

    const safety = statuses.map(s => {
        if (s.blocked.length) return `- ${SHORT_NAME[s.drug]}: KULLANILAMAZ. ${s.blocked.join(' ')}`;
        if (s.warnings.length) return `- ${SHORT_NAME[s.drug]}: DİKKAT. ${s.warnings.join(' ')}`;
        return `- ${SHORT_NAME[s.drug]}: uygulama kurallarına göre engel yok (hekim değerlendirmesi yine gerekir).`;
    }).join('\n');

    return `DOĞRULANMIŞ İLAÇ BİLGİSİ (uygulamanın ilaç kartları; doz ve şema yalnızca buradan verilir):\n${cards}\n\nGÜVENLİK KONTROLÜ (bu danışan için uygulamanın kuralları):\n${sitNotes.map(n => `- ${n}`).join('\n')}${sitNotes.length ? '\n' : ''}${safety}`;
};

// --------------------------------------------------------------------------
// Cevap denetimi
// --------------------------------------------------------------------------

export interface Violation {
    code: 'truncated' | 'length' | 'sections' | 'dose' | 'blocked' | 'stats' | 'citation' | 'org' | 'crisisLine' | 'invented' | 'prescribe';
    message: string;
    /** Bu ihlali içeren satırlar (son çare olarak çıkarılır) */
    lines: string[];
}

const ALLOWED_MG = (() => {
    const src = JSON.stringify(PHARMACOLOGICAL_TREATMENTS);
    const set = new Set<string>();
    for (const m of src.matchAll(/(\d+(?:[.,]\d+)?)\s*mg/giu)) set.add(String(Number(m[1].replace(',', '.'))));
    return set;
})();

const NEGATION = /kontra?endik|kontra?endikasyon|önerilmez|önermiyorum|önerilmemeli|kullanılmaz|kullanılmamalı|kullanmayın|kullanılamaz|uygun değil|başlanmamalı|başlanmaz|başlanmayacak|başlamayın|başlatmayın|başlatılmamalı|yazmayın|yazılmamalı|verilmemeli|vermeyin|kaçının|kaçınılmalı|güvenli değil|onaylı değil|onaylanmamış|engel|yasak|yerine|seçilemez|değil|olmaz|uzak durul|riskli|zararlı|tehlike|güvenli olmad|güvenli olmayan|başlatamay|başlatılamaz/iu;

const REQUIRED: Record<AssistantTask, { re: RegExp; label: string }[]> = {
    mi: [{ re: /ne duyuyorum/iu, label: 'Ne duyuyorum' }, { re: /yanıt önerileri/iu, label: 'Yanıt önerileri' }, { re: /kaçının/iu, label: 'Kaçının' }],
    distortion: [{ re: /çarpıtma/iu, label: 'Olası bilişsel çarpıtma' }, { re: /sokratik/iu, label: 'Sokratik sorular' }, { re: /dengeli/iu, label: 'Dengeli düşünce önerisi' }],
    next: [{ re: /durum/iu, label: 'Durum değerlendirmesi' }, { re: /sonraki/iu, label: 'Sonraki 3 adım' }],
    ask: []
};

const ORG = /(?<![\p{L}])(?:FDA|EMA|WHO|DSÖ|NICE|USPSTF|CDC|AHA|ACC|ESC|ERS|ATS|ADA|EASD|TÜSEB|TÜBAT|THS|TÜSAD|TTD|SGK|SSİ|SSK|TİTCK|NCCN|ACOG|AAP|GOLD|GINA)(?![\p{L}])|(?<![\p{L}])[\p{Lu}][\p{L}]*\s+(?:Derneği|Kurumu|Enstitüsü|Örgütü|Akademisi|Koleji|Birliği|Vakfı)(?![\p{L}])/u;
const STATS = /%\s*\d|\d+(?:[.,]\d+)?\s*%|yüzde\s*\d|\d+(?:\s*[-–]\s*\d+)?\s*kat(?:ı|ına)?(?![\p{L}])/iu;
const CITATION = /et\s+al\.?|cochrane|pmid|\bdoi\b|\b(?:lancet|nejm|jama|bmj|addiction)\b|surgeon\s+general|meta[-\s]?analiz|(?<!\d)(?:19|20)\d{2}(?!\d)/iu;
const INVENTED = /(?<![\p{L}\d])\d+\s*(?:yıl|yıllık|yıldır|yıldan|senedir|senelik)(?![\p{L}])/iu;
const PRESCRIBE = /reçetele|reçete(?:yi|ni|sini)?\s+yaz(?!ma)|reçete\s+edin/iu;
const HEADER_LINE = /^\s*(?:#+\s*)?\*\*[^*]+\*\*\s*:?\s*$|^\s*#+\s+/u;

const splitSentences = (line: string) => line.split(/(?<=[.!?])\s+/u);
// Türkçe büyük İ/I harfleri /i bayrağıyla doğru eşleşmez; küçük harfe çevirip öyle aranır.
const low = (s: string) => s.toLocaleLowerCase('tr-TR');

const linesOf = (text: string) => text.split('\n').filter(l => l.trim());

export interface ValidateOptions {
    task: AssistantTask;
    statuses: DrugStatus[];
    finishReason?: string;
}

export const validateAnswer = (text: string, opts: ValidateOptions): Violation[] => {
    const out: Violation[] = [];
    const lines = linesOf(text);
    const add = (code: Violation['code'], message: string, offending: string[] = []) => out.push({ code, message, lines: offending });

    if (opts.finishReason === 'length') add('truncated', 'Cevap yarıda kesildi; daha kısa ve tam bir cevap ver.');
    const words = text.split(/\s+/u).filter(Boolean).length;
    if (words > 230) add('length', `Cevap çok uzun (${words} kelime); en fazla 180 kelime.`);

    const missing = REQUIRED[opts.task].filter(r => !r.re.test(text)).map(r => r.label);
    if (missing.length) add('sections', `Eksik bölüm: ${missing.join(', ')}.`);

    // Doz: kartlarda olmayan mg değeri
    const badDoseLines = lines.filter(l => [...l.matchAll(/(\d+(?:[.,]\d+)?)\s*mg/giu)].some(m => !ALLOWED_MG.has(String(Number(m[1].replace(',', '.'))))));
    if (badDoseLines.length) {
        const values = [...new Set(badDoseLines.flatMap(l => [...l.matchAll(/(\d+(?:[.,]\d+)?)\s*mg/giu)].map(m => m[1]).filter(v => !ALLOWED_MG.has(String(Number(v.replace(',', '.')))))))];
        add('dose', `İlaç kartlarında olmayan doz yazıldı: ${values.join(', ')} mg.`, badDoseLines);
    }

    // Kullanılamaz ilacın olumlu anılması
    for (const s of opts.statuses.filter(s => s.blocked.length)) {
        const alias = DRUG_ALIASES[s.drug];
        const bad = lines.filter(l => !HEADER_LINE.test(l) && splitSentences(l).some(sen => alias.test(sen) && !NEGATION.test(low(sen))));
        if (bad.length) add('blocked', `${SHORT_NAME[s.drug]} bu danışan için KULLANILAMAZ; önerilemez, dozu yazılamaz.`, bad);
    }

    const pick = (re: RegExp) => lines.filter(l => re.test(l) && !/%1\s*hidrokortizon/iu.test(l));
    const stats = pick(STATS);
    if (stats.length) add('stats', 'Sayısal oran/istatistik verildi; istatistik verme.', stats);
    const cites = lines.filter(l => CITATION.test(l));
    if (cites.length) add('citation', 'Kaynak, makale veya yıl verildi; kaynak gösterme.', cites);
    const orgs = lines.filter(l => ORG.test(l));
    if (orgs.length) add('org', 'İzin verilmeyen kurum/kılavuz adı geçti; yalnızca Sağlık Bakanlığı, ALO 171 ve 112.', orgs);
    const crisis = lines.filter(l => /ALO\s*171/iu.test(l) && /intihar|kriz|acil|112|güvenlik planı|kendine zarar/u.test(low(l)));
    if (crisis.length) add('crisisLine', 'ALO 171 kriz hattı değildir; kriz/acil için yalnızca 112.', crisis);
    const aloMisuse = lines.filter(l => /ALO\s*171/iu.test(l) && /kılavuz|hekime\s+destek|protokol|ergen/u.test(low(l)));
    if (aloMisuse.length) add('crisisLine', 'ALO 171 yalnızca danışanların arayabileceği sigara bırakma danışma hattıdır; hekime kılavuz desteği veya özel protokol sunduğunu yazma.', aloMisuse);
    const invented = lines.filter(l => INVENTED.test(l));
    if (invented.length) add('invented', 'Özette olmayan süre/yıl bilgisi eklendi.', invented);
    const presc = lines.filter(l => PRESCRIBE.test(l));
    if (presc.length) add('prescribe', 'Reçete talimatı verildi; ilaç kararı hekimdedir.', presc);

    // İlaç sıralaması: "ilk tercih" ifadesi ya da ilaç adıyla başlayan numaralı liste
    const aliases = Object.values(DRUG_ALIASES).map(r => r.source).join('|') + '|nikotin|NRT|NDT';
    const rankedItem = new RegExp(`^\\s*\\d+[.)]\\s*(?:\\*\\*)?\\s*(?:${aliases})`, 'iu');
    const ranked = lines.filter(l => rankedItem.test(l));
    const firstChoice = lines.filter(l => /ilk\s+tercih|birinci\s+tercih|en\s+iyi\s+seçenek|ilk\s+satır|birinci\s+basamak|ilk\s+basamak|ilk\s+seçenek/u.test(low(l)));
    if (ranked.length >= 2 || firstChoice.length) {
        add('prescribe', 'İlaçlar sıralandı veya "ilk tercih" denildi; seçenekleri sıralamadan, kararı hekime bırakarak anlat.', [...firstChoice, ...(ranked.length >= 2 ? ranked : [])]);
    }

    return out;
};

/** Yeniden deneme isteği metni */
export const correctionPrompt = (violations: Violation[]) =>
    `Önceki cevabın otomatik denetimde şu kuralları ihlal etti:\n${violations.map(v => `- ${v.message}`).join('\n')}\n\nAynı görevi bu kurallara tam uyarak, en fazla 180 kelimeyle baştan yaz. Yalnızca düzeltilmiş cevabı ver.`;

/**
 * Son çare: ihlalli satırları çıkarır, yarım kalan son cümleyi siler.
 * Yapısal ihlaller (eksik bölüm, uzunluk) çıkarılamaz; yalnızca not düşülür.
 */
export const stripViolations = (text: string, violations: Violation[]): { text: string; removed: number } => {
    const bad = new Set(violations.flatMap(v => v.lines));
    let lines = text.split('\n').filter(l => !bad.has(l) || !l.trim());
    const removed = text.split('\n').length - lines.length;
    // Altı boşalan başlıkları da çıkar (sonraki dolu satır başka bir başlıksa veya metin bittiyse).
    if (removed > 0) {
        lines = lines.filter((l, i) => {
            if (!HEADER_LINE.test(l)) return true;
            const next = lines.slice(i + 1).find(x => x.trim());
            return !!next && !HEADER_LINE.test(next);
        });
    }
    if (violations.some(v => v.code === 'truncated')) {
        let joined = lines.join('\n').trimEnd();
        const lastEnd = Math.max(joined.lastIndexOf('.'), joined.lastIndexOf('!'), joined.lastIndexOf('?'), joined.lastIndexOf('"'));
        if (lastEnd > 0) joined = joined.slice(0, lastEnd + 1);
        lines = joined.split('\n');
    }
    return { text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(), removed };
};

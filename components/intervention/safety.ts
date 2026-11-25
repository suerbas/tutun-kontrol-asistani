import { Patient, COMORBIDITIES } from '../../types.js';

// İlaç adları constants/clinical.ts ile birebir aynı olmalıdır.
export const DRUG_NRT_BANT = 'Nikotin Replasman Tedavisi (NRT) - Bant';
export const DRUG_NRT_SAKIZ = 'Nikotin Replasman Tedavisi (NRT) - Sakız';
export const DRUG_BUPROPION = 'Bupropion HCl';
export const DRUG_VARENIKLIN = 'Vareniklin';
export const DRUG_SITIZIN = 'Sitizin (Cytisine)';
export const BEHAVIORAL_ONLY = 'Sadece Davranışsal';

export interface SafetyCheck {
    /** Kayıt engellenir: ilacın kendi kontrendikasyon listesinde yer alan bir durum var. */
    blocking: string[];
    /** Uyarı: hekim değerlendirmesi gerektirir, kayıt engellenmez. */
    warnings: string[];
}

/**
 * Hasta profiline göre ilaç güvenlik kontrolü.
 * Kurallar, constants/clinical.ts içindeki her ilacın kendi kontrendikasyon
 * listesine dayanır. Liste dışı durumlar yalnızca uyarı olarak gösterilir.
 */
export const checkDrugSafety = (patient: Patient, drugName: string): SafetyCheck => {
    const has = (comorbidity: string) => patient.comorbidities.includes(comorbidity);
    const pregnant = has(COMORBIDITIES.PREGNANCY);
    const cardiac = has(COMORBIDITIES.CVD) || has(COMORBIDITIES.STROKE);
    const blocking: string[] = [];
    const warnings: string[] = [];

    switch (drugName) {
        case DRUG_VARENIKLIN:
            if (patient.age < 18) blocking.push('18 yaş altında Vareniklin kullanılmaz (kontrendikasyon).');
            if (pregnant) blocking.push('Gebelik / emzirme döneminde Vareniklin kontrendikedir.');
            if (has(COMORBIDITIES.RENAL)) warnings.push('Böbrek yetmezliği: doz ayarı gerekir (CrCl <30 ml/dk için 0.5 mg günde 1 kez ile başlanır).');
            break;

        case DRUG_BUPROPION:
            if (has(COMORBIDITIES.EPILEPSY)) blocking.push('Epilepsi / nöbet öyküsünde Bupropion kontrendikedir.');
            if (patient.age < 18) blocking.push('18 yaş altında Bupropion önerilmez (güvenlilik ve etkinlik verisi yok).');
            if (pregnant) warnings.push('Gebelikte Bupropion kullanımı hekim değerlendirmesi gerektirir.');
            break;

        case DRUG_SITIZIN:
            if (patient.age < 18) blocking.push('18 yaş altında Sitizin için yeterli veri yoktur (kullanılmaz).');
            if (pregnant) blocking.push('Gebelik / emzirme döneminde Sitizin kontrendikedir.');
            if (cardiac) warnings.push('Kalp-damar / inme öyküsü: stabil olmayan anjina ve yakın MI kontrendikedir, kardiyak durum değerlendirilmelidir.');
            if (has(COMORBIDITIES.HYPERTENSION)) warnings.push('Hipertansiyon: şiddetli hipertansiyon kontrendikedir, kan basıncı kontrol altında olmalıdır.');
            break;

        case DRUG_NRT_BANT:
            if (cardiac) warnings.push('Kalp-damar / inme öyküsü: yakın MI (son 1 ay) ve stabil olmayan anjina kontrendikedir.');
            if (has(COMORBIDITIES.SKIN_SENSITIVITY)) warnings.push('Cilt hassasiyeti / egzama: bant tahrişe yol açabilir.');
            break;

        case DRUG_NRT_SAKIZ:
            if (has(COMORBIDITIES.DENTAL_ISSUES)) blocking.push('Diş / diş eti problemlerinde sakız kontrendikedir.');
            if (cardiac) warnings.push('Kalp-damar / inme öyküsü: yakın MI ve stabil olmayan anjina kontrendikedir.');
            break;

        default:
            break;
    }

    return { blocking, warnings };
};

/** Bir ilacın hasta için kullanılabilir olup olmadığını döndürür. */
export const isDrugBlocked = (patient: Patient, drugName: string): boolean =>
    checkDrugSafety(patient, drugName).blocking.length > 0;

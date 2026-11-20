
export enum Gender {
    Male = 'Erkek',
    Female = 'Kadın'
}

export enum DependenceLevel {
    Low = 'Düşük (0-2)',
    Medium = 'Orta (3-7)',
    High = 'Yüksek (8-10)'
}

export enum TreatmentStatus {
    New = 'Yeni Başvuru',
    Active = 'Tedavi Sürecinde',
    Relapse = 'Nüks (Relaps)',
    Success = 'Bıraktı (Başarılı)',
    DropOut = 'Takip Dışı'
}

export enum SpecialProfile {
    General = 'Genel Yetişkin',
    Under18 = '18 Yaş Altı / Ergen',
    Pregnant = 'Gebe',
    COPD = 'KOAH / Kronik Patient'
}

export const COMORBIDITIES = {
    EPILEPSY: 'Epilepsi / Nöbet Öyküsü',
    CVD: 'Kalp-Damar Hastalığı (Koroner Arter)',
    STROKE: 'SVO / İnme Öyküsü',
    HYPERTENSION: 'Hipertansiyon',
    COPD: 'KOAH / Astım / Solunum Yolu',
    PREGNANCY: 'Gebelik / Emzirme',
    RENAL: 'Böbrek Yetmezliği',
    DEPRESSION: 'Depresyon Öyküsü',
    DIABETES: 'Diyabet',
    SKIN_SENSITIVITY: 'Cilt Hassasiyeti / Egzama',
    DENTAL_ISSUES: 'Diş / Diş Eti Problemleri'
};

// Added missing SideEffect interface for DrugInfo
export interface SideEffect {
    effect: string;
    management: string;
}

// Added missing DrugInfo interface used in constants.ts
export interface DrugInfo {
    name: string;
    commercialName: string;
    dosage: string;
    titration: string;
    duration: string;
    contraindications: string[];
    sideEffects: SideEffect[];
    notes: string;
}

// --- BDT DÜŞÜNCE KAYDI (THOUGHT RECORD) ---
export interface ThoughtRecord {
    id: string;
    date: string;
    trigger: string;           // Tetikleyici durum
    automaticThought: string;  // Otomatik düşünce
    emotion: string;           // Duygu (EMOTIONS listesinden id)
    emotionIntensity: number;  // Duygu yoğunluğu (1-10)
    cognitiveDistortion: string; // Bilişsel çarpıtma (COGNITIVE_DISTORTIONS listesinden id)
    alternativeThought: string;  // Alternatif/Dengeli düşünce
    newEmotionIntensity?: number; // Yeni duygu yoğunluğu (1-10)
}

export interface PsychosocialStatus {
    profile: SpecialProfile;
    motivation: string;
    lastStage?: 'Resistance' | 'Ambivalence' | 'Action';
    lastScore?: number;
    homework?: string;
    sessionCount: number;
    isQuitting: boolean;
    thoughtRecords?: ThoughtRecord[];  // BDT Düşünce Kayıtları
}

// Aktif ilaç tedavisi bilgisi
export interface ActiveTreatment {
    drugName: string;           // İlaç adı (ör: "Vareniklin")
    commercialName?: string;    // Ticari ad (ör: "Champix")
    startDate: string;          // Başlangıç tarihi
    dosage?: string;            // Doz bilgisi
    isActive: boolean;          // Tedavi devam ediyor mu?
    endDate?: string;           // Tedavinin sonlandığı tarih
    endReason?: string;         // Sonlandırma nedeni
}

export interface Visit {
    id: string;
    date: string;
    notes: string;
    coLevel?: number;
    treatmentType?: string;
    status: TreatmentStatus;
    nextVisitDate?: string;
    sessionDuration?: string;
    terminationReason?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    phone: string;
    firstSmokingAge: number;
    dailyAmount: number;
    comorbidities: string[];
    fagerstromScore?: number;
    visits: Visit[];
    createdAt: string;
    psychosocialStatus?: PsychosocialStatus;
    activeTreatment?: ActiveTreatment;  // Aktif ilaç tedavisi
}

export enum AppScreen {
    Home = 'HOME',
    Education = 'EDUCATION',
    PatientList = 'PATIENT_LIST',
    Intervention = 'INTERVENTION',
    Psychosocial = 'PSYCHOSOCIAL'
}

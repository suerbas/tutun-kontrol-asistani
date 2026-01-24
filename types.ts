
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

export interface PsychosocialStatus {
    profile: SpecialProfile;
    motivation: string;
    lastStage?: 'Resistance' | 'Ambivalence' | 'Action';
    lastScore?: number;
    homework?: string;
    sessionCount: number;
    isQuitting: boolean;
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
}

export enum AppScreen {
    Home = 'HOME',
    Education = 'EDUCATION',
    PatientList = 'PATIENT_LIST',
    Intervention = 'INTERVENTION',
    Psychosocial = 'PSYCHOSOCIAL'
}

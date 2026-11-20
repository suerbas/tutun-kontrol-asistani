import { Patient, Visit } from '../types';
import { scrubText } from './deidentify';

const STORAGE_KEY = 'tütün_kontrol_hastalar';
// Karıştırılabilen karakterler (0/O, 1/I) kodlardan çıkarıldı.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Doğrudan tanımlayıcılar (ad, soyad, telefon) kayda yazılmaz. Serbest metinlerdeki
// iletişim bilgisi, kimlik no, adres ve kişi adları da maskelenir.
const anonymize = (raw: any): Patient => {
    const { name, phone, ...rest } = raw;
    const p = rest as Patient;
    const visits = Array.isArray(p.visits)
        ? p.visits.map(v => ({ ...v, notes: scrubText(v.notes || '', 'storage') }))
        : [];
    const status = p.psychosocialStatus
        ? {
            ...p.psychosocialStatus,
            thoughtRecords: p.psychosocialStatus.thoughtRecords?.map(r => ({
                ...r,
                trigger: scrubText(r.trigger || '', 'storage'),
                automaticThought: scrubText(r.automaticThought || '', 'storage'),
                alternativeThought: scrubText(r.alternativeThought || '', 'storage')
            }))
        }
        : undefined;
    return { ...p, visits, ...(status ? { psychosocialStatus: status } : {}) };
};

const readRaw = (): any[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const parsed = data ? JSON.parse(data) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // Bozuk veri uygulamayı açılmaz hale getirmesin.
        return [];
    }
};

export const patientService = {
    /**
     * Eski sürümden kalan kayıtları okurken ad ve telefonu siler ve anonim kod atar.
     * Değişiklik varsa kayıt yeniden yazılır.
     */
    getAllPatients: (): Patient[] => {
        const raw = readRaw();
        const used = new Set<string>(raw.map(p => p.code).filter(Boolean));
        const patients = raw.map(p => {
            let code: string = typeof p.code === 'string' ? p.code : '';
            if (!code) {
                code = patientService.createCode(used);
                used.add(code);
            }
            return { ...anonymize(p), code } as Patient;
        });

        const serialized = JSON.stringify(patients);
        if (serialized !== JSON.stringify(raw)) localStorage.setItem(STORAGE_KEY, serialized);
        return patients;
    },

    getPatient: (id: string): Patient | undefined => {
        const patients = patientService.getAllPatients();
        return patients.find(p => p.id === id);
    },

    savePatient: (patient: Patient): void => {
        const patients = patientService.getAllPatients();
        const clean = anonymize(patient);
        const existingIndex = patients.findIndex(p => p.id === clean.id);

        if (existingIndex >= 0) {
            patients[existingIndex] = clean;
        } else {
            patients.push(clean);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    },

    deletePatient: (id: string): void => {
        const patients = patientService.getAllPatients();
        const filteredPatients = patients.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPatients));
    },

    addVisit: (patientId: string, visit: Visit): void => {
        const patients = patientService.getAllPatients();
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            patient.visits.push(visit);
            patientService.savePatient(patient);
        }
    },

    createNewId: (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    /** Kullanılmayan, okunabilir bir danışan kodu üretir (ör. D-7K3Q). */
    createCode: (used: Set<string>): string => {
        for (let attempt = 0; attempt < 100; attempt++) {
            let suffix = '';
            for (let i = 0; i < 4; i++) {
                suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
            }
            const code = `D-${suffix}`;
            if (!used.has(code)) return code;
        }
        // Çok nadir çakışma durumunda zaman damgası ile benzersizlik sağlanır.
        return `D-${Date.now().toString(36).toUpperCase()}`;
    }
};

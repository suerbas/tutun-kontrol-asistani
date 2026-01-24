import { Patient, Visit } from '../types';

const STORAGE_KEY = 'tütün_kontrol_hastalar';

export const patientService = {
    getAllPatients: (): Patient[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getPatient: (id: string): Patient | undefined => {
        const patients = patientService.getAllPatients();
        return patients.find(p => p.id === id);
    },

    savePatient: (patient: Patient): void => {
        const patients = patientService.getAllPatients();
        const existingIndex = patients.findIndex(p => p.id === patient.id);

        if (existingIndex >= 0) {
            patients[existingIndex] = patient;
        } else {
            patients.push(patient);
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
    }
};
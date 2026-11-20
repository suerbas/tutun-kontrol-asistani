
import React, { useState, useEffect } from 'react';
import { Patient, Gender, COMORBIDITIES } from '../types';
import { patientService } from '../services/patientService';
import { Button } from './Button';

interface PatientListProps {
    onSelectPatient: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Initial empty state for new patient
    const initialPatientState: Partial<Patient> = {
        name: '',
        age: 0,
        gender: Gender.Male,
        phone: '',
        firstSmokingAge: 18,
        dailyAmount: 20,
        comorbidities: []
    };

    const [currentPatientData, setCurrentPatientData] = useState<Partial<Patient>>(initialPatientState);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        setPatients(patientService.getAllPatients());
    };

    const handleAddNew = () => {
        setCurrentPatientData(initialPatientState);
        setShowForm(true);
    };

    const handleEdit = (e: React.MouseEvent, patient: Patient) => {
        e.stopPropagation();
        setCurrentPatientData({ ...patient });
        setShowForm(true);
    };

    const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation(); // Butona basıldığında kartın tıklanmasını engelle
        if (window.confirm(`${name} isimli danışanı ve tüm kayıtlarını silmek istediğinize emin misiniz?`)) {
            patientService.deletePatient(id);
            // Optimistic update: Listeyi hemen güncelle
            setPatients(prev => prev.filter(p => p.id !== id));
        }
    };

    const toggleComorbidity = (illness: string) => {
        const currentList = currentPatientData.comorbidities || [];
        if (currentList.includes(illness)) {
            setCurrentPatientData({
                ...currentPatientData,
                comorbidities: currentList.filter(c => c !== illness)
            });
        } else {
            setCurrentPatientData({
                ...currentPatientData,
                comorbidities: [...currentList, illness]
            });
        }
    };

    const handleSavePatient = (e: React.FormEvent) => {
        e.preventDefault();

        // If ID exists, we are updating. If not, we are creating.
        const isUpdate = !!currentPatientData.id;

        // Güncellemede kayıtlı halini temel al; böylece psikososyal durum,
        // ilaç tedavisi ve Fagerström skoru form tarafından silinmez.
        const existing = isUpdate ? patientService.getPatient(currentPatientData.id!) : undefined;
        const base: Partial<Patient> = existing ?? {};

        const patientToSave: Patient = {
            ...base,
            id: existing?.id ?? currentPatientData.id ?? patientService.createNewId(),
            name: currentPatientData.name!,
            age: Number(currentPatientData.age),
            gender: currentPatientData.gender as Gender,
            phone: currentPatientData.phone!,
            firstSmokingAge: Number(currentPatientData.firstSmokingAge),
            dailyAmount: Number(currentPatientData.dailyAmount),
            comorbidities: currentPatientData.comorbidities || [],
            visits: existing?.visits ?? [],
            createdAt: existing?.createdAt ?? new Date().toISOString()
        };

        patientService.savePatient(patientToSave);
        loadPatients();
        setShowForm(false);

        // If it was a new record, auto-select it. If update, just close form.
        if (!isUpdate) {
            onSelectPatient(patientToSave);
        }
    };

    if (showForm) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                    {currentPatientData.id ? 'Danışan Bilgilerini Düzenle' : 'Yeni Danışan Kaydı'}
                </h2>
                <form onSubmit={handleSavePatient} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Ad Soyad</label>
                        <input required type="text" className="w-full p-2 border rounded mt-1"
                            value={currentPatientData.name || ''}
                            onChange={e => setCurrentPatientData({ ...currentPatientData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Yaş</label>
                            <input required type="number" className="w-full p-2 border rounded mt-1"
                                value={currentPatientData.age || ''}
                                onChange={e => setCurrentPatientData({ ...currentPatientData, age: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Cinsiyet</label>
                            <select className="w-full p-2 border rounded mt-1"
                                value={currentPatientData.gender}
                                onChange={e => setCurrentPatientData({ ...currentPatientData, gender: e.target.value as Gender })}>
                                <option value={Gender.Male}>Erkek</option>
                                <option value={Gender.Female}>Kadın</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Telefon</label>
                        <input type="tel" className="w-full p-2 border rounded mt-1"
                            value={currentPatientData.phone || ''}
                            onChange={e => setCurrentPatientData({ ...currentPatientData, phone: e.target.value })} />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-semibold mb-3 text-blue-900">Sigara Kullanım Bilgisi</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Günlük Sigara Sayısı</label>
                                <input required type="number" min="1" max="100" className="w-full p-2 border rounded mt-1"
                                    value={currentPatientData.dailyAmount || ''}
                                    onChange={e => setCurrentPatientData({ ...currentPatientData, dailyAmount: Number(e.target.value) })} />
                                <span className="text-xs text-gray-500">adet / gün</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Sigaraya Başlama Yaşı</label>
                                <input required type="number" min="5" max="80" className="w-full p-2 border rounded mt-1"
                                    value={currentPatientData.firstSmokingAge || ''}
                                    onChange={e => setCurrentPatientData({ ...currentPatientData, firstSmokingAge: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h3 className="font-semibold mb-2 text-red-900">Ek Hastalıklar / Durumlar</h3>
                        <p className="text-xs text-red-700 mb-3">Tedavi önerisi için lütfen uygun olanları işaretleyiniz.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.values(COMORBIDITIES).map((disease) => (
                                <label key={disease} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded text-teal-600 focus:ring-teal-500"
                                        checked={(currentPatientData.comorbidities || []).includes(disease)}
                                        onChange={() => toggleComorbidity(disease)}
                                    />
                                    <span>{disease}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>İptal</Button>
                        <Button type="submit">
                            {currentPatientData.id ? 'Değişiklikleri Kaydet' : 'Kaydet ve Başla'}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Danışan Listesi</h2>
                <Button onClick={handleAddNew}>+ Yeni Danışan</Button>
            </div>

            {patients.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-slate-500 mb-4">Henüz kayıtlı danışan bulunmamaktadır.</p>
                    <Button onClick={handleAddNew} variant="outline">İlk Kaydı Oluştur</Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {patients.map(patient => (
                        <div key={patient.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{patient.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {patient.age} Yaş | {patient.gender} | Günlük: {patient.dailyAmount} dal
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400">
                                        Kayıt: {new Date(patient.createdAt).toLocaleDateString('tr-TR')}
                                        {patient.visits.length > 0 && ` • Son İşlem: ${patient.visits[patient.visits.length - 1].date}`}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Button variant="secondary" className="w-full text-center" onClick={() => onSelectPatient(patient)}>
                                        Dosyayı Aç / Müdahale
                                    </Button>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={(e) => handleEdit(e, patient)}
                                            className="flex-1 px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                                        >
                                            Düzenle ✏️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, patient.id, patient.name)}
                                            className="flex-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium transition-colors"
                                        >
                                            Sil 🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

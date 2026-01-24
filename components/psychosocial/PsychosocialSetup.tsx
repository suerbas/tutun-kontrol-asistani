import React, { useState } from 'react';
import { Patient, SpecialProfile } from '../../types';
import { MOTIVATION_CATEGORIES } from '../../constants';
import { Button } from '../Button';

interface PsychosocialSetupProps {
    patient: Patient;
    initialProfile: SpecialProfile;
    initialMotivation: string;
    hasPsychosocialStatus: boolean;
    onCancel: () => void;
    onStart: (profile: SpecialProfile, motivation: string, selectedCategory: string | null) => void;
}

export const PsychosocialSetup: React.FC<PsychosocialSetupProps> = ({
    patient,
    initialProfile,
    initialMotivation,
    hasPsychosocialStatus,
    onCancel,
    onStart
}) => {
    const [setupProfile, setSetupProfile] = useState<SpecialProfile>(initialProfile);
    const [setupMotivation, setSetupMotivation] = useState(initialMotivation);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Helper to handle multiple motivation selections
    const toggleMotivation = (item: string) => {
        const currentParts = setupMotivation.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (currentParts.includes(item)) {
            const newParts = currentParts.filter(p => p !== item);
            setSetupMotivation(newParts.join(', '));
        } else {
            currentParts.push(item);
            setSetupMotivation(currentParts.join(', '));
        }
    };

    // Helper to check if any item from a category is selected
    const isCategorySelected = (catId: string) => {
        const category = MOTIVATION_CATEGORIES.find(c => c.id === catId);
        if (!category) return false;
        const currentParts = setupMotivation.split(',').map(s => s.trim());
        return category.examples.some(ex => currentParts.includes(ex));
    };

    const handleStart = () => {
        if (!setupMotivation) {
            alert("Lütfen en güçlü motivasyon kaynağını giriniz.");
            return;
        }
        onStart(setupProfile, setupMotivation, selectedCategory);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 border border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <h3 className="text-blue-900 font-bold mb-1">Otomatik Profil Algılandı</h3>
                <p className="text-blue-800 text-sm">
                    Danışan kayıt verilerine göre (Ek Hastalıklar: {patient.comorbidities.join(', ') || 'Yok'}) uygun profil seçilmiştir. Gerekirse manuel değiştirebilirsiniz.
                </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-3">🛠️</span>
                Görüşme Kurulumu
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">1. Hasta Profili Seçiniz</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.values(SpecialProfile).map((p) => (
                            <button
                                key={p}
                                onClick={() => setSetupProfile(p)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${setupProfile === p
                                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md'
                                    : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                {p}
                                {p === initialProfile && <span className="float-right text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Önerilen</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">2. En Güçlü Motivasyon Kaynağı</label>
                    <p className="text-xs text-gray-500 mb-3">Birden fazla seçenek belirleyebilirsiniz. Seçimler aşağıya otomatik eklenecektir.</p>

                    {!selectedCategory ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {MOTIVATION_CATEGORIES.map(cat => {
                                const isSelected = isCategorySelected(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`p-4 rounded-xl border transition-all flex flex-col items-center text-center group
                                            ${isSelected
                                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                                : 'border-gray-200 hover:border-purple-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                                        <span className="font-bold text-slate-800 text-sm">{cat.label}</span>
                                        {isSelected && <span className="text-xs text-purple-600 font-bold mt-1">Seçim Yapıldı ✓</span>}
                                        <span className="text-xs text-slate-500 mt-1">{cat.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-2">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-sm text-purple-600 hover:underline flex items-center font-medium"
                                >
                                    ← Kategorilere Dön
                                </button>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm font-bold text-slate-700">
                                    {MOTIVATION_CATEGORIES.find(c => c.id === selectedCategory)?.icon} {MOTIVATION_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {MOTIVATION_CATEGORIES.find(c => c.id === selectedCategory)?.examples.map((ex, idx) => {
                                    const isActive = setupMotivation.includes(ex);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => toggleMotivation(ex)}
                                            className={`px-3 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 ${isActive
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                : 'bg-white text-slate-700 border-gray-300 hover:border-purple-400'
                                                }`}
                                        >
                                            {isActive && <span>✓</span>}
                                            {ex}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="secondary" onClick={onCancel}>İptal</Button>
                    <Button onClick={handleStart} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg">
                        {hasPsychosocialStatus ? 'Güncelle ve Başlat' : 'Görüşmeyi Başlat →'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

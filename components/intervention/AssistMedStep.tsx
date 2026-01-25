import React from 'react';
import { Patient, COMORBIDITIES } from '../../types';
import { Button } from '../Button';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';
import { PHARMACOLOGICAL_TREATMENTS, FIVE_R_DETAILS } from '../../constants';

interface AssistMedStepProps {
    patient: Patient;
    score: number;
    isReady: boolean | null;
    selectedTreatment: string;
    notes: string;
    activeRStep: number;
    selectedRItems: string[];
    onSetSelectedTreatment: (treatment: string) => void;
    onSetNotes: (notes: string) => void;
    onSetActiveRStep: (step: number) => void;
    onToggleRItem: (itemId: string) => void;
    onBack: () => void;
    onSaveVisit: () => void;
}

export const AssistMedStep: React.FC<AssistMedStepProps> = ({
    patient,
    score,
    isReady,
    selectedTreatment,
    notes,
    activeRStep,
    selectedRItems,
    onSetSelectedTreatment,
    onSetNotes,
    onSetActiveRStep,
    onToggleRItem,
    onBack,
    onSaveVisit
}) => {
    // === CLINICAL RECOMMENDATION ENGINE ===
    const getClinicalRecommendation = (): { name: string; reason: string; priority: 'high' | 'medium' | 'low' } => {
        const has = (comorbidity: string) => patient.comorbidities.includes(comorbidity);
        if (has(COMORBIDITIES.PREGNANCY)) return { name: 'Nikotin Replasman Tedavisi (NRT) - Sakız', reason: 'Gebelerde ilk tercih davranışsal destektir. İlaç gerekirse, aralıklı formlar tercih edilir.', priority: 'high' };
        if (has(COMORBIDITIES.EPILEPSY)) {
            if (score >= 7) return { name: 'Vareniklin', reason: 'Yüksek bağımlılık skoru nedeniyle güçlü ajan gerekir. Epilepsi öyküsü olduğu için Bupropion kontrendikedir.', priority: 'high' };
            return { name: 'Nikotin Replasman Tedavisi (NRT) - Bant', reason: 'Epilepsi nedeniyle Bupropion kullanılamaz. NRT Bant güvenli ve etkilidir.', priority: 'high' };
        }
        if (has(COMORBIDITIES.DEPRESSION)) return { name: 'Bupropion HCl', reason: 'Hastanın depresyon öyküsü mevcuttur. Bupropion antidepresan özellik de taşır.', priority: 'medium' };
        if (score >= 7 || patient.dailyAmount > 20) {
            if (has(COMORBIDITIES.RENAL)) return { name: 'Nikotin Replasman Tedavisi (NRT) - Bant', reason: 'Yüksek bağımlılık var ancak böbrek yetmezliği nedeniyle NRT daha güvenlidir.', priority: 'medium' };
            return { name: 'Vareniklin', reason: `Bağımlılık skoru yüksek (${score}/10). Vareniklin en etkili seçenektir.`, priority: 'high' };
        }
        if (has(COMORBIDITIES.SKIN_SENSITIVITY)) return { name: 'Vareniklin', reason: 'Cilt hassasiyeti nedeniyle NRT Bant tavsiye edilmez. Oral formlar tercih edilmelidir.', priority: 'medium' };
        if (score <= 3 && patient.dailyAmount < 10) return { name: 'Sadece Davranışsal', reason: 'Fiziksel bağımlılık düşük. Davranışsal destek yeterli olabilir.', priority: 'medium' };
        return { name: 'Nikotin Replasman Tedavisi (NRT) - Bant', reason: 'Orta düzey bağımlılık için standart başlangıç tedavisidir.', priority: 'low' };
    };

    const getTreatmentReasoning = (treatmentName: string) => {
        const reasons: { type: 'success' | 'warning' | 'info'; text: string }[] = [];
        if (treatmentName.includes('Bupropion')) {
            if (patient.comorbidities.includes(COMORBIDITIES.DEPRESSION)) reasons.push({ type: 'success', text: 'Bupropion depresyon öyküsü için iyi bir seçenektir.' });
            if (patient.comorbidities.includes(COMORBIDITIES.EPILEPSY)) reasons.push({ type: 'warning', text: 'KONTRENDİKASYON: Epilepsi öyküsünde Bupropion kullanılmamalıdır!' });
        }
        if (treatmentName.includes('Bant')) {
            if (patient.dailyAmount > 20) reasons.push({ type: 'info', text: `Hasta günde ${patient.dailyAmount} sigara içtiği için TAM DOZ (21mg) başlanmalıdır.` });
            if (patient.comorbidities.includes(COMORBIDITIES.SKIN_SENSITIVITY)) reasons.push({ type: 'warning', text: 'Cilt hassasiyeti varsa bant tahriş yapabilir.' });
        }
        if (treatmentName.includes('Vareniklin')) {
            reasons.push({ type: 'success', text: 'Yüksek bağımlılıkta en etkili ajanlardan biridir.' });
            if (patient.comorbidities.includes(COMORBIDITIES.RENAL)) reasons.push({ type: 'warning', text: 'Böbrek yetmezliğinde doz ayarlaması gerekir.' });
        }
        return reasons;
    };

    // 5R Mode
    if (!isReady) {
        const currentR = FIVE_R_DETAILS[activeRStep];
        return (
            <Wrapper title={`MÜDAHALE: 5R - ${currentR.title}`} currentStep={InterventionStep.Assist_Med} isReady={isReady}>
                <div className="flex mb-6 space-x-1 overflow-x-auto pb-2">
                    {FIVE_R_DETAILS.map((r, idx) => (
                        <button key={r.id} onClick={() => onSetActiveRStep(idx)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${idx === activeRStep ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                            {r.id.charAt(0).toUpperCase() + r.id.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-500 uppercase mb-1">Hedef</h4>
                            <p className="text-sm text-blue-900">{currentR.goal}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border-2 border-red-100">
                            <h4 className="font-bold text-slate-800 mb-2">Hastaya Sorunuz:</h4>
                            <p className="text-lg text-slate-700 italic">"{currentR.question}"</p>
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <h4 className="font-bold text-slate-700 mb-3">Danışanın Cevapları:</h4>
                        <div className="space-y-2">
                            {currentR.items.map((item) => (
                                <button key={item.id} onClick={() => onToggleRItem(item.id)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center ${selectedRItems.includes(item.id) ? 'bg-red-50 border-red-500 ring-1 ring-red-500' : 'bg-white border-gray-200 hover:border-red-300'}`}>
                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center flex-shrink-0 ${selectedRItems.includes(item.id) ? 'bg-red-600 border-red-600' : 'border-gray-400'}`}>
                                        {selectedRItems.includes(item.id) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className="text-slate-800 font-medium">{item.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-6 border-t">
                    <Button variant="secondary" onClick={() => { activeRStep > 0 ? onSetActiveRStep(activeRStep - 1) : onBack(); }}>
                        {activeRStep === 0 ? 'Geri Dön' : '← Önceki Adım'}
                    </Button>
                    {activeRStep < FIVE_R_DETAILS.length - 1 ? (
                        <Button onClick={() => onSetActiveRStep(activeRStep + 1)}>Sonraki Adım →</Button>
                    ) : (
                        <Button onClick={onSaveVisit} className="bg-red-600 hover:bg-red-700">Görüşmeyi Kaydet</Button>
                    )}
                </div>
            </Wrapper>
        );
    }

    // Medication Selection
    const selectedDrugInfo = PHARMACOLOGICAL_TREATMENTS.find(d => d.name === selectedTreatment);
    const reasons = getTreatmentReasoning(selectedTreatment);
    const recommendation = getClinicalRecommendation();

    return (
        <Wrapper title="4. ASSIST (TEDAVİ SEÇİMİ) & 5. ARRANGE (İZLEM)" currentStep={InterventionStep.Assist_Med} isReady={isReady}>
            <div className={`mb-6 p-4 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between ${recommendation.priority === 'high' ? 'bg-teal-50 border-teal-500' : 'bg-blue-50 border-blue-500'}`}>
                <div className="flex-grow">
                    <h3 className={`font-bold text-sm uppercase flex items-center mb-1 ${recommendation.priority === 'high' ? 'text-teal-800' : 'text-blue-800'}`}>
                        <span className="text-xl mr-2">🤖</span> Klinik Karar Destek Önerisi
                    </h3>
                    <div className="ml-7">
                        <p className="font-bold text-lg text-slate-800">{recommendation.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{recommendation.reason}</p>
                    </div>
                </div>
                <button onClick={() => onSetSelectedTreatment(recommendation.name)}
                    className={`mt-3 md:mt-0 md:ml-4 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${recommendation.priority === 'high' ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    Bu Tedaviyi Seç ✓
                </button>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-5 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b pb-2">Tedavi Yöntemi</h3>
                    <select className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg" value={selectedTreatment} onChange={(e) => onSetSelectedTreatment(e.target.value)}>
                        <option value="">-- Seçiniz --</option>
                        <option value="Sadece Davranışsal">Sadece Davranışsal Destek (İlaçsız)</option>
                        <option disabled>──────────</option>
                        {PHARMACOLOGICAL_TREATMENTS.map((drug, idx) => <option key={idx} value={drug.name}>{drug.name}</option>)}
                    </select>
                    {selectedTreatment && reasons.length > 0 && (
                        <div className="bg-white border rounded-lg p-3 space-y-2 shadow-sm">
                            <h4 className="font-bold text-xs text-gray-500 uppercase">Bu Hasta İçin Analiz</h4>
                            {reasons.map((r, i) => (
                                <div key={i} className={`text-sm p-2 rounded flex items-start ${r.type === 'success' ? 'bg-green-50 text-green-800' : r.type === 'warning' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                                    <span className="mr-2">{r.type === 'success' ? '✅' : r.type === 'warning' ? '⚠️' : 'ℹ️'}</span>{r.text}
                                </div>
                            ))}
                        </div>
                    )}
                    <div>
                        <label className="block font-bold text-slate-700 mb-2 text-sm">Klinik Notlar:</label>
                        <textarea className="w-full border rounded p-2 h-20 text-sm" placeholder="Özel notlar..." value={notes} onChange={(e) => onSetNotes(e.target.value)}></textarea>
                    </div>
                </div>
                <div className="md:col-span-7">
                    {selectedTreatment && selectedTreatment !== 'Sadece Davranışsal' && selectedDrugInfo ? (
                        <div className="bg-white border-2 border-teal-100 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                            <div className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
                                <h3 className="font-bold text-teal-900 text-lg">{selectedDrugInfo.commercialName} Protokolü</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">💊 Başlangıç Dozu</h4>
                                    <p className="text-slate-700 bg-blue-50 p-3 rounded-lg">{selectedDrugInfo.dosage}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">📈 Titrasyon</h4>
                                    <p className="text-slate-600 text-sm whitespace-pre-line">{selectedDrugInfo.titration}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">⚠️ Yan Etkiler</h4>
                                    <div className="space-y-2">
                                        {selectedDrugInfo.sideEffects.map((item, i) => (
                                            <div key={i} className="bg-orange-50 p-3 rounded-lg text-sm">
                                                <div className="font-bold text-red-700">{item.effect}</div>
                                                <div className="text-slate-700 text-xs mt-1">→ {item.management}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : selectedTreatment === 'Sadece Davranışsal' ? (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-full flex flex-col items-center justify-center text-center text-blue-800">
                            <h3 className="text-xl font-bold mb-2">İlaçsız Takip</h3>
                            <p>Farmakolojik tedavi başlanmadı. Davranışsal destek uygulanacak.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-4">💊</span>
                            <p>Soldan bir tedavi seçiniz.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-auto pt-6">
                <Button variant="secondary" onClick={onBack}>Geri</Button>
                <Button onClick={onSaveVisit} disabled={!selectedTreatment} className="px-8">Tedaviyi Onayla ve Bitir</Button>
            </div>
        </Wrapper>
    );
};

import React from 'react';
import { Patient, Visit, TreatmentStatus } from '../../types';
import { PHARMACOLOGICAL_TREATMENTS } from '../../constants';
import { patientService } from '../../services/patientService';
import { scrubText } from '../../services/deidentify';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';
import { Button } from '../Button';

interface DrugFollowUpProps {
    patient: Patient;
    adherence: 'full' | 'partial' | 'none' | null;
    setAdherence: (v: 'full' | 'partial' | 'none' | null) => void;
    smokingStatus: 'clean' | 'slipped' | null;
    setSmokingStatus: (v: 'clean' | 'slipped' | null) => void;
    hasSideEffects: boolean | null;
    setHasSideEffects: (v: boolean | null) => void;
    notes: string;
    setNotes: (v: string) => void;
    onBack: () => void;
    onComplete: () => void;
    onSwitchToPsychosocial?: () => void;
}

const END_REASONS = [
    'Tedavi tamamlandı',
    'Tedavi bırakıldı (uyumsuz)',
    'Yan etki nedeniyle sonlandırıldı'
];

export const DrugFollowUp: React.FC<DrugFollowUpProps> = ({
    patient, adherence, setAdherence, smokingStatus, setSmokingStatus,
    hasSideEffects, setHasSideEffects, notes, setNotes, onBack, onComplete, onSwitchToPsychosocial
}) => {
    const treatment = patient.activeTreatment;
    const drugInfo = PHARMACOLOGICAL_TREATMENTS.find(t => t.name === treatment?.drugName);

    // Tedavi sonlandırma: hekim seçimi; uyumsuzlukta otomatik olarak sonlandırılır.
    const [endReason, setEndReason] = React.useState<string | null>(null);
    const effectiveEnd = endReason ?? (adherence === 'none' ? END_REASONS[1] : null);

    const getRecommendation = () => {
        if (adherence === 'none') {
            return { type: 'danger', icon: '🚨', title: 'Tedavi Kesintisi - Acil Müdahale', text: 'Hasta ilacı bırakmış. Motivasyonel görüşmeye geri dönüş veya alternatif tedavi düşünülebilir.' };
        }
        if (smokingStatus === 'slipped' && adherence === 'full') {
            return { type: 'warning', icon: '⚠️', title: 'Kayma (Slip) Durumu', text: 'Hasta ilacı kullanıyor ama sigara içmiş. Tetikleyicileri gözden geçirin.' };
        }
        if (adherence === 'partial') {
            return { type: 'warning', icon: '📋', title: 'Uyum Sorunu', text: 'Hasta bazen ilacı atlıyor. İlaç hatırlatıcısı önerilmeli.' };
        }
        if (smokingStatus === 'clean' && (adherence === 'full' || adherence === 'partial')) {
            return { type: 'success', icon: '🎉', title: 'Başarılı İlerleyiş', text: 'Hasta sigara içmemiş ve tedaviye devam ediyor. Tebrik edin!' };
        }
        return null;
    };

    const recommendation = getRecommendation();
    const canComplete = adherence !== null && smokingStatus !== null;

    const handleComplete = () => {
        const adherenceText = adherence === 'full' ? 'Tam Uyumlu' : adherence === 'partial' ? 'Kısmi Uyumlu' : 'Uyumsuz';
        const smokingText = smokingStatus === 'clean' ? 'Sigara içmemiş' : 'Kayma yaşamış';
        const sideEffectText = hasSideEffects ? 'Yan etki var' : 'Yan etki yok';

        const today = new Date().toLocaleDateString('tr-TR');
        const endedText = effectiveEnd ? ` Tedavi sonlandırıldı: ${effectiveEnd}.` : '';
        const visit: Visit = {
            id: Date.now().toString(),
            date: today,
            status: adherence === 'none' ? TreatmentStatus.DropOut : TreatmentStatus.Active,
            notes: `İlaç Takip: ${treatment?.commercialName || treatment?.drugName}. Uyum: ${adherenceText}. ${smokingText}. ${sideEffectText}. ${scrubText(notes)}${endedText}`,
            treatmentType: 'İlaç Takip'
        };
        const updatedPatient: Patient = {
            ...patient,
            visits: [...patient.visits, visit],
            activeTreatment: treatment && effectiveEnd
                ? { ...treatment, isActive: false, endDate: today, endReason: effectiveEnd }
                : treatment
        };
        patientService.savePatient(updatedPatient);
        onComplete();
    };

    return (
        <Wrapper title="İLAÇ TEDAVİSİ TAKİBİ" currentStep={InterventionStep.Drug_Follow_Up} isReady={null}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Mevcut Tedavi */}
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-teal-600 uppercase">Aktif Tedavi</span>
                            <h3 className="text-2xl font-bold text-teal-900 mt-1">💊 {treatment?.commercialName || treatment?.drugName}</h3>
                            <p className="text-sm text-teal-700 mt-1">{treatment?.dosage}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-teal-600">Başlangıç</span>
                            <p className="font-bold text-teal-900">{treatment?.startDate}</p>
                        </div>
                    </div>
                </div>

                {/* Yan Etki */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-4 flex items-center"><span className="mr-2">⚠️</span> Yan Etki Sorgulaması</h4>
                    <p className="text-orange-800 mb-4">Danışana sorunuz: "İlacı kullanırken rahatsızlık hissettiniz mi?"</p>
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                        <button onClick={() => setHasSideEffects(false)} className={`p-4 rounded-xl text-center transition-all ${hasSideEffects === false ? 'bg-green-200 border-2 border-green-500 ring-2 ring-green-300' : 'bg-green-100 border-2 border-green-300 hover:bg-green-200'}`}>
                            <span className="text-2xl block mb-1">👍</span><span className="font-bold text-green-900">Hayır, sorun yok</span>
                        </button>
                        <button onClick={() => setHasSideEffects(true)} className={`p-4 rounded-xl text-center transition-all ${hasSideEffects === true ? 'bg-orange-200 border-2 border-orange-500 ring-2 ring-orange-300' : 'bg-orange-100 border-2 border-orange-300 hover:bg-orange-200'}`}>
                            <span className="text-2xl block mb-1">😟</span><span className="font-bold text-orange-900">Evet, yan etki var</span>
                        </button>
                    </div>
                    {hasSideEffects && drugInfo && drugInfo.sideEffects.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-orange-200 mt-4">
                            <p className="text-sm font-bold text-orange-800 mb-3">Olası yan etkiler ve yönetimi:</p>
                            <div className="grid md:grid-cols-2 gap-2">
                                {drugInfo.sideEffects.map((se, i) => (
                                    <div key={i} className="bg-orange-50 p-2 rounded border text-sm">
                                        <span className="font-bold text-orange-800">{se.effect}</span>
                                        <p className="text-gray-600 text-xs mt-1">→ {se.management}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Uyum */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center"><span className="mr-2">📊</span> Tedavi Uyumu</h4>
                    <p className="text-blue-800 mb-4">Danışana sorunuz: "İlacınızı düzenli kullanıyor musunuz?"</p>
                    <div className="grid md:grid-cols-3 gap-3">
                        <button onClick={() => setAdherence('full')} className={`p-4 rounded-xl text-center transition-all ${adherence === 'full' ? 'bg-green-200 border-2 border-green-500 ring-2 ring-green-300' : 'bg-green-100 border-2 border-green-300 hover:bg-green-200'}`}>
                            <span className="text-2xl block mb-1">✅</span><span className="font-bold text-green-900">Tam Uyumlu</span><span className="text-xs text-green-700 block">Düzenli kullanıyor</span>
                        </button>
                        <button onClick={() => setAdherence('partial')} className={`p-4 rounded-xl text-center transition-all ${adherence === 'partial' ? 'bg-yellow-200 border-2 border-yellow-500 ring-2 ring-yellow-300' : 'bg-yellow-100 border-2 border-yellow-300 hover:bg-yellow-200'}`}>
                            <span className="text-2xl block mb-1">⚡</span><span className="font-bold text-yellow-900">Kısmi Uyumlu</span><span className="text-xs text-yellow-700 block">Bazen atlıyor</span>
                        </button>
                        <button onClick={() => setAdherence('none')} className={`p-4 rounded-xl text-center transition-all ${adherence === 'none' ? 'bg-red-200 border-2 border-red-500 ring-2 ring-red-300' : 'bg-red-100 border-2 border-red-300 hover:bg-red-200'}`}>
                            <span className="text-2xl block mb-1">❌</span><span className="font-bold text-red-900">Uyumsuz</span><span className="text-xs text-red-700 block">Bırakmış</span>
                        </button>
                    </div>
                </div>

                {/* Sigara */}
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center"><span className="mr-2">🚭</span> Sigara Kullanım Durumu</h4>
                    <p className="text-purple-800 mb-4">Danışana sorunuz: "Son kontrolden bu yana sigara içtiniz mi?"</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        <button onClick={() => setSmokingStatus('clean')} className={`p-4 rounded-xl text-center transition-all ${smokingStatus === 'clean' ? 'bg-green-200 border-2 border-green-500 ring-2 ring-green-300' : 'bg-green-100 border-2 border-green-300 hover:bg-green-200'}`}>
                            <span className="text-2xl block mb-1">🎉</span><span className="font-bold text-green-900">Hayır, içmedim</span>
                        </button>
                        <button onClick={() => setSmokingStatus('slipped')} className={`p-4 rounded-xl text-center transition-all ${smokingStatus === 'slipped' ? 'bg-yellow-200 border-2 border-yellow-500 ring-2 ring-yellow-300' : 'bg-yellow-100 border-2 border-yellow-300 hover:bg-yellow-200'}`}>
                            <span className="text-2xl block mb-1">😔</span><span className="font-bold text-yellow-900">Evet, kaydım oldu</span>
                        </button>
                    </div>
                </div>

                {/* Öneri */}
                {recommendation && (
                    <div className={`p-6 rounded-xl border-2 ${recommendation.type === 'success' ? 'bg-green-50 border-green-300' : recommendation.type === 'warning' ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}`}>
                        <h4 className={`font-bold mb-2 flex items-center text-lg ${recommendation.type === 'success' ? 'text-green-900' : recommendation.type === 'warning' ? 'text-yellow-900' : 'text-red-900'}`}>
                            <span className="mr-2 text-2xl">{recommendation.icon}</span>{recommendation.title}
                        </h4>
                        <p className={recommendation.type === 'success' ? 'text-green-800' : recommendation.type === 'warning' ? 'text-yellow-800' : 'text-red-800'}>{recommendation.text}</p>
                        {recommendation.type === 'danger' && onSwitchToPsychosocial && (
                            <button onClick={onSwitchToPsychosocial} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">Motivasyonel Görüşmeye Dön</button>
                        )}
                    </div>
                )}

                {/* Tedavi Durumu */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-slate-800 mb-2">Tedavi Durumu</h4>
                    <p className="text-sm text-slate-600 mb-4">Tedaviye devam ediliyor mu, yoksa bu kayıtla sonlandırılacak mı?</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        <button onClick={() => setEndReason(null)}
                            className={`p-3 rounded-xl text-left border-2 transition-all ${effectiveEnd === null ? 'bg-teal-100 border-teal-500' : 'bg-white border-gray-200 hover:border-teal-300'}`}>
                            <span className="font-bold text-teal-900">Tedaviye devam ediyor</span>
                        </button>
                        {END_REASONS.map(reason => (
                            <button key={reason} onClick={() => setEndReason(reason)}
                                className={`p-3 rounded-xl text-left border-2 transition-all ${effectiveEnd === reason ? 'bg-red-100 border-red-500' : 'bg-white border-gray-200 hover:border-red-300'}`}>
                                <span className="font-bold text-slate-800">{reason}</span>
                            </button>
                        ))}
                    </div>
                    {effectiveEnd && (
                        <p className="text-sm text-red-700 mt-3">Kayıt tamamlandığında ilaç tedavisi sonlandırılacak: <strong>{effectiveEnd}</strong>.</p>
                    )}
                </div>

                {/* Notes */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <label className="block font-bold text-slate-700 mb-2">Kontrol Notu:</label>
                    <textarea className="w-full border rounded-lg p-3 h-24 text-sm" placeholder="Yan etkiler, uyum durumu, öneriler..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                    <p className="text-xs text-gray-500 mt-1">Kişi/yer adları, tarih ve iletişim bilgileri kaydedilirken maskelenir.</p>
                </div>

                <div className="flex justify-between pt-4 border-t">
                    <Button variant="secondary" onClick={onBack}>← Panele Dön</Button>
                    <Button disabled={!canComplete} onClick={handleComplete}>Kontrolü Tamamla ✓</Button>
                </div>
            </div>
        </Wrapper>
    );
};

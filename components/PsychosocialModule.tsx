

import React, { useState, useEffect } from 'react';
import { Patient, Visit, TreatmentStatus, SpecialProfile, AppScreen, PsychosocialStatus, COMORBIDITIES } from '../types';
import { PSYCHOSOCIAL_SCENARIOS, ScenarioStep, MOTIVATION_CATEGORIES } from '../constants';
import { patientService } from '../services/patientService';
import { Button } from './Button';
import { CBTTools } from './CBTTools';

interface PsychosocialProps {
    patient: Patient;
    onBack: () => void;
    onSwitchToIntervention?: () => void;
}

interface SessionState {
    patientName: string;
    profile: SpecialProfile;
    motivation: string;
    currentStepId: string;
    history: string[];
    homework: string;
    notes: string[];
    selectedScore?: number;
}

export const PsychosocialModule: React.FC<PsychosocialProps> = ({ patient, onBack, onSwitchToIntervention }) => {
    // Determine initial profile based on comorbidities and age
    const getInitialProfile = (): SpecialProfile => {
        if (patient.psychosocialStatus?.profile) return patient.psychosocialStatus.profile;

        // Auto-detect based on registration data
        if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) return SpecialProfile.Pregnant;
        if (patient.comorbidities.includes(COMORBIDITIES.COPD)) return SpecialProfile.COPD;
        if (patient.age < 18) return SpecialProfile.Under18;

        return SpecialProfile.General;
    };

    const initialProfile = getInitialProfile();

    // Kurulum Modu (Setup) vs Dashboard vs Görüşme Modu
    const [view, setView] = useState<'SETUP' | 'DASHBOARD' | 'INTERVIEW'>(
        patient.psychosocialStatus ? 'DASHBOARD' : 'SETUP'
    );

    const [sessionState, setSessionState] = useState<SessionState>({
        patientName: patient.name,
        profile: initialProfile,
        motivation: patient.psychosocialStatus?.motivation || '',
        currentStepId: '',
        history: [],
        homework: patient.psychosocialStatus?.homework || '',
        notes: []
    });

    const [showSOS, setShowSOS] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [setupProfile, setSetupProfile] = useState<SpecialProfile>(initialProfile);
    const [setupMotivation, setSetupMotivation] = useState(patient.psychosocialStatus?.motivation || '');
    const [showCBTTools, setShowCBTTools] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Update setup profile if patient changes or new data comes in
    useEffect(() => {
        if (!patient.psychosocialStatus) {
            setSetupProfile(getInitialProfile());
        }
    }, [patient]);

    const startSession = (isFollowUp: boolean = false) => {
        if (!setupMotivation) {
            alert("Lütfen en güçlü motivasyon kaynağını giriniz.");
            return;
        }

        let startStep = 'INTRO_GENERAL';

        // Eğer takip seansı ise ve önceki durum biliniyorsa, ödev kontrolü ile başla
        if (isFollowUp) {
            // Hangi ödevi vermiştik?
            const lastHomework = patient.psychosocialStatus?.homework || '';

            // Eğer "Ters El" ödevi verildiyse, mekanik takip senaryosunu aç
            if (lastHomework.includes('Ödevsiz Takip')) {
                // Pasif takipte olan hastaya ödev sorulmaz, ilişki sorulur.
                startStep = 'FOLLOWUP_PASSIVE';
            } else if (lastHomework.includes('Ters El')) {
                startStep = 'FOLLOWUP_CHECK_MECHANICAL';
            } else {
                startStep = 'FOLLOWUP_CHECK';
            }
        } else if (selectedCategory === 'forced') {
            // YENİ: Zorla gelen hasta için doğrudan direnç yönetimine git
            startStep = 'RESISTANCE_DIRECT';
        } else {
            // İlk seans için profil bazlı giriş
            if (setupProfile === SpecialProfile.Pregnant) startStep = 'INTRO_PREGNANT';
            else if (setupProfile === SpecialProfile.Under18) startStep = 'INTRO_UNDER18';
            else if (setupProfile === SpecialProfile.COPD) startStep = 'INTRO_COPD';
        }

        setSessionState(prev => ({
            ...prev,
            profile: setupProfile,
            motivation: setupMotivation,
            currentStepId: startStep,
            history: [startStep],
            notes: isFollowUp ? [`${(patient.psychosocialStatus?.sessionCount || 0) + 1}. takip seansı başladı.`] : []
        }));
        setView('INTERVIEW');
    };

    const handleNextStep = (nextStepId: string, insight?: string, homework?: string) => {
        if (nextStepId === 'FINISH') {
            // ÖNEMLİ: FINISH'e gitmeden önce homework ve insight'ı state'e kaydet!
            setSessionState(prev => ({
                ...prev,
                history: [...prev.history, 'FINISH'],
                notes: insight ? [...prev.notes, insight] : prev.notes,
                homework: homework || prev.homework
            }));
            setShowFinishModal(true);
            return;
        }

        let actualNextStep = nextStepId;

        // YENİ: Otomatik Yönlendirme Mantığı (CALCULATED_PATH)
        // Kullanıcının verdiği puana göre senaryoyu 3 ana yola ayırır.
        if (nextStepId === 'CALCULATED_PATH') {
            // Puan tanımsız ise 0 varsayalım (Güvenlik)
            const score = sessionState.selectedScore ?? 0;
            let pathDescription = '';

            if (score <= 3) {
                // 0-3 Puan: Direnç Yolu
                // Hasta bırakmaya hazır değil, engelleri ve korkuları var.
                actualNextStep = 'RESISTANCE_ENTRY';
                pathDescription = 'Direnç Yolu (Düşük Hazır Oluş)';
            } else if (score <= 7) {
                // 4-7 Puan: İkilem Yolu
                // Hasta kararsız (Ambivalans), bir yanı istiyor bir yanı istemiyor.
                actualNextStep = 'AMBIVALENCE_ENTRY';
                pathDescription = 'İkilem Yolu (Kararsızlık)';
            } else {
                // 8-10 Puan: Eylem Yolu
                // Hasta hazır, planlama ve baş etme stratejileri (BDT) çalışılır.
                actualNextStep = 'ACTION_PATH';
                pathDescription = 'Eylem Yolu (Yüksek Motivasyon)';
            }

            // Rapora bu otomatik yönlendirmeyi not düşelim
            insight = `Hazır Oluş Puanı (${score}) analizi: ${pathDescription} seçildi.`;
        }

        setSessionState(prev => ({
            ...prev,
            currentStepId: actualNextStep,
            history: [...prev.history, actualNextStep],
            notes: insight ? [...prev.notes, insight] : prev.notes,
            homework: homework || prev.homework
        }));
    };

    const handleBack = () => {
        if (sessionState.history.length <= 1) return;
        const newHistory = [...sessionState.history];
        newHistory.pop();
        const prevStepId = newHistory[newHistory.length - 1];
        setSessionState(prev => ({
            ...prev,
            history: newHistory,
            currentStepId: prevStepId
        }));
    };

    const saveAndExit = () => {
        // Calculate new status
        const currentScore = sessionState.selectedScore;
        let stage: 'Resistance' | 'Ambivalence' | 'Action' | undefined;

        // 1. Skora göre evre belirle
        if (currentScore !== undefined) {
            if (currentScore <= 3) stage = 'Resistance';
            else if (currentScore <= 7) stage = 'Ambivalence';
            else stage = 'Action';
        }

        // 2. Skor yoksa, izlenen yola (History) göre evre çıkarımı yap
        if (!stage) {
            const historyStr = sessionState.history.join(',');
            if (historyStr.includes('RESISTANCE') || historyStr.includes('HOMEWORK_OBSERVE') || historyStr.includes('PASSIVE_FOLLOWUP')) {
                stage = 'Resistance';
            } else if (historyStr.includes('AMBIVALENCE')) {
                stage = 'Ambivalence';
            } else if (historyStr.includes('ACTION') || historyStr.includes('CBT')) {
                stage = 'Action';
            }
        }

        // 3. Hala belirlenemedi ise eski durumu koru
        if (!stage && patient.psychosocialStatus?.lastStage) {
            stage = patient.psychosocialStatus.lastStage;
        }

        // 4. Varsayılan (Hiçbir veri yoksa ve ödev verildiyse genellikle dirençtir)
        if (!stage && sessionState.homework) {
            stage = 'Resistance';
        }

        // 5. Gözlem ödevi yolundan geçildiyse ve ödev atanmadıysa, otomatik ata
        let finalHomework = sessionState.homework;
        if (!finalHomework && sessionState.history.includes('HOMEWORK_OBSERVE')) {
            finalHomework = "Gözlem Ödevi: Sigara isteği ile davranışı ayırt etme.";
        }
        // PASSIVE_FOLLOWUP terminal adımı ile biten görüşmelerde (direnç çıkışı) ödevsiz takip ata
        // NOT: FOLLOWUP_PASSIVE (giriş adımı) ile PASSIVE_FOLLOWUP (terminal adım) farklıdır!
        if (!finalHomework && sessionState.history.includes('PASSIVE_FOLLOWUP')) {
            finalHomework = "Ödevsiz Takip: Sigara konusunu açmadan rutin kontrol.";
        }

        // --- GEÇMİŞ GÖRÜŞME ANALİZİ (CLINICAL MEMORY) ---
        const pastTriggers = new Set<string>();
        const pastHomeworks: string[] = [];
        const pastVisits = patient.visits;

        pastVisits.forEach(v => {
            // Tetikleyicileri notlardan ayıkla (InterventionModule formatı)
            if (v.notes.includes('Tetikleyiciler:')) {
                const match = v.notes.match(/Tetikleyiciler: (.*?)\./);
                if (match && match[1]) {
                    match[1].split(',').forEach(t => pastTriggers.add(t.trim()));
                }
            }
            // Önceki ödevleri ayıkla
            if (v.notes.includes('Verilen Ödev:')) {
                const match = v.notes.match(/Verilen Ödev: (.*)/);
                if (match && match[1] && match[1].trim() !== 'Yok') {
                    pastHomeworks.push(match[1].trim());
                }
            }
        });

        // Mevcut seansta bir tetikleyici seçildiyse onu da ekle (History'den çıkarım)
        // BDT adımlarından tetikleyici çıkarımı (CBT_SOLUTION_...)
        sessionState.history.forEach(stepId => {
            if (stepId.includes('CBT_SOLUTION_STRESS')) pastTriggers.add('Stres');
            if (stepId.includes('CBT_SOLUTION_COFFEE')) pastTriggers.add('Kahve');
            if (stepId.includes('CBT_SOLUTION_MEAL')) pastTriggers.add('Yemek Sonrası');
            if (stepId.includes('CBT_SOLUTION_SOCIAL')) pastTriggers.add('Sosyal Ortam');
        });

        const clinicalMemorySection = `
        --- KLİNİK HAFIZA & ÖZET ---
        📌 Tespit Edilen Tetikleyiciler: ${pastTriggers.size > 0 ? Array.from(pastTriggers).join(', ') : 'Henüz netleşmedi'}
        📌 Geçmiş Baş Etme Denemeleri: ${pastHomeworks.length > 0 ? pastHomeworks.slice(-3).join(' -> ') : 'İlk deneme'}
        📌 İlerleme Durumu: ${patient.psychosocialStatus?.lastStage ? `${patient.psychosocialStatus.lastStage} -> ` : ''}${stage || 'Belirsiz'}
        `;

        const newPsychosocialStatus: PsychosocialStatus = {
            profile: sessionState.profile,
            motivation: sessionState.motivation,
            lastStage: stage || 'Resistance', // Fallback to Resistance to be safe
            lastScore: currentScore ?? patient.psychosocialStatus?.lastScore,
            homework: finalHomework,
            sessionCount: (patient.psychosocialStatus?.sessionCount || 0) + 1,
            isQuitting: false
        };

        const visitNote = `
            MOTİVASYONEL GÖRÜŞME RAPORU (#${newPsychosocialStatus.sessionCount})
            ================================
            Profil: ${sessionState.profile}
            Ana Motivasyon: ${sessionState.motivation}
            Hazır Oluş Skoru: ${currentScore ?? 'Belirtilmedi'}
            Tahmini Evre: ${stage === 'Resistance' ? 'Direnç' : stage === 'Ambivalence' ? 'İkilem' : stage === 'Action' ? 'Eylem' : 'Belirsiz'}
            
            Görüşme Akışı & Notlar:
            ${sessionState.notes.length > 0 ? sessionState.notes.map(n => `- ${n}`).join('\n') : '- Standart motivasyonel görüşme protokolü uygulandı.'}
            
            Verilen Ödev: ${finalHomework || 'Yok'}

            ${clinicalMemorySection}
        `;

        const visit: Visit = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            status: TreatmentStatus.Active,
            treatmentType: 'Motivasyonel Görüşme',
            notes: visitNote,
            sessionDuration: 'Tam Seans'
        };

        const updatedPatient: Patient = {
            ...patient,
            psychosocialStatus: newPsychosocialStatus,
            visits: [...patient.visits, visit]
        };

        patientService.savePatient(updatedPatient);
        onBack();
    };

    const parseScript = (text: string) => {
        let parsed = text
            .replace(/\[Name\]/g, sessionState.patientName)
            .replace(/\[Motivation\]/g, sessionState.motivation);
        if (sessionState.selectedScore !== undefined) {
            parsed = parsed.replace(/\[Score\]/g, sessionState.selectedScore.toString());
            const lowerScore = Math.max(0, sessionState.selectedScore - 2);
            parsed = parsed.replace(/\[Lower\]/g, lowerScore.toString());
        }
        return parsed;
    };

    // Helper to handle multiple motivation selections
    const toggleMotivation = (item: string) => {
        // Split current motivation string into array, trim spaces, remove empty strings
        const currentParts = setupMotivation.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (currentParts.includes(item)) {
            // If exists, remove it
            const newParts = currentParts.filter(p => p !== item);
            setSetupMotivation(newParts.join(', '));
        } else {
            // If doesn't exist, add it
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

    // --- DASHBOARD VIEW ---
    if (view === 'DASHBOARD') {
        const status = patient.psychosocialStatus!;
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-purple-600 p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{patient.name}</h2>
                                <p className="opacity-90">{status.profile} | {status.sessionCount}. Seans Tamamlandı</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-purple-500 bg-opacity-40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Mevcut Durum</span>
                                <div className="text-2xl font-bold mt-1">
                                    {status.lastStage === 'Resistance' ? '🔴 Dirençli' :
                                        status.lastStage === 'Ambivalence' ? '🟡 İkilemde' :
                                            status.lastStage === 'Action' ? '🟢 Eyleme Hazır' : 'Belirsiz'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                <h3 className="text-sm font-bold text-purple-800 uppercase mb-3 flex items-center">
                                    <span className="mr-2">🎯</span> Motivasyon Kaynağı
                                </h3>
                                <p className="text-lg font-medium text-purple-900">"{status.motivation}"</p>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-600 uppercase mb-3 flex items-center">
                                    <span className="mr-2">📝</span> Son Ödev
                                </h3>
                                <p className="text-slate-700 italic">{status.homework || "Henüz ödev verilmedi."}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => startSession(true)}
                                className="flex-grow p-6 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-all flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <h4 className="text-xl font-bold">Yeni Seans Başlat</h4>
                                    <p className="text-sm opacity-80">Takip görüşmesi (Ödev kontrolü) ile devam et.</p>
                                </div>
                                <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                            </button>

                            <button
                                onClick={onSwitchToIntervention}
                                className="p-6 bg-teal-50 border-2 border-teal-200 text-teal-900 rounded-2xl hover:bg-teal-100 transition-all flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <h4 className="text-xl font-bold">İlaçlı Tedaviye Geç</h4>
                                    <p className="text-sm text-teal-700">Farmakolojik destek modülüne aktar.</p>
                                </div>
                                <span className="text-3xl group-hover:translate-x-2 transition-transform">💊</span>
                            </button>

                            {/* BDT Araçları Butonu */}
                            <button
                                onClick={() => setShowCBTTools(true)}
                                className="p-6 bg-indigo-50 border-2 border-indigo-200 text-indigo-900 rounded-2xl hover:bg-indigo-100 transition-all flex items-center justify-between group"
                            >
                                <div className="text-left">
                                    <h4 className="text-xl font-bold">🧠 BDT Araçları</h4>
                                    <p className="text-sm text-indigo-700">Düşünce kaydı, bilişsel çarpıtmalar.</p>
                                </div>
                                <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                            </button>

                            <Button variant="outline" onClick={() => setView('SETUP')} className="mt-2 text-xs">
                                Profili ve Motivasyonu Güncelle
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 border-t flex justify-between items-center px-8">
                        <Button variant="secondary" onClick={onBack}>Geri Dön</Button>
                        <p className="text-xs text-gray-400">Son Güncelleme: {patient.visits[patient.visits.length - 1]?.date || 'Yok'}</p>
                    </div>
                </div>

                {/* CBT Tools Panel */}
                {showCBTTools && (
                    <CBTTools patient={patient} onClose={() => setShowCBTTools(false)} />
                )}
            </div>
        );
    }

    if (view === 'SETUP') {
        return (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 border border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                    <h3 className="text-blue-900 font-bold mb-1">Otomatik Profil Algılandı</h3>
                    <p className="text-blue-800 text-sm">Danışan kayıt verilerine göre (Ek Hastalıklar: {patient.comorbidities.join(', ') || 'Yok'}) uygun profil seçilmiştir. Gerekirse manuel değiştirebilirsiniz.</p>
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

                        {/* Manuel giriş kutusu kaldırıldı */}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <Button variant="secondary" onClick={patient.psychosocialStatus ? () => setView('DASHBOARD') : onBack}>İptal</Button>
                        <Button onClick={() => startSession(false)} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg">
                            {patient.psychosocialStatus ? 'Güncelle ve Başlat' : 'Görüşmeyi Başlat →'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentStep = PSYCHOSOCIAL_SCENARIOS[sessionState.currentStepId];
    if (!currentStep) return <div>Hata: Senaryo adımı bulunamadı ({sessionState.currentStepId})</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6 min-h-[90vh] relative">
            <div className="bg-slate-800 text-white p-4 rounded-xl flex justify-between items-center shadow-md">
                <div>
                    <span className="font-bold opacity-75 mr-2">Danışan:</span>
                    <span className="text-lg font-bold mr-4">{sessionState.patientName}</span>
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">{sessionState.profile}</span>
                </div>
                <div className="text-sm">
                    <span className="opacity-75 mr-2">Motivasyon:</span>
                    <span className="font-bold text-yellow-300">{sessionState.motivation}</span>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl shadow-xl border-l-8 border-purple-600 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-serif text-purple-900 select-none">"</div>
                    <h3 className="text-sm font-bold text-purple-600 uppercase mb-4 tracking-widest flex items-center">
                        <span className="bg-purple-100 p-1 rounded mr-2">📢</span> HEKİM REPLİĞİ
                    </h3>
                    <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed font-serif">
                        {parseScript(currentStep.script)}
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start">
                    <div className="text-3xl mr-4">💡</div>
                    <div>
                        <h4 className="font-bold text-yellow-800 mb-1 text-sm uppercase">Klinik İpucu</h4>
                        <p className="text-yellow-900 text-lg">{currentStep.tip}</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-center text-gray-500 font-bold mb-4 text-sm uppercase">Danışanın Tepkisi Nedir?</h4>
                    {currentStep.type === 'scale' ? (
                        <div className="grid grid-cols-3 md:grid-cols-11 gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                <button key={score} onClick={() => { setSessionState(p => ({ ...p, selectedScore: score })); handleNextStep('SCALE_PROBE'); }}
                                    className={`py-4 rounded-lg font-bold text-lg transition-all ${score <= 3 ? 'bg-red-100 text-red-800' : score <= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {score}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentStep.responses?.map((resp, idx) => (
                                <button key={idx} onClick={() => handleNextStep(resp.nextStep, resp.insight, resp.homework)}
                                    className={`p-4 rounded-xl text-left border-l-8 shadow-sm transition-all hover:translate-x-1 flex items-center bg-white ${resp.type === 'positive' ? 'border-green-500' : resp.type === 'negative' ? 'border-red-500' : 'border-gray-400'}`}>
                                    <span className="font-bold text-lg text-slate-700">{resp.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handleBack} disabled={sessionState.history.length <= 1}>← Geri Al</Button>
                    {/* Continuity: Allow switching to drug module even during session if resistance is high */}
                    <Button variant="outline" className="text-xs" onClick={onSwitchToIntervention}>Tedavi Modülüne Geç</Button>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={() => setShowSOS(!showSOS)} className="w-16 h-16 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-white font-bold border-4 border-white animate-pulse">SOS</button>
                {showSOS && (
                    <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl border p-4">
                        <h4 className="font-bold text-red-600 mb-4 border-b pb-2">ACİL DURUM KARTLARI</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-sm"><strong>😭 Ağlarsa:</strong> Sakinleşmesini bekleyin, su teklif edin.</div>
                            <div className="p-3 bg-red-50 rounded-lg text-sm"><strong>😡 Öfke:</strong> "Karar sizin" diyerek geri çekilin.</div>
                            <button onClick={() => { setShowSOS(false); handleNextStep('FINISH', 'Görüşme yarıda kesildi.'); }} className="w-full py-2 bg-red-600 text-white rounded font-bold text-sm">GÖRÜŞMEYİ BİTİR</button>
                        </div>
                    </div>
                )}
            </div>

            {showFinishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">🏁</div>
                        <h2 className="text-2xl font-bold mb-2">Görüşme Tamamlandı</h2>
                        <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-6 border">
                            <p><strong>Yeni Ödev:</strong> {sessionState.homework || "Gözlem Ödevi"}</p>
                            <p><strong>Hazır Oluş Skoru:</strong> {sessionState.selectedScore ?? 'Belirtilmedi'}</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Button variant="secondary" onClick={() => setShowFinishModal(false)}>İptal</Button>
                            <Button onClick={saveAndExit} className="bg-green-600">Kaydet ve Çık</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

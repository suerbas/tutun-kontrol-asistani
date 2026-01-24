import React, { useState } from 'react';
import { Patient, Visit, DependenceLevel, TreatmentStatus, COMORBIDITIES } from '../types';
import { FAGERSTROM_QUESTIONS, PHARMACOLOGICAL_TREATMENTS, BEHAVIORAL_GUIDE, FIVE_R_DETAILS } from '../constants';
import { patientService } from '../services/patientService';
import { Button } from './Button';

// Alt bileşenler
import {
    InterventionStep,
    DrugFollowUp,
    HomeworkCheck,
    FagerstromTest,
    SuccessScreen,
    ReportModal,
    Wrapper
} from './intervention';

interface InterventionProps {
    patient: Patient;
    onBack: () => void;
    onUpdatePatient: (patient: Patient) => void;
    onSwitchToPsychosocial?: () => void;
    autoStart?: boolean;
}

export const InterventionModule: React.FC<InterventionProps> = ({ patient, onBack, onUpdatePatient, onSwitchToPsychosocial, autoStart }) => {
    // === STATE ===
    const [currentStep, setCurrentStep] = useState<InterventionStep>(
        patient.visits.length > 0 ? InterventionStep.Dashboard : InterventionStep.Ask
    );
    const [fagerstromAnswers, setFagerstromAnswers] = useState<number[]>(new Array(6).fill(-1));
    const [score, setScore] = useState(0);
    const [dependence, setDependence] = useState<DependenceLevel>(DependenceLevel.Low);
    const [isReady, setIsReady] = useState<boolean | null>(null);
    const [selectedTreatment, setSelectedTreatment] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [activeRStep, setActiveRStep] = useState<number>(0);
    const [selectedRItems, setSelectedRItems] = useState<string[]>([]);

    // İlaç Takip State'leri
    const [adherence, setAdherence] = useState<'full' | 'partial' | 'none' | null>(null);
    const [smokingStatus, setSmokingStatus] = useState<'clean' | 'slipped' | null>(null);
    const [hasSideEffects, setHasSideEffects] = useState<boolean | null>(null);

    // === EFFECTS ===
    React.useEffect(() => {
        if (autoStart && currentStep === InterventionStep.Dashboard) {
            const activeHomeworkText = patient.psychosocialStatus?.homework || '';
            const isPassiveFollowUp = activeHomeworkText.includes('Ödevsiz Takip');
            const hasHomework = activeHomeworkText.length > 0 && !isPassiveFollowUp;
            if (hasHomework) {
                setCurrentStep(InterventionStep.Check_Homework);
            } else {
                setIsReady(true);
                setDependence(DependenceLevel.Medium);
                setCurrentStep(InterventionStep.Assist_Behav);
            }
        }
    }, [autoStart]);

    // === HELPER FUNCTIONS ===
    const calculateScore = () => {
        const total = fagerstromAnswers.reduce((a, b) => a + (b === -1 ? 0 : b), 0);
        setScore(total);
        if (total <= 2) setDependence(DependenceLevel.Low);
        else if (total <= 7) setDependence(DependenceLevel.Medium);
        else setDependence(DependenceLevel.High);
    };

    const handleAnswer = (questionIndex: number, points: number) => {
        const newAnswers = [...fagerstromAnswers];
        newAnswers[questionIndex] = points;
        setFagerstromAnswers(newAnswers);
    };

    const toggleTrigger = (triggerId: string) => {
        if (selectedTriggers.includes(triggerId)) {
            setSelectedTriggers(selectedTriggers.filter(t => t !== triggerId));
        } else {
            setSelectedTriggers([...selectedTriggers, triggerId]);
        }
    };

    const toggleRItem = (itemId: string) => {
        if (selectedRItems.includes(itemId)) {
            setSelectedRItems(selectedRItems.filter(i => i !== itemId));
        } else {
            setSelectedRItems([...selectedRItems, itemId]);
        }
    };

    const saveVisit = () => {
        // İngilizce ID'leri Türkçe isimlere çevir
        const triggerNames = selectedTriggers.map(id => {
            const trigger = BEHAVIORAL_GUIDE.find(b => b.id === id);
            return trigger ? trigger.trigger : id;
        });
        const behavioralNotes = triggerNames.length > 0 ? `Tetikleyiciler: ${triggerNames.join(', ')}. ` : '';

        let fiveRNotes = '';
        if (!isReady && selectedRItems.length > 0) {
            const items = FIVE_R_DETAILS.flatMap(r => r.items).filter(i => selectedRItems.includes(i.id));
            fiveRNotes = `5R Bulguları: ${items.map(i => i.text).join(', ')}. `;
        }
        const visit: Visit = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            status: isReady ? TreatmentStatus.Active : TreatmentStatus.New,
            notes: `Fagerström: ${score} (${dependence}). ${isReady ? 'Bırakmaya hazır.' : 'Hazır değil (5R uygulandı).'} ${behavioralNotes} ${fiveRNotes}Tedavi: ${selectedTreatment}. Notlar: ${notes}`,
            treatmentType: selectedTreatment
        };
        let updatedPatient = { ...patient };
        if (selectedTreatment && selectedTreatment !== 'Sadece Davranışsal') {
            const drugInfo = PHARMACOLOGICAL_TREATMENTS.find(t => t.name === selectedTreatment);
            updatedPatient.activeTreatment = {
                drugName: selectedTreatment,
                commercialName: drugInfo?.commercialName,
                startDate: new Date().toLocaleDateString('tr-TR'),
                dosage: drugInfo?.dosage,
                isActive: true
            };
            updatedPatient.fagerstromScore = score;
        }
        updatedPatient.visits = [...updatedPatient.visits, visit];
        patientService.savePatient(updatedPatient);
        onUpdatePatient(updatedPatient);
        setCurrentStep(InterventionStep.Success);
    };

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

    // === RENDER STEPS ===

    // Success Screen
    if (currentStep === InterventionStep.Success) {
        return <SuccessScreen isReady={isReady} onBack={onBack} />;
    }

    // Drug Follow-Up
    if (currentStep === InterventionStep.Drug_Follow_Up) {
        return (
            <DrugFollowUp
                patient={patient}
                adherence={adherence}
                setAdherence={setAdherence}
                smokingStatus={smokingStatus}
                setSmokingStatus={setSmokingStatus}
                hasSideEffects={hasSideEffects}
                setHasSideEffects={setHasSideEffects}
                notes={notes}
                setNotes={setNotes}
                onBack={() => setCurrentStep(InterventionStep.Dashboard)}
                onComplete={() => setCurrentStep(InterventionStep.Success)}
                onSwitchToPsychosocial={onSwitchToPsychosocial}
            />
        );
    }

    // Homework Check
    if (currentStep === InterventionStep.Check_Homework) {
        return (
            <HomeworkCheck
                patient={patient}
                onProceedToTreatment={() => { setIsReady(true); setDependence(DependenceLevel.Medium); setCurrentStep(InterventionStep.Assist_Behav); }}
                onSwitchToPsychosocial={onSwitchToPsychosocial}
                onBack={() => setCurrentStep(InterventionStep.Dashboard)}
            />
        );
    }

    // Fagerstrom Test
    if (currentStep === InterventionStep.Assess_Test) {
        return (
            <FagerstromTest
                answers={fagerstromAnswers}
                onAnswer={handleAnswer}
                onBack={() => setCurrentStep(InterventionStep.Ask)}
                onComplete={() => { calculateScore(); setCurrentStep(InterventionStep.Assess_Ready); }}
            />
        );
    }

    // Dashboard
    if (currentStep === InterventionStep.Dashboard) {
        const lastVisit = patient.visits[patient.visits.length - 1];
        const status = patient.psychosocialStatus;
        const needsMoreMI = patient.psychosocialStatus && patient.psychosocialStatus.lastStage !== 'Action';
        const activeHomeworkText = patient.psychosocialStatus?.homework || '';
        const isPassiveFollowUp = activeHomeworkText.includes('Ödevsiz Takip');
        const hasHomework = activeHomeworkText.length > 0 && !isPassiveFollowUp;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">{patient.name.charAt(0)}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                            <p className="text-sm text-slate-500">Hasta Paneli & Tedavi Yönetimi</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={onBack} className="text-red-600 border-red-200 hover:bg-red-50">Çıkış</Button>
                </div>

                {status ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
                        <div className={`h-2 w-full ${status.lastStage === 'Action' ? 'bg-green-500' : status.lastStage === 'Ambivalence' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Psikososyal Durum Raporu</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">Son Güncelleme: {lastVisit?.date}</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Seans #{status.sessionCount}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowReportModal(true)} className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded">Detaylı Raporu İncele ↗</button>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block mb-1">MEVCUT EVRE</span>
                                    <div className={`text-lg font-bold flex items-center ${status.lastStage === 'Action' ? 'text-green-700' : status.lastStage === 'Ambivalence' ? 'text-yellow-700' : 'text-red-700'}`}>
                                        <span className="mr-2 text-2xl">{status.lastStage === 'Action' ? '🚀' : status.lastStage === 'Ambivalence' ? '⚖️' : '🛑'}</span>
                                        {status.lastStage === 'Action' ? 'Eyleme Hazır' : status.lastStage === 'Ambivalence' ? 'İkilemde' : 'Dirençli'}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block mb-1">MOTİVASYON</span>
                                    <div className="text-slate-800 font-medium text-sm truncate">❤️ {status.motivation}</div>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    <span className="text-xs font-bold text-yellow-600 block mb-1">AKTİF GÖREV</span>
                                    <div className="text-yellow-900 text-sm font-medium line-clamp-2">{status.homework || 'Atanmış görev yok.'}</div>
                                </div>
                                {patient.activeTreatment?.isActive ? (
                                    <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                                        <span className="text-xs font-bold text-teal-600 block mb-1">AKTİF İLAÇ TEDAVİSİ</span>
                                        <div className="text-teal-900 font-medium flex items-center text-sm">💊 {patient.activeTreatment.commercialName || patient.activeTreatment.drugName}</div>
                                        <span className="text-xs text-teal-700">Başlangıç: {patient.activeTreatment.startDate}</span>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 border-dashed">
                                        <span className="text-xs font-bold text-gray-400 block mb-1">İLAÇ TEDAVİSİ</span>
                                        <div className="text-gray-500 text-sm">Henüz başlatılmadı</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : patient.activeTreatment?.isActive ? (
                    // İlaç tedavisi var ama psikososyal değerlendirme yok
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
                        <div className="h-2 w-full bg-teal-500"></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Tedavi Durum Raporu</h3>
                                    <span className="text-xs text-gray-400">Başlangıç: {patient.activeTreatment.startDate}</span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                    <span className="text-xs font-bold text-teal-600 block mb-1">AKTİF İLAÇ TEDAVİSİ</span>
                                    <div className="text-teal-900 font-medium flex items-center text-sm">💊 {patient.activeTreatment.commercialName || patient.activeTreatment.drugName}</div>
                                    <span className="text-xs text-teal-700">{patient.activeTreatment.dosage}</span>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    <span className="text-xs font-bold text-yellow-600 block mb-1">AKTİF GÖREV</span>
                                    <div className="text-yellow-900 text-sm font-medium">İlaç tedavisine uyum ve sigarayı bırakma yolunda ilerleme</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <span className="text-xs font-bold text-purple-600 block mb-1">PSİKOSOSYAL DESTEK</span>
                                    <div className="text-purple-900 text-sm">Henüz değerlendirme yapılmadı</div>
                                    {onSwitchToPsychosocial && <button onClick={onSwitchToPsychosocial} className="text-xs text-purple-600 underline mt-1">Değerlendirme Başlat →</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 border-dashed mb-8 text-center">
                        <p className="text-blue-800 font-medium mb-2">Henüz Psikososyal Değerlendirme Yapılmadı</p>
                        <p className="text-sm text-blue-600 mb-4">Hastanın profili için görüşme başlatın.</p>
                        {onSwitchToPsychosocial && <Button onClick={onSwitchToPsychosocial} variant="secondary">Değerlendirmeyi Başlat</Button>}
                    </div>
                )}


                <h3 className="text-lg font-bold text-slate-800 mb-4">Sonraki Klinik Adım</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {patient.activeTreatment?.isActive ? (
                        <button onClick={() => setCurrentStep(InterventionStep.Drug_Follow_Up)}
                            className="p-6 rounded-xl border-2 border-teal-200 hover:bg-teal-50 text-left bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5 text-teal-900 text-6xl font-bold">💊</div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl mb-3">💊</div>
                                <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform bg-white px-2 py-1 rounded-full text-sm shadow-sm">Kontrol Et →</span>
                            </div>
                            <h4 className="font-bold text-teal-900 text-lg relative z-10">İlaç Tedavisi Takibi</h4>
                            <p className="text-sm text-gray-600 mt-2 relative z-10">
                                {patient.activeTreatment.commercialName} kullanıyor. Yan etki, uyum ve tedavi durumunu değerlendirin.
                            </p>
                        </button>
                    ) : needsMoreMI && onSwitchToPsychosocial ? (
                        <button onClick={onSwitchToPsychosocial}
                            className="p-6 rounded-xl border-2 border-purple-200 hover:bg-purple-50 text-left bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5 text-purple-900 text-6xl font-bold">BDT</div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl mb-3">💬</div>
                                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform bg-white px-2 py-1 rounded-full text-sm shadow-sm">Başla →</span>
                            </div>
                            <h4 className="font-bold text-purple-900 text-lg relative z-10">Görüşmeye Devam Et (BDT)</h4>
                            <p className="text-sm text-gray-600 mt-2 relative z-10">Danışan henüz eyleme hazır değil. Motivasyonel görüşme ile devam edin.</p>
                        </button>
                    ) : (
                        <button onClick={() => { hasHomework ? setCurrentStep(InterventionStep.Check_Homework) : (setIsReady(true), setDependence(DependenceLevel.Medium), setCurrentStep(InterventionStep.Assist_Behav)); }}
                            className="p-6 rounded-xl border-2 border-green-200 hover:bg-green-50 text-left bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5 text-green-900 text-6xl font-bold">PLAN</div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-3">{hasHomework ? '⚠️' : '📝'}</div>
                                <span className="text-green-600 font-bold group-hover:translate-x-1 transition-transform bg-white px-2 py-1 rounded-full text-sm shadow-sm">{hasHomework ? 'Kontrol Et →' : 'Oluştur →'}</span>
                            </div>
                            <h4 className="font-bold text-green-900 text-lg relative z-10">{hasHomework ? 'Ödev Kontrolü & Klinik Takip' : 'Kontrol Görüşmesi & Plan'}</h4>
                            <p className="text-sm text-gray-600 mt-2 relative z-10">{hasHomework ? 'Danışanın aktif bir psikososyal ödevi var.' : 'Danışan eyleme hazır. Tedavi planı oluşturun.'}</p>
                        </button>
                    )}

                    <button onClick={() => setCurrentStep(InterventionStep.Assess_Test)}
                        className="p-6 rounded-xl border-2 border-blue-200 hover:bg-blue-50 text-left bg-white shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mb-3">🔄</div>
                        </div>
                        <h4 className="font-bold text-blue-900 text-lg">Yeniden Değerlendirme</h4>
                        <p className="text-sm text-gray-600 mt-2">Bağımlılık testini (Fagerström) tekrarla ve 5A modelini baştan başlat.</p>
                    </button>
                </div>
                {showReportModal && <ReportModal patient={patient} onClose={() => setShowReportModal(false)} />}
            </div>
        );
    }

    // Ask Step
    if (currentStep === InterventionStep.Ask) {
        return (
            <Wrapper title="1. ADIM: ASK (SOR & SORGULA)" currentStep={currentStep} isReady={isReady}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <h3 className="font-bold text-blue-900">Hasta Profili</h3>
                            <ul className="mt-2 space-y-2 text-sm text-slate-700">
                                <li><strong>Ad Soyad:</strong> {patient.name} ({patient.age}y, {patient.gender})</li>
                                <li><strong>Günlük İçim:</strong> {patient.dailyAmount} adet</li>
                                <li><strong>Başlama Yaşı:</strong> {patient.firstSmokingAge}</li>
                                <li><strong>Komorbiditeler:</strong> {patient.comorbidities.join(', ') || 'Yok'}</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-sm font-semibold text-yellow-800">📌 Hekim Notu:</p>
                            <p className="text-sm text-slate-600">Her görüşmede tütün kullanım durumunu ve vital bulguları sorgulayınız.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-4 text-center p-8 bg-gray-50 rounded-xl">
                        <p className="text-lg font-medium text-slate-700">Tütün kullanım durumu teyit edildi mi?</p>
                        <Button className="w-full md:w-auto" onClick={() => setCurrentStep(InterventionStep.Assess_Test)}>Evet, Değerlendirmeye (ASSESS) Geç →</Button>
                        <Button variant="secondary" onClick={onBack}>Geri Dön</Button>
                    </div>
                </div>
            </Wrapper>
        );
    }

    // Assess Ready Step
    if (currentStep === InterventionStep.Assess_Ready) {
        const getInterpretation = (s: number) => {
            if (s <= 2) return "Fiziksel bağımlılık çok düşük. Davranışsal alışkanlıklar ön planda. Sadece motivasyonel destek ve davranışsal öneriler genellikle yeterlidir.";
            if (s <= 5) return "Orta düzey fiziksel bağımlılık. Yoksunluk belirtileri görülebilir. NRT (Bant/Sakız) desteği başarı şansını belirgin şekilde artırır.";
            if (s <= 7) return "Yüksek bağımlılık. Güçlü farmakolojik destek (Vareniklin veya Kombine NRT) ve sıkı takip gerekir. Nüks riski yüksektir.";
            return "Çok yüksek bağımlılık. Hasta sigarasız uyanamaz. Mutlaka farmakoterapi başlanmalı ve yoğun bilişsel davranışçı destek sağlanmalıdır.";
        };

        const getDoctorAdvice = (s: number) => {
            if (s <= 2) return `Sayın ${patient.name}, bağımlılık düzeyiniz henüz başlangıç seviyesinde. Bu büyük bir avantaj. Fiziksel yoksunluk yaşamadan, sadece alışkanlıklarınızı değiştirerek sigaradan kurtulmanız mümkün.`;
            if (s <= 5) return `Sayın ${patient.name}, test sonuçlarınız orta düzeyde bir fiziksel bağımlılığa işaret ediyor. Sigarayı bırakma sürecinde zorlanmanız beklenen bir durumdur, ancak bu zorluğu tek başınıza aşmak zorunda değilsiniz. Tıbbi tedavi desteği ile yoksunluk belirtilerini en aza indirerek, bu süreci çok daha rahat yönetebiliriz.`;
            if (s <= 7) return `Sayın ${patient.name}, vücudunuz nikotine biyolojik olarak alışmış durumda. Kendi kendinize bırakmaya çalışmak sizi gereksiz yere yorabilir. Tıbbi tedavi desteğiyle bu süreci yönetmemiz sağlığınız için en doğrusudur.`;
            return `Sayın ${patient.name}, test sonucunuz çok yüksek düzeyde fiziksel bağımlılık gösteriyor. Profesyonel ilaç tedavisi olmadan bırakmayı denemek çok zordur. Lütfen size yardım etmeme izin verin.`;
        };

        const scoreColor = score <= 2 ? 'green' : score <= 7 ? 'yellow' : 'red';
        const interpretation = getInterpretation(score);
        const doctorAdvice = getDoctorAdvice(score);

        return (
            <Wrapper title="3. ADIM: ADVISE (ÖNER) & HAZIR OLUŞ" currentStep={currentStep} isReady={isReady}>
                <div className="grid md:grid-cols-12 gap-6">
                    {/* RESULT CARD */}
                    <div className="md:col-span-12">
                        <div className={`rounded-xl border-2 overflow-hidden shadow-sm flex flex-col md:flex-row
                            ${scoreColor === 'green' ? 'border-green-200 bg-green-50' :
                                scoreColor === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>

                            {/* Score Display */}
                            <div className={`p-6 flex flex-col items-center justify-center min-w-[200px] border-b md:border-b-0 md:border-r 
                                ${scoreColor === 'green' ? 'border-green-200 bg-green-100' :
                                    scoreColor === 'yellow' ? 'border-yellow-200 bg-yellow-100' : 'border-red-200 bg-red-100'}`}>
                                <span className={`text-sm font-bold uppercase tracking-wider mb-1
                                    ${scoreColor === 'green' ? 'text-green-800' : scoreColor === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                                    Bağımlılık Skoru
                                </span>
                                <div className="text-6xl font-extrabold text-slate-800">{score}<span className="text-2xl text-gray-500 font-normal">/10</span></div>
                                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border
                                    ${scoreColor === 'green' ? 'bg-green-200 text-green-800 border-green-300' :
                                        scoreColor === 'yellow' ? 'bg-yellow-200 text-yellow-800 border-yellow-300' : 'bg-red-200 text-red-800 border-red-300'}`}>
                                    {dependence}
                                </span>
                            </div>

                            {/* Clinical Context */}
                            <div className="p-6 flex-grow">
                                <h4 className={`font-bold text-lg mb-2 flex items-center
                                    ${scoreColor === 'green' ? 'text-green-900' : scoreColor === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
                                    <span className="mr-2 text-xl">🩺</span> Klinik Yorum
                                </h4>
                                <p className="text-slate-700 leading-relaxed mb-4">{interpretation}</p>

                                {/* Visual Meter */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                                        <span>Düşük (0-2)</span>
                                        <span>Orta (3-7)</span>
                                        <span>Yüksek (8-10)</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-green-400 w-[20%]"></div>
                                        <div className="h-full bg-yellow-400 w-[50%]"></div>
                                        <div className="h-full bg-red-500 w-[30%]"></div>
                                    </div>
                                    {/* Indicator Triangle */}
                                    <div className="relative h-4 w-full">
                                        <div className="absolute top-0 transform -translate-x-1/2 transition-all duration-500" style={{ left: `${(score / 10) * 100}%` }}>
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Advice */}
                    <div className="md:col-span-6 space-y-4 mt-2">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-teal-500 shadow-sm">
                            <h4 className="font-bold text-teal-900 mb-2">📢 Hekim Önerisi (ADVISE)</h4>
                            <p className="text-slate-700 italic">"{doctorAdvice}"</p>
                        </div>
                    </div>

                    {/* Readiness Selection */}
                    <div className="md:col-span-6 flex flex-col justify-center space-y-3 mt-2">
                        <h4 className="font-bold text-slate-700 text-sm uppercase">Hasta Bırakmaya Hazır mı?</h4>
                        <button onClick={() => setIsReady(true)}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isReady === true ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'}`}>
                            <div>
                                <span className="font-bold text-green-700 block group-hover:translate-x-1 transition-transform">EVET, Denemek İstiyorum</span>
                                <span className="text-xs text-green-600">5A Modeline Devam Et (Planlama)</span>
                            </div>
                            <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">👍</span>
                        </button>
                        <button onClick={() => setIsReady(false)}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isReady === false ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'}`}>
                            <div>
                                <span className="font-bold text-red-700 block group-hover:translate-x-1 transition-transform">HAYIR, Hazır Değilim</span>
                                <span className="text-xs text-red-600">5R Modeline Geçiş Yap (Motivasyon)</span>
                            </div>
                            <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">👎</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    {isReady !== null && (
                        <Button onClick={() => setCurrentStep(isReady ? InterventionStep.Assist_Behav : InterventionStep.Assist_Med)}>
                            {isReady ? '4. Adım: ASSIST (Yardım) →' : '5R Modeline Git →'}
                        </Button>
                    )}
                </div>
            </Wrapper>
        );
    }

    // Assist Behavioral Step
    if (currentStep === InterventionStep.Assist_Behav) {
        return (
            <Wrapper title="4. ADIM: ASSIST (YARDIM ET) - Davranışsal Destek" currentStep={currentStep} isReady={isReady}>
                <p className="mb-6 text-slate-600 bg-blue-50 p-3 rounded text-sm">
                    <strong>Talimat:</strong> Hastanın sigara içme tetikleyicilerini belirleyin.
                </p>
                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm uppercase border-b pb-2">Tetikleyicileri Seçiniz</h3>
                        {BEHAVIORAL_GUIDE.map((item) => (
                            <label key={item.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedTriggers.includes(item.id) ? 'bg-purple-50 border-purple-500' : 'bg-white hover:bg-gray-50'}`}>
                                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" checked={selectedTriggers.includes(item.id)} onChange={() => toggleTrigger(item.id)} />
                                <span className="ml-3 font-medium text-slate-700">{item.trigger}</span>
                            </label>
                        ))}
                    </div>
                    <div className="md:col-span-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">📋 Kişiselleştirilmiş Müdahale Planı</h3>
                        {selectedTriggers.length === 0 ? (
                            <div className="text-center text-gray-400 py-20">👈 Soldan tetikleyicileri seçiniz.</div>
                        ) : (
                            <div className="space-y-4">
                                {BEHAVIORAL_GUIDE.filter(i => selectedTriggers.includes(i.id)).map(guide => (
                                    <div key={guide.id} className="bg-white rounded-xl shadow-sm border p-4">
                                        <h4 className="font-bold text-purple-900 mb-2">{guide.trigger}</h4>
                                        <p className="text-sm text-slate-700 mb-2"><strong>Strateji:</strong> {guide.strategy}</p>
                                        <p className="text-sm text-slate-600 italic bg-blue-50 p-2 rounded">"{guide.dialogue}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="secondary" onClick={() => setCurrentStep(InterventionStep.Assess_Ready)}>Geri</Button>
                    <Button onClick={() => setCurrentStep(InterventionStep.Assist_Med)}>Tedavi Planına İlerle →</Button>
                </div>
            </Wrapper>
        );
    }

    // Assist Med Step (5R veya İlaç Seçimi)
    if (currentStep === InterventionStep.Assist_Med) {
        // 5R Mode
        if (!isReady) {
            const currentR = FIVE_R_DETAILS[activeRStep];
            return (
                <Wrapper title={`MÜDAHALE: 5R - ${currentR.title}`} currentStep={currentStep} isReady={isReady}>
                    <div className="flex mb-6 space-x-1 overflow-x-auto pb-2">
                        {FIVE_R_DETAILS.map((r, idx) => (
                            <button key={r.id} onClick={() => setActiveRStep(idx)}
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
                                    <button key={item.id} onClick={() => toggleRItem(item.id)}
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
                        <Button variant="secondary" onClick={() => { activeRStep > 0 ? setActiveRStep(activeRStep - 1) : setCurrentStep(InterventionStep.Assess_Ready); }}>
                            {activeRStep === 0 ? 'Geri Dön' : '← Önceki Adım'}
                        </Button>
                        {activeRStep < FIVE_R_DETAILS.length - 1 ? (
                            <Button onClick={() => setActiveRStep(activeRStep + 1)}>Sonraki Adım →</Button>
                        ) : (
                            <Button onClick={saveVisit} className="bg-red-600 hover:bg-red-700">Görüşmeyi Kaydet</Button>
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
            <Wrapper title="4. ASSIST (TEDAVİ SEÇİMİ) & 5. ARRANGE (İZLEM)" currentStep={currentStep} isReady={isReady}>
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
                    <button onClick={() => setSelectedTreatment(recommendation.name)}
                        className={`mt-3 md:mt-0 md:ml-4 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${recommendation.priority === 'high' ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                        Bu Tedaviyi Seç ✓
                    </button>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-5 space-y-4">
                        <h3 className="font-bold text-slate-800 border-b pb-2">Tedavi Yöntemi</h3>
                        <select className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg" value={selectedTreatment} onChange={(e) => setSelectedTreatment(e.target.value)}>
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
                            <textarea className="w-full border rounded p-2 h-20 text-sm" placeholder="Özel notlar..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
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
                    <Button variant="secondary" onClick={() => setCurrentStep(InterventionStep.Assist_Behav)}>Geri</Button>
                    <Button onClick={saveVisit} disabled={!selectedTreatment} className="px-8">Tedaviyi Onayla ve Bitir</Button>
                </div>
            </Wrapper>
        );
    }

    return null;
};

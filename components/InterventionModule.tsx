

import React, { useState } from 'react';
import { Patient, Visit, DependenceLevel, TreatmentStatus, COMORBIDITIES } from '../types';
import { FAGERSTROM_QUESTIONS, PHARMACOLOGICAL_TREATMENTS, BEHAVIORAL_GUIDE, FIVE_R_DETAILS } from '../constants';
import { patientService } from '../services/patientService';
import { Button } from './Button';

interface InterventionProps {
    patient: Patient;
    onBack: () => void;
    onSwitchToPsychosocial?: () => void;
}

enum Step {
    Dashboard = -1,
    Ask = 0,        // History
    Assess_Test = 1, // Fagerstrom
    Assess_Ready = 2, // Readiness & Advise
    Assist_Behav = 3, // Behavioral
    Assist_Med = 4,   // Plan
    Success = 5,
    Check_Homework = 6 // YENİ: Ödev Kontrol Adımı
}

export const InterventionModule: React.FC<InterventionProps> = ({ patient, onBack, onSwitchToPsychosocial }) => {
    const [currentStep, setCurrentStep] = useState<Step>(
        patient.visits.length > 0 ? Step.Dashboard : Step.Ask
    );
    const [fagerstromAnswers, setFagerstromAnswers] = useState<number[]>(new Array(6).fill(-1));
    const [score, setScore] = useState(0);
    const [dependence, setDependence] = useState<DependenceLevel>(DependenceLevel.Low);
    const [isReady, setIsReady] = useState<boolean | null>(null);
    const [selectedTreatment, setSelectedTreatment] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    
    // Report Modal State
    const [showReportModal, setShowReportModal] = useState(false);
    
    // 5R States
    const [activeRStep, setActiveRStep] = useState<number>(0);
    const [selectedRItems, setSelectedRItems] = useState<string[]>([]);

    // 5A Model Steps for Visualization
    const STEPS_5A = [
        { id: Step.Ask, label: '1. ASK (Sor)' },
        { id: Step.Assess_Test, label: '2. ASSESS (Ölç)' }, 
        { id: Step.Assess_Ready, label: '3. ADVISE (Öner)' },
        { id: Step.Assist_Behav, label: '4. ASSIST (Yardım)' },
        { id: Step.Assist_Med, label: '5. ARRANGE (Planla)' }
    ];

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
        const behavioralNotes = selectedTriggers.length > 0 
            ? `Tetikleyiciler: ${selectedTriggers.join(', ')}. ` 
            : '';
        
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
        patientService.addVisit(patient.id, visit);
        setCurrentStep(Step.Success);
    };

    // --- CLINICAL RECOMMENDATION ENGINE ---
    const getClinicalRecommendation = (): { name: string; reason: string; priority: 'high' | 'medium' | 'low' } => {
        const has = (comorbidity: string) => patient.comorbidities.includes(comorbidity);
        
        // 1. Gebelik Durumu (En Kritik)
        if (has(COMORBIDITIES.PREGNANCY)) {
            return {
                name: 'Nikotin Replasman Tedavisi (NRT) - Sakız',
                reason: 'Gebelerde ilk tercih davranışsal destektir. İlaç gerekirse, fetüse sürekli nikotin maruziyeti veren bant yerine, aralıklı formlar (Sakız) daha güvenlidir. Vareniklin ve Bupropion önerilmez.',
                priority: 'high'
            };
        }

        // 2. Epilepsi / Nöbet (Kontrendikasyon Yönetimi)
        if (has(COMORBIDITIES.EPILEPSY)) {
            // Bupropion yasak.
            if (score >= 7) {
                return {
                    name: 'Vareniklin',
                    reason: 'Yüksek bağımlılık skoru nedeniyle güçlü bir ajan gerekir. Epilepsi öyküsü olduğu için Bupropion kontrendikedir. Vareniklin en uygun seçenektir.',
                    priority: 'high'
                };
            }
            return {
                name: 'Nikotin Replasman Tedavisi (NRT) - Bant',
                reason: 'Epilepsi nedeniyle Bupropion kullanılamaz. Orta düzey bağımlılıkta NRT Bant güvenli ve etkilidir.',
                priority: 'high'
            };
        }

        // 3. Depresyon Öyküsü
        if (has(COMORBIDITIES.DEPRESSION)) {
            return {
                name: 'Bupropion HCl',
                reason: 'Hastanın depresyon öyküsü mevcuttur. Bupropion hem sigara bırakmada etkilidir hem de antidepresan özellik taşır.',
                priority: 'medium'
            };
        }

        // 4. Yüksek Bağımlılık (Skor > 7 veya > 20 sigara/gün)
        if (score >= 7 || patient.dailyAmount > 20) {
            if (has(COMORBIDITIES.RENAL)) {
                return {
                    name: 'Nikotin Replasman Tedavisi (NRT) - Bant',
                    reason: 'Yüksek bağımlılık var ancak böbrek yetmezliği nedeniyle Vareniklin doz ayarı gerektirir veya riskli olabilir. NRT Bant daha güvenli bir başlangıçtır.',
                    priority: 'medium'
                }; 
            }
            return {
                name: 'Vareniklin',
                reason: `Bağımlılık skoru yüksek (${score}/10) ve/veya günlük tüketim fazla. Vareniklin, yüksek bağımlılıkta başarı oranı en yüksek ajandır (Monoterapi). Alternatif olarak Kombine NRT (Bant+Sakız) düşünülebilir.`,
                priority: 'high'
            };
        }

        // 5. Cilt Problemleri
        if (has(COMORBIDITIES.SKIN_SENSITIVITY)) {
            return {
                name: 'Vareniklin',
                reason: 'Cilt hassasiyeti nedeniyle NRT Bant tahriş yapabilir. Oral formlar (Vareniklin veya Bupropion) tercih edilmelidir.',
                priority: 'medium'
            };
        }

        // 6. Düşük Bağımlılık (Skor 0-3)
        if (score <= 3 && patient.dailyAmount < 10) {
            return {
                name: 'Sadece Davranışsal',
                reason: 'Fiziksel bağımlılık düzeyi düşük. İlaç yüklemesi yapmadan önce motivasyonel destek ve davranışsal değişiklikler denenmelidir. İhtiyaç olursa NRT Sakız eklenebilir.',
                priority: 'medium'
            };
        }

        // 7. Standart / Orta Bağımlılık (Varsayılan)
        return {
            name: 'Nikotin Replasman Tedavisi (NRT) - Bant',
            reason: 'Orta düzey bağımlılık için standart ve güvenli başlangıç tedavisidir. Kullanımı kolaydır (Günde tek sefer).',
            priority: 'low'
        };
    };

    // --- REASONING LOGIC (FEEDBACK) ---
    const getTreatmentReasoning = (treatmentName: string) => {
        const reasons: { type: 'success' | 'warning' | 'info', text: string }[] = [];
        
        // Bupropion Analizi
        if (treatmentName.includes('Bupropion')) {
            if (patient.comorbidities.includes(COMORBIDITIES.DEPRESSION)) {
                reasons.push({ type: 'success', text: "Hastanın depresyon öyküsü olması nedeniyle Bupropion iyi bir seçenektir (Antidepresan etki)." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.EPILEPSY)) {
                reasons.push({ type: 'warning', text: "KONTRENDİKASYON: Epilepsi öyküsü olan hastalarda Bupropion ASLA kullanılmamalıdır!" });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.DIABETES)) {
                reasons.push({ type: 'success', text: "Bupropion, sigarayı bıraktıktan sonra gelişebilecek kilo alımını geciktirebilir, bu da diyabet yönetimi için avantajlıdır." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) {
                 reasons.push({ type: 'warning', text: "KONTRENDİKASYON: Gebelikte Bupropion kullanımı önerilmez." });
            }
        }

        // NRT Bant Analizi
        if (treatmentName.includes('Bant')) {
            if (patient.dailyAmount > 20) {
                reasons.push({ type: 'info', text: `Hasta günde ${patient.dailyAmount} sigara içtiği için TAM DOZ (21mg) başlanmalıdır.` });
            } else {
                reasons.push({ type: 'info', text: `Hasta günde 20'den az (${patient.dailyAmount}) sigara içtiği için ORTA DOZ (14mg) ile başlanması düşünülebilir.` });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.SKIN_SENSITIVITY)) {
                reasons.push({ type: 'warning', text: "Cilt hassasiyeti varsa bant kullanımı tahriş yapabilir. Bölge rotasyonuna çok dikkat edilmeli veya oral formlar seçilmelidir." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) {
                reasons.push({ type: 'info', text: "Gebelikte NRT, ancak davranışsal yöntemler başarısız olursa ve kar/zarar hesabı yapılarak düşünülmelidir. Bant yerine aralıklı formlar (sakız) tercih edilebilir." });
            }
        }

        // NRT Sakız Analizi
        if (treatmentName.includes('Sakız')) {
            reasons.push({ type: 'info', text: "Sakız, ani gelen sigara içme isteği (craving) ile baş etmek için etkilidir." });
            if (patient.comorbidities.includes(COMORBIDITIES.DENTAL_ISSUES)) {
                reasons.push({ type: 'warning', text: "Diş/Protez sorunu varsa sakız yapışabilir, pastil formu düşünülebilir." });
            }
             if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) {
                reasons.push({ type: 'success', text: "Gebelikte NRT gerekliyse, sürekli maruziyet (bant) yerine aralıklı formlar (sakız) daha güvenli olabilir." });
            }
        }

        // Vareniklin Analizi
        if (treatmentName.includes('Vareniklin')) {
            reasons.push({ type: 'success', text: "Yüksek bağımlılık skorlarında başarı oranı en yüksek ajanlardan biridir." });
            if (patient.comorbidities.includes(COMORBIDITIES.RENAL)) {
                reasons.push({ type: 'warning', text: "Böbrek yetmezliğinde doz ayarlaması (yarı doz) gerekebilir." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.DEPRESSION)) {
                reasons.push({ type: 'info', text: "Nöropsikiyatrik yan etkiler (agresyon, intihar düşüncesi) açısından hasta yakından izlenmelidir." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) {
                 reasons.push({ type: 'warning', text: "KONTRENDİKASYON: Gebelikte Vareniklin kullanımı önerilmez." });
            }
            if (patient.comorbidities.includes(COMORBIDITIES.CVD)) {
                reasons.push({ type: 'info', text: "Stabil kardiyovasküler hastalarda güvenlidir ancak akut olaylardan hemen sonra dikkatli kullanılmalıdır." });
            }
        }
        
        // Genel KOAH Analizi
        if (patient.comorbidities.includes(COMORBIDITIES.COPD) && selectedTreatment !== 'Sadece Davranışsal') {
             reasons.push({ type: 'success', text: "KOAH hastalarında ilaç tedavisi ile sigarayı bırakmak, akciğer fonksiyon kaybını yavaşlatan tek yöntemdir. Tedavi süresi uzatılabilir." });
        }

        return reasons;
    };

    // --- REPORT DETAILS MODAL ---
    const ReportDetailsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-800 p-6 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-bold text-xl">Psikososyal Durum Raporu</h3>
                        <p className="text-slate-300 text-xs mt-1">{patient.name} | {patient.psychosocialStatus?.profile}</p>
                    </div>
                    <button onClick={() => setShowReportModal(false)} className="text-white hover:text-red-300 text-2xl font-bold transition-colors">×</button>
                </div>
                
                <div className="p-8 overflow-y-auto space-y-8">
                    {/* Status Indicators */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Evre</span>
                            <span className={`text-lg font-bold ${
                                patient.psychosocialStatus?.lastStage === 'Action' ? 'text-green-600' : 
                                patient.psychosocialStatus?.lastStage === 'Ambivalence' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                                {patient.psychosocialStatus?.lastStage === 'Action' ? 'Eylem' : 
                                 patient.psychosocialStatus?.lastStage === 'Ambivalence' ? 'İkilem' : 'Direnç'}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Hazır Oluş</span>
                            <span className="text-lg font-bold text-slate-700">{patient.psychosocialStatus?.lastScore ?? '-'} / 10</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Seans</span>
                            <span className="text-lg font-bold text-blue-600">#{patient.psychosocialStatus?.sessionCount}</span>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center">
                            <span className="bg-purple-100 text-purple-600 p-1 rounded mr-2 text-sm">❤️</span>
                            Motivasyon Kaynağı
                        </h4>
                        <p className="text-lg text-slate-700 bg-purple-50 p-4 rounded-xl border border-purple-100">
                            "{patient.psychosocialStatus?.motivation}"
                        </p>
                    </div>

                    {/* Last Homework */}
                    <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center">
                            <span className="bg-yellow-100 text-yellow-600 p-1 rounded mr-2 text-sm">📝</span>
                            Son Atanan Görev
                        </h4>
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-900">
                            {patient.psychosocialStatus?.homework || 'Aktif görev bulunmuyor.'}
                        </div>
                    </div>

                    {/* History */}
                    <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Görüşme Notları</h4>
                        <div className="text-sm text-slate-600 space-y-2">
                             {patient.visits
                                .filter(v => v.treatmentType === 'Motivasyonel Görüşme')
                                .map((v, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded border">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>{v.date}</span>
                                        </div>
                                        <p className="whitespace-pre-wrap">{v.notes}</p>
                                    </div>
                                ))}
                             {patient.visits.filter(v => v.treatmentType === 'Motivasyonel Görüşme').length === 0 && (
                                 <p className="text-gray-400 italic">Henüz kaydedilmiş motivasyonel görüşme notu yok.</p>
                             )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <Button onClick={() => setShowReportModal(false)}>Kapat</Button>
                </div>
            </div>
        </div>
    );

    // --- PROGRESS BAR COMPONENT ---
    const renderProgressBar = () => {
        if (currentStep === Step.Dashboard || currentStep === Step.Success) return null;
        
        // Custom header for Homework Check
        if (currentStep === Step.Check_Homework) {
             return (
                <div className="w-full bg-yellow-50 p-4 mb-6 rounded-lg border border-yellow-200 shadow-sm flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="text-yellow-600 text-3xl font-bold">⚠️</div>
                        <div className="h-8 w-px bg-yellow-200"></div>
                        <div>
                            <h3 className="text-yellow-900 font-bold">Ödev ve Takip Kontrolü</h3>
                            <p className="text-yellow-700 text-xs">Klinik müdahaleden önce geçmiş görevler sorgulanıyor.</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (isReady === false) return (
            <div className="w-full bg-red-50 p-4 mb-6 rounded-lg border border-red-200 shadow-sm flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="text-red-600 text-3xl font-bold">5R</div>
                    <div className="h-8 w-px bg-red-200"></div>
                    <div>
                        <h3 className="text-red-900 font-bold">Direnç Yönetimi</h3>
                        <p className="text-red-700 text-xs">Motivasyon artırıcı görüşme teknikleri uygulanıyor.</p>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="w-full mb-8">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded"></div>
                    {STEPS_5A.map((step, idx) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={idx} className="flex flex-col items-center bg-gray-50 px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                                    ${isActive ? 'bg-teal-600 text-white border-teal-600 scale-110' : 
                                      isCompleted ? 'bg-teal-100 text-teal-800 border-teal-600' : 'bg-white text-gray-400 border-gray-300'}
                                `}>
                                    {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-teal-700' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    
    // --- STEP: DASHBOARD ---
    if (currentStep === Step.Dashboard) {
        const lastVisit = patient.visits[patient.visits.length - 1];
        const status = patient.psychosocialStatus;
        const needsMoreMI = patient.psychosocialStatus && patient.psychosocialStatus.lastStage !== 'Action';
        
        // Check for active homework
        const activeHomeworkText = patient.psychosocialStatus?.homework || '';
        // If the homework is "Ödevsiz Takip", we treat it as NO active homework (passive mode)
        const isPassiveFollowUp = activeHomeworkText.includes('Ödevsiz Takip');
        const hasHomework = activeHomeworkText.length > 0 && !isPassiveFollowUp;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                            <p className="text-sm text-slate-500">Hasta Paneli & Tedavi Yönetimi</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={onBack} className="text-red-600 border-red-200 hover:bg-red-50">Çıkış</Button>
                </div>
                
                {status ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8 transition-all hover:shadow-lg">
                        <div className={`h-2 w-full ${
                            status.lastStage === 'Action' ? 'bg-green-500' : 
                            status.lastStage === 'Ambivalence' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Psikososyal Durum Raporu</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">Son Güncelleme: {lastVisit.date}</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Seans #{status.sessionCount}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowReportModal(true)} className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded transition-colors flex items-center">
                                    Detaylı Raporu İncele ↗
                                </button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block mb-1">MEVCUT EVRE</span>
                                    <div className={`text-lg font-bold flex items-center ${
                                        status.lastStage === 'Action' ? 'text-green-700' : 
                                        status.lastStage === 'Ambivalence' ? 'text-yellow-700' : 'text-red-700'
                                    }`}>
                                        <span className="mr-2 text-2xl">
                                            {status.lastStage === 'Action' ? '🚀' : status.lastStage === 'Ambivalence' ? '⚖️' : '🛑'}
                                        </span>
                                        {status.lastStage === 'Action' ? 'Eyleme Hazır' : status.lastStage === 'Ambivalence' ? 'İkilemde (Kararsız)' : 'Dirençli'}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block mb-1">MOTİVASYON</span>
                                    <div className="text-slate-800 font-medium truncate" title={status.motivation}>
                                        ❤️ {status.motivation}
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                    <span className="text-xs font-bold text-yellow-600 block mb-1">AKTİF GÖREV (ÖDEV)</span>
                                    <div className="text-yellow-900 text-sm font-medium line-clamp-2">
                                        {status.homework || 'Atanmış görev yok.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 border-dashed mb-8 text-center">
                        <p className="text-blue-800 font-medium mb-2">Henüz Psikososyal Değerlendirme Yapılmadı</p>
                        <p className="text-sm text-blue-600 mb-4">Hastanın bağımlılık profilini ve motivasyon kaynaklarını belirlemek için görüşme başlatın.</p>
                        {onSwitchToPsychosocial && (
                            <Button onClick={onSwitchToPsychosocial} variant="secondary">Değerlendirmeyi Başlat</Button>
                        )}
                    </div>
                )}

                <h3 className="text-lg font-bold text-slate-800 mb-4">Sonraki Klinik Adım</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {needsMoreMI && onSwitchToPsychosocial ? (
                        <button onClick={onSwitchToPsychosocial}
                            className="p-6 rounded-xl border-2 border-purple-200 hover:bg-purple-50 text-left bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5 text-purple-900 text-6xl font-bold">BDT</div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl mb-3">💬</div>
                                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform bg-white px-2 py-1 rounded-full text-sm shadow-sm">Başla →</span>
                            </div>
                            <h4 className="font-bold text-purple-900 text-lg relative z-10">Görüşmeye Devam Et (BDT)</h4>
                            <p className="text-sm text-gray-600 mt-2 relative z-10">
                                Danışan henüz eyleme hazır değil. Direnç veya ikilem devam ediyor. Ödev kontrolü ve motivasyonel görüşme ile devam edin.
                            </p>
                        </button>
                    ) : (
                        <button onClick={() => { 
                                if (hasHomework) {
                                    setCurrentStep(Step.Check_Homework);
                                } else {
                                    setIsReady(true); setDependence(DependenceLevel.Medium); setCurrentStep(Step.Assist_Behav); 
                                }
                            }}
                            className="p-6 rounded-xl border-2 border-green-200 hover:bg-green-50 text-left bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-5 text-green-900 text-6xl font-bold">PLAN</div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-3">
                                    {hasHomework ? '⚠️' : '📝'}
                                </div>
                                <span className="text-green-600 font-bold group-hover:translate-x-1 transition-transform bg-white px-2 py-1 rounded-full text-sm shadow-sm">
                                    {hasHomework ? 'Kontrol Et →' : 'Oluştur →'}
                                </span>
                            </div>
                            <h4 className="font-bold text-green-900 text-lg relative z-10">{hasHomework ? 'Ödev Kontrolü & Klinik Takip' : 'Kontrol Görüşmesi & Plan'}</h4>
                            <p className="text-sm text-gray-600 mt-2 relative z-10">
                                {hasHomework 
                                    ? 'Danışanın aktif bir psikososyal ödevi var. Klinik tedaviye geçmeden önce durumu değerlendirin.' 
                                    : 'Danışan eyleme hazır. Tetikleyicileri belirleyin, davranışsal destek planı oluşturun ve medikal tedaviye geçin.'}
                            </p>
                        </button>
                    )}

                    <button onClick={() => setCurrentStep(Step.Assess_Test)}
                        className="p-6 rounded-xl border-2 border-blue-200 hover:bg-blue-50 text-left bg-white shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mb-3">🔄</div>
                        </div>
                        <h4 className="font-bold text-blue-900 text-lg">Yeniden Değerlendirme</h4>
                        <p className="text-sm text-gray-600 mt-2">Bağımlılık testini (Fagerström) tekrarla ve 5A modelini baştan başlat.</p>
                    </button>
                </div>
                {showReportModal && <ReportDetailsModal />}
            </div>
        );
    }

    const Wrapper = ({ children, title }: { children?: React.ReactNode, title?: string }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-5xl mx-auto min-h-[60vh] flex flex-col">
            {renderProgressBar()}
            {title && <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">{title}</h2>}
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );
    
    if (currentStep === Step.Check_Homework) {
        const homeworkText = patient.psychosocialStatus?.homework || 'Ödev bilgisi bulunamadı.';
        return (
            <Wrapper title="ÖDEV VE TAKİP KONTROLÜ">
                <div className="max-w-3xl mx-auto text-center space-y-8 py-8">
                    <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 inline-block text-left w-full">
                        <h3 className="text-sm font-bold text-yellow-800 uppercase mb-2 flex items-center">
                            <span className="mr-2">📋</span> Önceki Seansın Görevi
                        </h3>
                        <p className="text-2xl font-serif text-slate-800 italic">"{homeworkText}"</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl">
                        <h4 className="font-bold text-blue-900 mb-4 text-lg">Danışana Sorunuz:</h4>
                        <p className="text-xl text-slate-700 font-medium">"Geçen görüşmemizden bu yana bu öneriyi deneme şansınız oldu mu?"</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <button onClick={() => { setIsReady(true); setDependence(DependenceLevel.Medium); setCurrentStep(Step.Assist_Behav); }}
                            className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left group">
                            <span className="text-3xl mb-2 block">👍</span>
                            <span className="font-bold text-green-900 block text-lg">Evet, Uyguladı / Denedi</span>
                            <span className="text-sm text-green-700 block mt-1 opacity-80 group-hover:opacity-100">"Farkındalığım arttı", "Azalttım" veya "Denedim ama olmadı" (Çaba var).</span>
                            <span className="mt-4 inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">4. Adıma (PLAN) Geç →</span>
                        </button>

                        <button onClick={onSwitchToPsychosocial}
                            className="p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-left group">
                            <span className="text-3xl mb-2 block">👎</span>
                            <span className="font-bold text-red-900 block text-lg">Hayır / Direnç Devam Ediyor</span>
                            <span className="text-sm text-red-700 block mt-1 opacity-80 group-hover:opacity-100">"Unuttum", "Saçma geldi" veya "Hiç denemedim".</span>
                            <span className="mt-4 inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded">Motivasyonel Görüşmeye Dön ↺</span>
                        </button>
                    </div>

                    <div className="mt-8 pt-4 border-t flex justify-between">
                         <Button variant="secondary" onClick={() => setCurrentStep(Step.Dashboard)}>İptal</Button>
                         <button onClick={() => { setIsReady(true); setDependence(DependenceLevel.Medium); setCurrentStep(Step.Assist_Behav); }} className="text-gray-400 text-sm hover:text-gray-600 underline">
                             Bu adımı atla ve direkt tedaviye geç
                         </button>
                    </div>
                </div>
            </Wrapper>
        );
    }
    
    if (currentStep === Step.Ask) {
        return (
            <Wrapper title="1. ADIM: ASK (SOR & SORGULA)">
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
                            <p className="text-sm text-slate-600">Her görüşmede tütün kullanım durumunu ve vital bulguları (Tansiyon, Nabız) sorgulayınız.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-4 text-center p-8 bg-gray-50 rounded-xl">
                        <p className="text-lg font-medium text-slate-700">Tütün kullanım durumu teyit edildi mi?</p>
                        <Button className="w-full md:w-auto" onClick={() => setCurrentStep(Step.Assess_Test)}>
                            Evet, Değerlendirmeye (ASSESS) Geç →
                        </Button>
                        <Button variant="secondary" onClick={onBack}>Geri Dön</Button>
                    </div>
                </div>
            </Wrapper>
        );
    }

    if (currentStep === Step.Assess_Test) {
        return (
            <Wrapper title="2. ADIM: ASSESS (BAĞIMLILIĞI ÖLÇ)">
                <div className="grid md:grid-cols-2 gap-6">
                    {FAGERSTROM_QUESTIONS.map((q, qIdx) => (
                        <div key={q.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start mb-3">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">{qIdx + 1}</span>
                                <p className="font-semibold text-slate-800 text-sm leading-tight">{q.question}</p>
                            </div>
                            <div className="space-y-2 pl-8">
                                {q.options.map((opt, oIdx) => (
                                    <button key={oIdx} onClick={() => handleAnswer(qIdx, opt.points)}
                                        className={`w-full text-left p-2 rounded-lg border text-sm transition-all flex justify-between items-center ${
                                            fagerstromAnswers[qIdx] === opt.points 
                                            ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 text-teal-900 font-medium' 
                                            : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        <span>{opt.text}</span>
                                        {fagerstromAnswers[qIdx] === opt.points && (
                                            <span className="bg-teal-200 text-teal-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                                +{opt.points}
                                            </span>
                                        )}
                                        {fagerstromAnswers[qIdx] !== opt.points && opt.points > 0 && (
                                            <span className="text-gray-300 text-xs font-medium">+{opt.points}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-8 pt-4 border-t items-center">
                    <Button variant="secondary" onClick={() => setCurrentStep(Step.Ask)}>Geri</Button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 italic">
                            {fagerstromAnswers.filter(a => a !== -1).length} / 6 Soru Yanıtlandı
                        </span>
                        <Button disabled={fagerstromAnswers.includes(-1)} onClick={() => { calculateScore(); setCurrentStep(Step.Assess_Ready); }}>
                            Puanı Hesapla ve Analiz Et →
                        </Button>
                    </div>
                </div>
            </Wrapper>
        );
    }
    
    if (currentStep === Step.Assess_Ready) {
        const getInterpretation = (score: number) => {
            if (score <= 2) return "Fiziksel bağımlılık çok düşük. Davranışsal alışkanlıklar ön planda. Sadece motivasyonel destek ve davranışsal öneriler genellikle yeterlidir.";
            if (score <= 5) return "Orta düzey fiziksel bağımlılık. Yoksunluk belirtileri görülebilir. NRT (Bant/Sakız) desteği başarı şansını belirgin şekilde artırır.";
            if (score <= 7) return "Yüksek bağımlılık. Güçlü farmakolojik destek (Vareniklin veya Kombine NRT) ve sıkı takip gerekir. Nüks riski yüksektir.";
            return "Çok yüksek bağımlılık. Hasta sigarasız uyanamaz. Mutlaka farmakoterapi başlanmalı ve yoğun bilişsel davranışçı destek sağlanmalıdır.";
        };

        const getDoctorAdvice = (score: number) => {
            if (score <= 2) return `Sayın ${patient.name}, bağımlılık düzeyiniz henüz başlangıç seviyesinde. Bu büyük bir avantaj. Fiziksel yoksunluk yaşamadan, sadece alışkanlıklarınızı değiştirerek sigaradan kurtulmanız mümkün. Bu fırsatı değerlendirmenizi şiddetle öneriyorum.`;
            if (score <= 5) return `Sayın ${patient.name}, test sonuçlarınız orta düzeyde bir fiziksel bağımlılığa işaret ediyor. Sigarayı bırakma sürecinde zorlanmanız beklenen bir durumdur, ancak bu zorluğu tek başınıza aşmak zorunda değilsiniz. Tıbbi tedavi desteği ile yoksunluk belirtilerini en aza indirerek, bu süreci çok daha rahat ve başarılı bir şekilde yönetebiliriz.`;
            if (score <= 7) return `Sayın ${patient.name}, vücudunuz nikotine biyolojik olarak alışmış durumda. Kendi kendinize bırakmaya çalışmak sizi gereksiz yere yorabilir ve başarısızlık hissi yaratabilir. Tıbbi tedavi desteğiyle bu süreci yönetmemiz sağlığınız için en doğrusudur.`;
            return `Sayın ${patient.name}, test sonucunuz çok yüksek düzeyde fiziksel bağımlılık gösteriyor. Bu durumda sigara içmek bir alışkanlık değil, kronik bir beyin hastalığıdır. Profesyonel ilaç tedavisi olmadan bırakmayı denemek çok zordur. Lütfen size yardım etmeme izin verin.`;
        };

        const scoreColor = score <= 2 ? 'green' : score <= 7 ? 'yellow' : 'red';
        const interpretation = getInterpretation(score);
        const doctorAdvice = getDoctorAdvice(score);

        return (
            <Wrapper title="3. ADIM: ADVISE (ÖNER) & HAZIR OLUŞ">
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
                                    ${scoreColor === 'green' ? 'text-green-800' : 
                                      scoreColor === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
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
                                     ${scoreColor === 'green' ? 'text-green-900' : 
                                       scoreColor === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
                                    <span className="mr-2 text-xl">🩺</span> Klinik Yorum
                                </h4>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    {interpretation}
                                </p>
                                
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

                    <div className="md:col-span-6 space-y-4 mt-2">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-teal-500 shadow-sm">
                            <h4 className="font-bold text-teal-900 mb-2">📢 Hekim Önerisi (ADVISE)</h4>
                            <p className="text-slate-700 italic">"{doctorAdvice}"</p>
                        </div>
                    </div>

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
                        <Button onClick={() => setCurrentStep(isReady ? Step.Assist_Behav : Step.Assist_Med)}>
                            {isReady ? '4. Adım: ASSIST (Yardım) →' : '5R Modeline Git →'}
                        </Button>
                    )}
                </div>
            </Wrapper>
        );
    }

    if (currentStep === Step.Assist_Med && !isReady) {
        const currentR = FIVE_R_DETAILS[activeRStep];
        return (
             <Wrapper title={`MÜDAHALE: 5R - ${currentR.title}`}>
                <div className="flex mb-6 space-x-1 overflow-x-auto pb-2">
                    {FIVE_R_DETAILS.map((r, idx) => (
                        <button 
                            key={r.id}
                            onClick={() => setActiveRStep(idx)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex flex-col items-center justify-center min-w-[100px]
                                ${idx === activeRStep 
                                    ? 'bg-red-600 text-white shadow-md' 
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                }`}
                        >
                            <span>{r.id.charAt(0).toUpperCase() + r.id.slice(1)}</span>
                            <span className="text-[10px] font-normal opacity-90">
                                ({
                                    r.id === 'relevance' ? 'İlişkilendirme' :
                                    r.id === 'risks' ? 'Riskler' :
                                    r.id === 'rewards' ? 'Ödüller' :
                                    r.id === 'roadblocks' ? 'Engeller' :
                                    r.id === 'repetition' ? 'Tekrar' : ''
                                })
                            </span>
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-12 gap-6 h-full">
                    <div className="md:col-span-5 space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-500 uppercase mb-1">Hedef</h4>
                            <p className="text-sm text-blue-900">{currentR.goal}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border-2 border-red-100 shadow-sm relative">
                            <div className="absolute -top-3 -left-3 bg-red-100 text-red-600 p-2 rounded-full shadow-sm">
                                <span className="text-xl">💬</span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2 mt-2">Hastaya Sorunuz:</h4>
                            <p className="text-lg text-slate-700 font-medium italic">"{currentR.question}"</p>
                        </div>
                        {currentR.id === 'roadblocks' && selectedRItems.some(id => id.startsWith('rb_')) && (
                             <div className="bg-green-50 p-4 rounded-lg border border-green-200 animate-fadeIn">
                                <h4 className="font-bold text-green-800 mb-2 flex items-center">
                                    <span className="mr-2">💡</span> Çözüm Önerisi (Cevap):
                                </h4>
                                <ul className="space-y-2 text-sm text-green-900">
                                    {currentR.items
                                        .filter(i => selectedRItems.includes(i.id))
                                        .map(i => (
                                            <li key={i.id} className="border-b border-green-200 pb-2 last:border-0">
                                                <strong>{i.text}:</strong> { (i as any).solution }
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-7">
                        <h4 className="font-bold text-slate-700 mb-3">Danışanın Cevapları / Tespitler:</h4>
                        <div className="space-y-2">
                            {currentR.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => toggleRItem(item.id)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center
                                        ${selectedRItems.includes(item.id) 
                                            ? 'bg-red-50 border-red-500 shadow-sm ring-1 ring-red-500' 
                                            : 'bg-white border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center flex-shrink-0
                                        ${selectedRItems.includes(item.id) ? 'bg-red-600 border-red-600' : 'border-gray-400'}
                                    `}>
                                        {selectedRItems.includes(item.id) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className="text-slate-800 font-medium">{item.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-6 border-t">
                    <Button variant="secondary" onClick={() => {
                        if (activeRStep > 0) setActiveRStep(activeRStep - 1);
                        else setCurrentStep(Step.Assess_Ready);
                    }}>
                        {activeRStep === 0 ? 'Geri Dön' : '← Önceki Adım'}
                    </Button>
                    <div className="flex space-x-2">
                        {activeRStep < FIVE_R_DETAILS.length - 1 ? (
                            <Button onClick={() => setActiveRStep(activeRStep + 1)}>
                                Sonraki Adım →
                            </Button>
                        ) : (
                            <Button onClick={saveVisit} className="bg-red-600 hover:bg-red-700">
                                Görüşmeyi Kaydet ve Bitir
                            </Button>
                        )}
                    </div>
                </div>
             </Wrapper>
        );
    }
    
    if (currentStep === Step.Assist_Behav) {
        return (
            <Wrapper title="4. ADIM: ASSIST (YARDIM ET) - Davranışsal Destek">
                <p className="mb-6 text-slate-600 bg-blue-50 p-3 rounded text-sm">
                    <strong>Talimat:</strong> İlaç tedavisinden önce, hastanın sigara içme tetikleyicilerini belirleyin. Seçilen her tetikleyici için sağ taraftaki stratejiyi hastaya anlatın ve diyaloğu uygulayın.
                </p>
                
                <div className="grid md:grid-cols-12 gap-6 h-full">
                    {/* LEFT: Trigger Selection */}
                    <div className="md:col-span-4 space-y-3 overflow-y-auto max-h-[500px]">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b pb-2 mb-3">Tetikleyicileri Seçiniz</h3>
                        {BEHAVIORAL_GUIDE.map((item) => (
                            <label key={item.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedTriggers.includes(item.id) ? 'bg-purple-50 border-purple-500 shadow-sm' : 'bg-white hover:bg-gray-50'}`}>
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                    checked={selectedTriggers.includes(item.id)}
                                    onChange={() => toggleTrigger(item.id)}
                                />
                                <span className="ml-3 font-medium text-slate-700">{item.trigger}</span>
                            </label>
                        ))}
                    </div>

                    {/* RIGHT: Detailed Advice Cards */}
                    <div className="md:col-span-8 bg-gray-50 p-6 rounded-xl border border-gray-200 overflow-y-auto max-h-[600px]">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center border-b pb-2">
                            <span className="text-xl mr-2">📋</span> Kişiselleştirilmiş Müdahale Planı
                        </h3>
                        
                        {selectedTriggers.length === 0 ? (
                            <div className="text-center text-gray-400 py-20 flex flex-col items-center">
                                <span className="text-4xl mb-2">👈</span>
                                <p>Soldan hastanın sigara içme nedenlerini seçiniz.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {BEHAVIORAL_GUIDE.filter(i => selectedTriggers.includes(i.id)).map(guide => (
                                    <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
                                        {/* Header */}
                                        <div className="bg-purple-100 p-3 border-b border-purple-200 flex items-center">
                                            <span className="font-bold text-purple-900">{guide.trigger}</span>
                                        </div>
                                        
                                        <div className="p-5 space-y-4">
                                            {/* Strategy */}
                                            <div>
                                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">✅ Önerilen Strateji</h5>
                                                <p className="text-slate-800 font-medium">{guide.strategy}</p>
                                            </div>

                                            {/* Dialogue Bubble */}
                                            <div className="relative pl-4">
                                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-full"></div>
                                                 <h5 className="text-xs font-bold text-blue-500 uppercase mb-1 ml-2">🗣️ Hekim Diyaloğu (Örnek)</h5>
                                                 <p className="text-slate-600 italic bg-blue-50 p-3 rounded-r-lg rounded-bl-lg text-sm">
                                                    "{guide.dialogue}"
                                                 </p>
                                            </div>

                                            {/* Troubleshooting */}
                                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm">
                                                <div className="flex items-start mb-1">
                                                    <span className="text-orange-600 mr-2">⚠️</span>
                                                    <strong className="text-orange-800">Olası Zorluk:</strong>
                                                    <span className="ml-1 text-orange-900">{guide.challenge}</span>
                                                </div>
                                                <div className="flex items-start ml-6">
                                                    <span className="text-green-600 mr-2">💡</span>
                                                    <strong className="text-green-800">Çözüm:</strong>
                                                    <span className="ml-1 text-green-900">{guide.solution}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="secondary" onClick={() => setCurrentStep(Step.Assess_Ready)}>Geri</Button>
                    <Button onClick={() => setCurrentStep(Step.Assist_Med)}>Tedavi Planına İlerle (Medikal) →</Button>
                </div>
            </Wrapper>
        );
    }
    
    if (currentStep === Step.Assist_Med) {
        const selectedDrugInfo = PHARMACOLOGICAL_TREATMENTS.find(d => d.name === selectedTreatment);
        const reasons = getTreatmentReasoning(selectedTreatment);
        
        // --- NEW: CLINICAL RECOMMENDATION ---
        const recommendation = getClinicalRecommendation();

        return (
            <Wrapper title="4. ASSIST (TEDAVİ SEÇİMİ) & 5. ARRANGE (İZLEM)">
                {/* --- NEW RECOMMENDATION ALERT BOX --- */}
                <div className={`mb-6 p-4 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between
                    ${recommendation.priority === 'high' ? 'bg-teal-50 border-teal-500' : 'bg-blue-50 border-blue-500'}`}>
                    <div className="flex-grow">
                        <h3 className={`font-bold text-sm uppercase flex items-center mb-1
                            ${recommendation.priority === 'high' ? 'text-teal-800' : 'text-blue-800'}`}>
                            <span className="text-xl mr-2">🤖</span> Klinik Karar Destek Önerisi
                        </h3>
                        <div className="ml-7">
                            <p className="font-bold text-lg text-slate-800">{recommendation.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{recommendation.reason}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedTreatment(recommendation.name)}
                        className={`mt-3 md:mt-0 md:ml-4 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors
                            ${recommendation.priority === 'high' 
                                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        Bu Tedaviyi Seç ✓
                    </button>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: SELECTION */}
                    <div className="md:col-span-5 space-y-4">
                        <h3 className="font-bold text-slate-800 border-b pb-2">Tedavi Yöntemi</h3>
                        <select 
                            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-teal-500 text-lg"
                            value={selectedTreatment}
                            onChange={(e) => setSelectedTreatment(e.target.value)}
                        >
                            <option value="">-- Seçiniz --</option>
                            <option value="Sadece Davranışsal">Sadece Davranışsal Destek (İlaçsız)</option>
                            <option disabled>──────────</option>
                            {PHARMACOLOGICAL_TREATMENTS.map((drug, idx) => (
                                <option key={idx} value={drug.name}>{drug.name}</option>
                            ))}
                        </select>

                        {/* Specific Reasoning for Patient */}
                        {selectedTreatment && reasons.length > 0 && (
                            <div className="bg-white border rounded-lg p-3 space-y-2 shadow-sm">
                                <h4 className="font-bold text-xs text-gray-500 uppercase">Bu Hasta İçin Analiz</h4>
                                {reasons.map((r, i) => (
                                    <div key={i} className={`text-sm p-2 rounded flex items-start ${r.type === 'success' ? 'bg-green-50 text-green-800' : r.type === 'warning' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                                        <span className="mr-2 text-lg">{r.type === 'success' ? '✅' : r.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                        {r.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-gray-700 mb-2 text-sm">Takip Planı (ARRANGE)</h4>
                            <div className="space-y-2 text-sm">
                                <label className="flex items-center"><input type="checkbox" checked disabled className="mr-2 text-green-600"/> Bırakma Günü Belirlendi</label>
                                <label className="flex items-center"><input type="checkbox" checked disabled className="mr-2 text-green-600"/> İlk Kontrol (1. Hafta)</label>
                            </div>
                        </div>
                         <div>
                            <label className="block font-bold text-slate-700 mb-2 text-sm">Klinik Notlar:</label>
                            <textarea 
                                className="w-full border rounded p-2 h-20 text-sm"
                                placeholder="Özel notlar..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PROTOCOL CARD */}
                    <div className="md:col-span-7">
                        {selectedTreatment && selectedTreatment !== 'Sadece Davranışsal' && selectedDrugInfo ? (
                            <div className="bg-white border-2 border-teal-100 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                                <div className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
                                    <h3 className="font-bold text-teal-900 text-lg">{selectedDrugInfo.commercialName} Protokolü</h3>
                                    <span className="text-xs bg-white px-2 py-1 rounded text-teal-600 border border-teal-200">Rehber Bilgisi</span>
                                </div>
                                <div className="p-5 space-y-5 overflow-y-auto max-h-[500px]">
                                    
                                    {/* Dosage Section */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center mb-2">
                                            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                                            Başlangıç Dozu
                                        </h4>
                                        <p className="text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            {selectedDrugInfo.dosage}
                                        </p>
                                    </div>

                                    {/* Titration Section */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center mb-2">
                                            <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                                            Doz Artırımı / İdame (Titrasyon)
                                        </h4>
                                        <p className="text-slate-600 text-sm whitespace-pre-line ml-8">
                                            {selectedDrugInfo.titration}
                                        </p>
                                    </div>

                                    {/* Side Effects Section */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center mb-2">
                                            <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                                            Olası Yan Etkiler & Yönetimi
                                        </h4>
                                        <div className="ml-8 space-y-3">
                                            {selectedDrugInfo.sideEffects.length === 0 ? (
                                                <p className="text-sm text-gray-500">Belirgin bir yan etki bildirilmemiştir.</p>
                                            ) : (
                                                selectedDrugInfo.sideEffects.map((item, i) => (
                                                     <div key={i} className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm">
                                                        <div className="font-bold text-red-700 mb-1 flex items-start">
                                                            <span className="mr-2 text-lg leading-none">•</span>
                                                            <span>{item.effect}</span>
                                                        </div>
                                                        <div className="text-slate-700 pl-4 border-l-2 border-orange-300 ml-1">
                                                            <span className="font-bold text-orange-800 block text-xs uppercase mb-1">Yönetim Stratejisi:</span>
                                                            {item.management}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ) : selectedTreatment === 'Sadece Davranışsal' ? (
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-full flex flex-col items-center justify-center text-center text-blue-800">
                                <h3 className="text-xl font-bold mb-2">İlaçsız Takip</h3>
                                <p>Hastanın bağımlılık düzeyi düşük olduğu için veya hasta tercihi/kontrendikasyon nedeniyle farmakolojik tedavi başlanmadı.</p>
                                <p className="mt-4 text-sm">Sıkı davranışsal takip ve motivasyonel görüşme (15 günde bir) önerilir.</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-4xl mb-4">💊</span>
                                <p>Detaylı protokolü görmek için<br/>soldan bir tedavi yöntemi seçiniz.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-auto pt-6">
                    <Button variant="secondary" onClick={() => setCurrentStep(Step.Assist_Behav)}>Geri</Button>
                    <Button onClick={saveVisit} disabled={!selectedTreatment} className="px-8">
                        Tedaviyi Onayla ve Bitir
                    </Button>
                </div>
            </Wrapper>
        );
    }

    if (currentStep === Step.Success) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm max-w-2xl mx-auto text-center mt-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Kayıt Başarılı</h2>
                <p className="text-slate-500 mb-8">
                    Danışan için <strong>{isReady ? '5A Modeli' : '5R Modeli'}</strong> başarıyla uygulandı ve tedavi planı oluşturuldu.
                </p>
                <Button onClick={onBack}>Danışan Listesine Dön</Button>
            </div>
        );
    }

    return null;
};

import React from 'react';
import { Patient } from '../../types';
import { Button } from '../Button';
import { InterventionStep } from './types';
import { ReportModal } from './ReportModal';
import { DependenceLevel } from '../../types';

interface DashboardProps {
    patient: Patient;
    onBack: () => void;
    onSwitchToPsychosocial?: () => void;
    onSetCurrentStep: (step: InterventionStep) => void;
    onSetIsReady: (ready: boolean) => void;
    onSetDependence: (dep: DependenceLevel) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    patient,
    onBack,
    onSwitchToPsychosocial,
    onSetCurrentStep,
    onSetIsReady,
    onSetDependence
}) => {
    const [showReportModal, setShowReportModal] = React.useState(false);

    const lastVisit = patient.visits[patient.visits.length - 1];
    const status = patient.psychosocialStatus;
    const needsMoreMI = patient.psychosocialStatus && patient.psychosocialStatus.lastStage !== 'Action';
    const activeHomeworkText = patient.psychosocialStatus?.homework || '';
    const isPassiveFollowUp = activeHomeworkText.includes('Ödevsiz Takip');
    const hasHomework = activeHomeworkText.length > 0 && !isPassiveFollowUp;

    const handleProceedToTreatment = () => {
        if (hasHomework) {
            onSetCurrentStep(InterventionStep.Check_Homework);
        } else {
            onSetIsReady(true);
            onSetDependence(DependenceLevel.Medium);
            onSetCurrentStep(InterventionStep.Assist_Behav);
        }
    };

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
                    <button onClick={() => onSetCurrentStep(InterventionStep.Drug_Follow_Up)}
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
                    <button onClick={handleProceedToTreatment}
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

                <button onClick={() => onSetCurrentStep(InterventionStep.Assess_Test)}
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
};

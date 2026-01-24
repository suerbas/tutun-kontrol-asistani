import React from 'react';
import { Patient, PsychosocialStatus } from '../../types';
import { Button } from '../Button';
import { CBTTools } from '../CBTTools';

interface PsychosocialDashboardProps {
    patient: Patient;
    status: PsychosocialStatus;
    onStartFollowUp: () => void;
    onSwitchToIntervention?: () => void;
    onUpdateProfile: () => void;
    onBack: () => void;
    onUpdatePatient: (patient: Patient) => void;
}

export const PsychosocialDashboard: React.FC<PsychosocialDashboardProps> = ({
    patient,
    status,
    onStartFollowUp,
    onSwitchToIntervention,
    onUpdateProfile,
    onBack,
    onUpdatePatient
}) => {
    const [showCBTTools, setShowCBTTools] = React.useState(false);

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
                        {patient.activeTreatment?.isActive && (
                            <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                                <h3 className="text-sm font-bold text-teal-800 uppercase mb-3 flex items-center">
                                    <span className="mr-2">💊</span> Aktif İlaç Tedavisi
                                </h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium text-teal-900">
                                        {patient.activeTreatment.commercialName || patient.activeTreatment.drugName}
                                    </p>
                                    <span className="text-xs text-teal-600">Başlangıç: {patient.activeTreatment.startDate}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={onStartFollowUp}
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

                        <Button variant="outline" onClick={onUpdateProfile} className="mt-2 text-xs">
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
                <CBTTools patient={patient} onClose={() => setShowCBTTools(false)} onUpdatePatient={onUpdatePatient} />
            )}
        </div>
    );
};

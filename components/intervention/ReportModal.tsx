import React from 'react';
import { Patient } from '../../types';
import { Button } from '../Button';

interface ReportModalProps {
    patient: Patient;
    onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ patient, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-800 p-6 flex justify-between items-center text-white">
                <div>
                    <h3 className="font-bold text-xl">Psikososyal Durum Raporu</h3>
                    <p className="text-slate-300 text-xs mt-1">{patient.name} | {patient.psychosocialStatus?.profile}</p>
                </div>
                <button onClick={onClose} className="text-white hover:text-red-300 text-2xl font-bold transition-colors">×</button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
                {/* Status Indicators */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                        <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Evre</span>
                        <span className={`text-lg font-bold ${patient.psychosocialStatus?.lastStage === 'Action' ? 'text-green-600' :
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

                {/* Aktif İlaç Tedavisi */}
                <div>
                    <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center">
                        <span className="bg-teal-100 text-teal-600 p-1 rounded mr-2 text-sm">💊</span>
                        İlaç Tedavisi Durumu
                    </h4>
                    {patient.activeTreatment?.isActive ? (
                        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-lg font-bold text-teal-900">
                                        {patient.activeTreatment.commercialName || patient.activeTreatment.drugName}
                                    </span>
                                    <p className="text-sm text-teal-700 mt-1">
                                        {patient.activeTreatment.dosage}
                                    </p>
                                </div>
                                <span className="bg-teal-200 text-teal-800 px-2 py-1 rounded text-xs font-bold">
                                    AKTİF
                                </span>
                            </div>
                            <p className="text-xs text-teal-600 mt-2">
                                Başlangıç: {patient.activeTreatment.startDate}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-500 italic">
                            Henüz ilaçlı tedavi başlatılmadı.
                        </div>
                    )}
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
                <Button onClick={onClose}>Kapat</Button>
            </div>
        </div>
    </div>
);

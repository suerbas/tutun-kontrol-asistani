import React from 'react';
import { Button } from '../Button';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';
import { BEHAVIORAL_GUIDE } from '../../constants';

interface AssistBehavioralStepProps {
    isReady: boolean | null;
    selectedTriggers: string[];
    onToggleTrigger: (triggerId: string) => void;
    onBack: () => void;
    onProceed: () => void;
}

export const AssistBehavioralStep: React.FC<AssistBehavioralStepProps> = ({
    isReady,
    selectedTriggers,
    onToggleTrigger,
    onBack,
    onProceed
}) => {
    return (
        <Wrapper title="4. ADIM: ASSIST (YARDIM ET) - Davranışsal Destek" currentStep={InterventionStep.Assist_Behav} isReady={isReady}>
            <p className="mb-6 text-slate-600 bg-blue-50 p-3 rounded text-sm">
                <strong>Talimat:</strong> Hastanın sigara içme tetikleyicilerini belirleyin.
            </p>
            <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm uppercase border-b pb-2">Tetikleyicileri Seçiniz</h3>
                    {BEHAVIORAL_GUIDE.map((item) => (
                        <label key={item.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedTriggers.includes(item.id) ? 'bg-purple-50 border-purple-500' : 'bg-white hover:bg-gray-50'}`}>
                            <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" checked={selectedTriggers.includes(item.id)} onChange={() => onToggleTrigger(item.id)} />
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
                <Button variant="secondary" onClick={onBack}>Geri</Button>
                <Button onClick={onProceed}>Tedavi Planına İlerle →</Button>
            </div>
        </Wrapper>
    );
};

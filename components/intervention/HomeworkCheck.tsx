import React from 'react';
import { Patient, DependenceLevel } from '../../types';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';
import { Button } from '../Button';

interface HomeworkCheckProps {
    patient: Patient;
    onProceedToTreatment: () => void;
    onSwitchToPsychosocial?: () => void;
    onBack: () => void;
}

export const HomeworkCheck: React.FC<HomeworkCheckProps> = ({ patient, onProceedToTreatment, onSwitchToPsychosocial, onBack }) => {
    const homeworkText = patient.psychosocialStatus?.homework || 'Ödev bilgisi bulunamadı.';

    return (
        <Wrapper title="ÖDEV VE TAKİP KONTROLÜ" currentStep={InterventionStep.Check_Homework} isReady={null}>
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
                    <button onClick={onProceedToTreatment}
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
                    <Button variant="secondary" onClick={onBack}>İptal</Button>
                    <button onClick={onProceedToTreatment} className="text-gray-400 text-sm hover:text-gray-600 underline">
                        Bu adımı atla ve direkt tedaviye geç
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

import React from 'react';
import { Patient } from '../../types';
import { Button } from '../Button';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';

interface AskStepProps {
    patient: Patient;
    isReady: boolean | null;
    onBack: () => void;
    onProceed: () => void;
}

export const AskStep: React.FC<AskStepProps> = ({ patient, isReady, onBack, onProceed }) => {
    return (
        <Wrapper title="1. ADIM: ASK (SOR & SORGULA)" currentStep={InterventionStep.Ask} isReady={isReady}>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-bold text-blue-900">Hasta Profili</h3>
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                            <li><strong>Danışan kodu:</strong> {patient.code} ({patient.age}y, {patient.gender})</li>
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
                    <Button className="w-full md:w-auto" onClick={onProceed}>Evet, Değerlendirmeye (ASSESS) Geç →</Button>
                    <Button variant="secondary" onClick={onBack}>Geri Dön</Button>
                </div>
            </div>
        </Wrapper>
    );
};

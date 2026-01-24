import React from 'react';
import { InterventionStep } from './types';

interface ProgressBarProps {
    currentStep: InterventionStep;
    isReady: boolean | null;
}

const STEPS_5A = [
    { id: InterventionStep.Ask, label: '1. ASK (Sor)' },
    { id: InterventionStep.Assess_Test, label: '2. ASSESS (Ölç)' },
    { id: InterventionStep.Assess_Ready, label: '3. ADVISE (Öner)' },
    { id: InterventionStep.Assist_Behav, label: '4. ASSIST (Yardım)' },
    { id: InterventionStep.Assist_Med, label: '5. ARRANGE (Planla)' }
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, isReady }) => {
    if (currentStep === InterventionStep.Dashboard || currentStep === InterventionStep.Success) return null;

    // Ödev Kontrolü için özel başlık
    if (currentStep === InterventionStep.Check_Homework) {
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

    // İlaç Takip için özel başlık
    if (currentStep === InterventionStep.Drug_Follow_Up) {
        return (
            <div className="w-full bg-teal-50 p-4 mb-6 rounded-lg border border-teal-200 shadow-sm flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="text-teal-600 text-3xl font-bold">💊</div>
                    <div className="h-8 w-px bg-teal-200"></div>
                    <div>
                        <h3 className="text-teal-900 font-bold">İlaç Tedavisi Takibi</h3>
                        <p className="text-teal-700 text-xs">Hasta uyumu, yan etkiler ve sigara kullanım durumu değerlendiriliyor.</p>
                    </div>
                </div>
            </div>
        );
    }

    // 5R Modu
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

    // 5A İlerleme Çubuğu
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

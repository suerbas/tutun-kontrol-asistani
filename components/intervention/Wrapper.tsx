import React from 'react';
import { ProgressBar } from './ProgressBar';
import { InterventionStep } from './types';

interface WrapperProps {
    children?: React.ReactNode;
    title?: string;
    currentStep: InterventionStep;
    isReady: boolean | null;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, title, currentStep, isReady }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-5xl mx-auto min-h-[60vh] flex flex-col">
        <ProgressBar currentStep={currentStep} isReady={isReady} />
        {title && <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">{title}</h2>}
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

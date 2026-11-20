import React from 'react';
import { SpecialProfile } from '../../types';
import { PSYCHOSOCIAL_SCENARIOS } from '../../constants';
import { Button } from '../Button';
import { SOSPanel } from './SOSPanel';

interface SessionState {
    patientName: string;
    profile: SpecialProfile;
    motivation: string;
    currentStepId: string;
    history: string[];
    homework: string;
    notes: string[];
    selectedScore?: number;
}

interface PsychosocialInterviewProps {
    sessionState: SessionState;
    onNextStep: (nextStepId: string, insight?: string, homework?: string) => void;
    onBack: () => void;
    onScoreSelect: (score: number) => void;
    onSwitchToIntervention?: () => void;
    onFinish: (insight: string) => void;
}

export const PsychosocialInterview: React.FC<PsychosocialInterviewProps> = ({
    sessionState,
    onNextStep,
    onBack,
    onScoreSelect,
    onSwitchToIntervention,
    onFinish
}) => {
    const [showSOS, setShowSOS] = React.useState(false);

    const parseScript = (text: string) => {
        let parsed = text
            .replace(/\[Name\]/g, sessionState.patientName)
            .replace(/\[Motivation\]/g, sessionState.motivation);
        if (sessionState.selectedScore !== undefined) {
            parsed = parsed.replace(/\[Score\]/g, sessionState.selectedScore.toString());
            const lowerScore = Math.max(0, sessionState.selectedScore - 2);
            parsed = parsed.replace(/\[Lower\]/g, lowerScore.toString());
        }
        return parsed;
    };

    const currentStep = PSYCHOSOCIAL_SCENARIOS[sessionState.currentStepId];

    if (!currentStep) {
        return <div>Hata: Senaryo adımı bulunamadı ({sessionState.currentStepId})</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 pb-28 flex flex-col gap-6 min-h-[90vh] relative">
            {/* Header */}
            <div className="bg-slate-800 text-white p-4 rounded-xl flex justify-between items-center shadow-md">
                <div>
                    <span className="font-bold opacity-75 mr-2">Danışan:</span>
                    <span className="text-lg font-bold mr-4">{sessionState.patientName}</span>
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">{sessionState.profile}</span>
                </div>
                <div className="text-sm">
                    <span className="opacity-75 mr-2">Motivasyon:</span>
                    <span className="font-bold text-yellow-300">{sessionState.motivation}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow grid grid-cols-1 gap-6">
                {/* Script Card */}
                <div className="bg-white rounded-2xl shadow-xl border-l-8 border-purple-600 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-serif text-purple-900 select-none">"</div>
                    <h3 className="text-sm font-bold text-purple-600 uppercase mb-4 tracking-widest flex items-center">
                        <span className="bg-purple-100 p-1 rounded mr-2">📢</span> HEKİM REPLİĞİ
                    </h3>
                    <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed font-serif">
                        {parseScript(currentStep.script)}
                    </p>
                </div>

                {/* Tip Card */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start">
                    <div className="text-3xl mr-4">💡</div>
                    <div>
                        <h4 className="font-bold text-yellow-800 mb-1 text-sm uppercase">Klinik İpucu</h4>
                        <p className="text-yellow-900 text-lg">{currentStep.tip}</p>
                    </div>
                </div>

                {/* Response Options */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-center text-gray-500 font-bold mb-4 text-sm uppercase">Danışanın Tepkisi Nedir?</h4>
                    {currentStep.type === 'scale' ? (
                        <div className="grid grid-cols-3 md:grid-cols-11 gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                <button
                                    key={score}
                                    onClick={() => onScoreSelect(score)}
                                    className={`py-4 rounded-lg font-bold text-lg transition-all ${score <= 3 ? 'bg-red-100 text-red-800' : score <= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentStep.responses?.map((resp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onNextStep(resp.nextStep, resp.insight, resp.homework)}
                                    className={`p-4 rounded-xl text-left border-l-8 shadow-sm transition-all hover:translate-x-1 flex items-center bg-white ${resp.type === 'positive' ? 'border-green-500' : resp.type === 'negative' ? 'border-red-500' : 'border-gray-400'}`}
                                >
                                    <span className="font-bold text-lg text-slate-700">{parseScript(resp.label)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={onBack} disabled={sessionState.history.length <= 1}>← Geri Al</Button>
                    <Button variant="outline" className="text-xs" onClick={onSwitchToIntervention}>Tedavi Modülüne Geç</Button>
                </div>
            </div>

            {/* SOS Panel */}
            <SOSPanel
                isVisible={showSOS}
                onToggle={() => setShowSOS(!showSOS)}
                onFinish={() => {
                    setShowSOS(false);
                    onFinish('Görüşme yarıda kesildi.');
                }}
            />
        </div>
    );
};

import React from 'react';
import { FAGERSTROM_QUESTIONS } from '../../constants';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';
import { Button } from '../Button';

interface FagerstromTestProps {
    answers: number[];
    onAnswer: (questionIndex: number, points: number) => void;
    onBack: () => void;
    onComplete: () => void;
}

export const FagerstromTest: React.FC<FagerstromTestProps> = ({ answers, onAnswer, onBack, onComplete }) => {
    const allAnswered = !answers.includes(-1);

    return (
        <Wrapper title="2. ADIM: ASSESS (BAĞIMLILIĞI ÖLÇ)" currentStep={InterventionStep.Assess_Test} isReady={null}>
            <div className="grid md:grid-cols-2 gap-6">
                {FAGERSTROM_QUESTIONS.map((q, qIdx) => (
                    <div key={q.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-3">
                            <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">{qIdx + 1}</span>
                            <p className="font-semibold text-slate-800 text-sm leading-tight">{q.question}</p>
                        </div>
                        <div className="space-y-2 pl-8">
                            {q.options.map((opt, oIdx) => (
                                <button key={oIdx} onClick={() => onAnswer(qIdx, opt.points)}
                                    className={`w-full text-left p-2 rounded-lg border text-sm transition-all flex justify-between items-center ${answers[qIdx] === opt.points
                                        ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 text-teal-900 font-medium'
                                        : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                                        }`}>
                                    <span>{opt.text}</span>
                                    {answers[qIdx] === opt.points && (
                                        <span className="bg-teal-200 text-teal-800 text-xs px-2 py-0.5 rounded-full font-bold">+{opt.points}</span>
                                    )}
                                    {answers[qIdx] !== opt.points && opt.points > 0 && (
                                        <span className="text-gray-300 text-xs font-medium">+{opt.points}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-8 pt-4 border-t items-center">
                <Button variant="secondary" onClick={onBack}>Geri</Button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 italic">
                        {answers.filter(a => a !== -1).length} / 6 Soru Yanıtlandı
                    </span>
                    <Button disabled={!allAnswered} onClick={onComplete}>
                        Puanı Hesapla ve Analiz Et →
                    </Button>
                </div>
            </div>
        </Wrapper>
    );
};

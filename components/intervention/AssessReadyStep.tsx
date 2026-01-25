import React from 'react';
import { Patient, DependenceLevel } from '../../types';
import { Button } from '../Button';
import { InterventionStep } from './types';
import { Wrapper } from './Wrapper';

interface AssessReadyStepProps {
    patient: Patient;
    score: number;
    dependence: DependenceLevel;
    isReady: boolean | null;
    onSetIsReady: (ready: boolean) => void;
    onProceed: () => void;
}

export const AssessReadyStep: React.FC<AssessReadyStepProps> = ({
    patient,
    score,
    dependence,
    isReady,
    onSetIsReady,
    onProceed
}) => {
    const getInterpretation = (s: number) => {
        if (s <= 2) return "Fiziksel bağımlılık çok düşük. Davranışsal alışkanlıklar ön planda. Sadece motivasyonel destek ve davranışsal öneriler genellikle yeterlidir.";
        if (s <= 5) return "Orta düzey fiziksel bağımlılık. Yoksunluk belirtileri görülebilir. NRT (Bant/Sakız) desteği başarı şansını belirgin şekilde artırır.";
        if (s <= 7) return "Yüksek bağımlılık. Güçlü farmakolojik destek (Vareniklin veya Kombine NRT) ve sıkı takip gerekir. Nüks riski yüksektir.";
        return "Çok yüksek bağımlılık. Hasta sigarasız uyanamaz. Mutlaka farmakoterapi başlanmalı ve yoğun bilişsel davranışçı destek sağlanmalıdır.";
    };

    const getDoctorAdvice = (s: number) => {
        if (s <= 2) return `Sayın ${patient.name}, bağımlılık düzeyiniz henüz başlangıç seviyesinde. Bu büyük bir avantaj. Fiziksel yoksunluk yaşamadan, sadece alışkanlıklarınızı değiştirerek sigaradan kurtulmanız mümkün.`;
        if (s <= 5) return `Sayın ${patient.name}, test sonuçlarınız orta düzeyde bir fiziksel bağımlılığa işaret ediyor. Sigarayı bırakma sürecinde zorlanmanız beklenen bir durumdur, ancak bu zorluğu tek başınıza aşmak zorunda değilsiniz. Tıbbi tedavi desteği ile yoksunluk belirtilerini en aza indirerek, bu süreci çok daha rahat yönetebiliriz.`;
        if (s <= 7) return `Sayın ${patient.name}, vücudunuz nikotine biyolojik olarak alışmış durumda. Kendi kendinize bırakmaya çalışmak sizi gereksiz yere yorabilir. Tıbbi tedavi desteğiyle bu süreci yönetmemiz sağlığınız için en doğrusudur.`;
        return `Sayın ${patient.name}, test sonucunuz çok yüksek düzeyde fiziksel bağımlılık gösteriyor. Profesyonel ilaç tedavisi olmadan bırakmayı denemek çok zordur. Lütfen size yardım etmeme izin verin.`;
    };

    const scoreColor = score <= 2 ? 'green' : score <= 7 ? 'yellow' : 'red';
    const interpretation = getInterpretation(score);
    const doctorAdvice = getDoctorAdvice(score);

    return (
        <Wrapper title="3. ADIM: ADVISE (ÖNER) & HAZIR OLUŞ" currentStep={InterventionStep.Assess_Ready} isReady={isReady}>
            <div className="grid md:grid-cols-12 gap-6">
                {/* RESULT CARD */}
                <div className="md:col-span-12">
                    <div className={`rounded-xl border-2 overflow-hidden shadow-sm flex flex-col md:flex-row
                        ${scoreColor === 'green' ? 'border-green-200 bg-green-50' :
                            scoreColor === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>

                        {/* Score Display */}
                        <div className={`p-6 flex flex-col items-center justify-center min-w-[200px] border-b md:border-b-0 md:border-r 
                            ${scoreColor === 'green' ? 'border-green-200 bg-green-100' :
                                scoreColor === 'yellow' ? 'border-yellow-200 bg-yellow-100' : 'border-red-200 bg-red-100'}`}>
                            <span className={`text-sm font-bold uppercase tracking-wider mb-1
                                ${scoreColor === 'green' ? 'text-green-800' : scoreColor === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                                Bağımlılık Skoru
                            </span>
                            <div className="text-6xl font-extrabold text-slate-800">{score}<span className="text-2xl text-gray-500 font-normal">/10</span></div>
                            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border
                                ${scoreColor === 'green' ? 'bg-green-200 text-green-800 border-green-300' :
                                    scoreColor === 'yellow' ? 'bg-yellow-200 text-yellow-800 border-yellow-300' : 'bg-red-200 text-red-800 border-red-300'}`}>
                                {dependence}
                            </span>
                        </div>

                        {/* Clinical Context */}
                        <div className="p-6 flex-grow">
                            <h4 className={`font-bold text-lg mb-2 flex items-center
                                ${scoreColor === 'green' ? 'text-green-900' : scoreColor === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
                                <span className="mr-2 text-xl">🩺</span> Klinik Yorum
                            </h4>
                            <p className="text-slate-700 leading-relaxed mb-4">{interpretation}</p>

                            {/* Visual Meter */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                                    <span>Düşük (0-2)</span>
                                    <span>Orta (3-7)</span>
                                    <span>Yüksek (8-10)</span>
                                </div>
                                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-green-400 w-[20%]"></div>
                                    <div className="h-full bg-yellow-400 w-[50%]"></div>
                                    <div className="h-full bg-red-500 w-[30%]"></div>
                                </div>
                                {/* Indicator Triangle */}
                                <div className="relative h-4 w-full">
                                    <div className="absolute top-0 transform -translate-x-1/2 transition-all duration-500" style={{ left: `${(score / 10) * 100}%` }}>
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Advice */}
                <div className="md:col-span-6 space-y-4 mt-2">
                    <div className="bg-white p-4 rounded-lg border-l-4 border-teal-500 shadow-sm">
                        <h4 className="font-bold text-teal-900 mb-2">📢 Hekim Önerisi (ADVISE)</h4>
                        <p className="text-slate-700 italic">"{doctorAdvice}"</p>
                    </div>
                </div>

                {/* Readiness Selection */}
                <div className="md:col-span-6 flex flex-col justify-center space-y-3 mt-2">
                    <h4 className="font-bold text-slate-700 text-sm uppercase">Hasta Bırakmaya Hazır mı?</h4>
                    <button onClick={() => onSetIsReady(true)}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isReady === true ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'}`}>
                        <div>
                            <span className="font-bold text-green-700 block group-hover:translate-x-1 transition-transform">EVET, Denemek İstiyorum</span>
                            <span className="text-xs text-green-600">5A Modeline Devam Et (Planlama)</span>
                        </div>
                        <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">👍</span>
                    </button>
                    <button onClick={() => onSetIsReady(false)}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${isReady === false ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'}`}>
                        <div>
                            <span className="font-bold text-red-700 block group-hover:translate-x-1 transition-transform">HAYIR, Hazır Değilim</span>
                            <span className="text-xs text-red-600">5R Modeline Geçiş Yap (Motivasyon)</span>
                        </div>
                        <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">👎</span>
                    </button>
                </div>
            </div>
            <div className="flex justify-end mt-8">
                {isReady !== null && (
                    <Button onClick={onProceed}>
                        {isReady ? '4. Adım: ASSIST (Yardım) →' : '5R Modeline Git →'}
                    </Button>
                )}
            </div>
        </Wrapper>
    );
};

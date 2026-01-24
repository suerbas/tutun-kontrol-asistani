
import React from 'react';
import { AppScreen } from '../types';

interface MainMenuProps {
    onNavigate: (screen: AppScreen) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 text-center">
                Tütün Kontrolü ve Bırakma Asistanı
            </h1>
            <p className="text-slate-500 mb-8 text-center max-w-xl">
                Sağlık çalışanları için hazırlanmış eğitim ve klinik takip destek sistemi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {/* Eğitim Modülü Kartı */}
                <button
                    onClick={() => onNavigate(AppScreen.Education)}
                    className="group relative overflow-hidden rounded-2xl bg-pastel-blue p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border border-blue-100 h-64 flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-blue-200 opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
                    <div>
                        <h2 className="text-xl font-bold text-blue-900 mb-2">
                            TÜTÜN KONTROLÜ VE EĞİTİMİ
                        </h2>
                        <p className="text-blue-800 text-opacity-80 text-sm">
                            Tütünün zararları, bağımlılık fizyolojisi, farmakolojik tedaviler ve danışmanlık teknikleri hakkında kapsamlı teorik bilgi.
                        </p>
                    </div>
                    <div className="flex items-center text-blue-700 font-semibold mt-4 text-sm">
                        Eğitime Başla 
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Klinik Modül Kartı */}
                <button
                    onClick={() => onNavigate(AppScreen.PatientList)}
                    className="group relative overflow-hidden rounded-2xl bg-pastel-green p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border border-green-100 h-64 flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-green-200 opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
                    <div>
                        <h2 className="text-xl font-bold text-green-900 mb-2">
                            SİGARAYI BIRAKTIRMA MODÜLÜ
                        </h2>
                        <p className="text-green-800 text-opacity-80 text-sm">
                            Danışan takibi, Fagerström testi, 5A/5R modelleri ile adım adım klinik müdahale ve tedavi planlama sihirbazı.
                        </p>
                    </div>
                    <div className="flex items-center text-green-700 font-semibold mt-4 text-sm">
                        Modüle Git
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Psikososyal Destek Modülü Kartı (YENİ) */}
                <button
                    onClick={() => onNavigate(AppScreen.Psychosocial)}
                    className="group relative overflow-hidden rounded-2xl bg-purple-50 p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border border-purple-100 h-64 flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-purple-200 opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
                    <div>
                        <h2 className="text-xl font-bold text-purple-900 mb-2">
                            MOTİVASYONEL GÖRÜŞME & BDT
                        </h2>
                        <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mb-2 font-bold">Özel Gruplar (Gebe/Ergen)</span>
                        <p className="text-purple-800 text-opacity-80 text-sm">
                            Bilişsel Davranışçı Terapi ve Motivasyonel Görüşme teknikleriyle adım adım rehberli psikososyal destek modülü.
                        </p>
                    </div>
                    <div className="flex items-center text-purple-700 font-semibold mt-4 text-sm">
                        Görüşmeye Başla
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

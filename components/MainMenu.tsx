
import React from 'react';
import { AppScreen } from '../types';

interface MainMenuProps {
    onNavigate: (screen: AppScreen) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-[90vh]">
            {/* Hero Section - Floating icon removed since it's now in header */}
            <div className="welcome-hero py-12 px-4 text-center relative">
                <div className="max-w-4xl mx-auto relative z-10">

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight animate-slideUp">
                        Tütün Kontrolü ve
                        <span className="block bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                            Bırakma Asistanı
                        </span>
                    </h1>

                    <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        Sağlık çalışanları için hazırlanmış
                        <strong className="text-white"> kapsamlı eğitim</strong> ve
                        <strong className="text-white"> klinik takip</strong> destek sistemi
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                        <div className="glass rounded-xl px-5 py-3 text-white">
                            <div className="text-2xl font-bold">5A</div>
                            <div className="text-teal-200 text-sm">Klinik Model</div>
                        </div>
                        <div className="glass rounded-xl px-5 py-3 text-white">
                            <div className="text-2xl font-bold">BDT</div>
                            <div className="text-teal-200 text-sm">Araçları</div>
                        </div>
                        <div className="glass rounded-xl px-5 py-3 text-white">
                            <div className="text-2xl font-bold">MI</div>
                            <div className="text-teal-200 text-sm">Teknikleri</div>
                        </div>
                        <div className="glass rounded-xl px-5 py-3 text-white">
                            <div className="text-2xl font-bold">8+</div>
                            <div className="text-teal-200 text-sm">İlaç Protokolü</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Eğitim Modülü Kartı */}
                    <button
                        onClick={() => onNavigate(AppScreen.Education)}
                        className="hero-card group rounded-3xl p-8 text-left shadow-xl h-80 flex flex-col justify-between"
                    >
                        <div>
                            <div className="card-icon w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                                📚
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                Tütün Kontrolü Eğitimi
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Tütünün zararları, bağımlılık fizyolojisi, farmakolojik tedaviler ve danışmanlık teknikleri hakkında kapsamlı teorik bilgi.
                            </p>
                        </div>
                        <div className="flex items-center text-blue-600 font-bold group-hover:text-blue-700">
                            Eğitime Başla
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </button>

                    {/* Klinik Modül Kartı */}
                    <button
                        onClick={() => onNavigate(AppScreen.PatientList)}
                        className="hero-card group rounded-3xl p-8 text-left shadow-xl h-80 flex flex-col justify-between"
                    >
                        <div>
                            <div className="card-icon w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                                🩺
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                Sigarayı Bıraktırma
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">5A Model</span>
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">5R Model</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Fagerström</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Danışan takibi ve adım adım klinik müdahale sihirbazı ile tedavi planlama.
                            </p>
                        </div>
                        <div className="flex items-center text-emerald-600 font-bold group-hover:text-emerald-700">
                            Modüle Git
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </button>

                    {/* Psikososyal Destek Modülü Kartı */}
                    <button
                        onClick={() => onNavigate(AppScreen.Psychosocial)}
                        className="hero-card group rounded-3xl p-8 text-left shadow-xl h-80 flex flex-col justify-between md:col-span-2 lg:col-span-1"
                    >
                        <div>
                            <div className="card-icon w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                                🧠
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                Motivasyonel Görüşme & BDT
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Özel Gruplar</span>
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">Gebe/Ergen</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Bilişsel Davranışçı Terapi araçları ve adım adım rehberli psikososyal destek.
                            </p>
                        </div>
                        <div className="flex items-center text-purple-600 font-bold group-hover:text-purple-700">
                            Görüşmeye Başla
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center space-y-2">
                    <p className="text-slate-500 text-sm">
                        🏥 Sağlık Bakanlığı rehberleri ve güncel kanıta dayalı uygulamalar referans alınarak hazırlanmıştır.
                    </p>
                    <p className="text-slate-400 text-xs">
                        💻 En iyi deneyim için bilgisayar ekranında görüntülemeniz önerilir.
                    </p>
                </div>
            </div>
        </div>
    );
};

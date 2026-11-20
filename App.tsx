
import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { PatientList } from './components/PatientList';
import { EducationModule } from './components/EducationModule';
import { InterventionModule } from './components/InterventionModule';
import { PsychosocialModule } from './components/PsychosocialModule';
import { AppScreen, Patient } from './types';
import { Button } from './components/Button';

// Font size levels with numeric scale
const FONT_SIZE_LEVELS = [0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6];
const FONT_SIZE_KEY = 'tutun_font_level';
const DEFAULT_LEVEL = 2; // Index 2 = scale 1 (normal)

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Home);
    const [targetModule, setTargetModule] = useState<AppScreen | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [autoStartIntervention, setAutoStartIntervention] = useState(false);
    const [fontLevel, setFontLevel] = useState(DEFAULT_LEVEL);

    // Load font size preference from localStorage on mount
    useEffect(() => {
        const savedLevel = localStorage.getItem(FONT_SIZE_KEY);
        if (savedLevel !== null) {
            const level = parseInt(savedLevel);
            if (level >= 0 && level < FONT_SIZE_LEVELS.length) {
                setFontLevel(level);
                applyFontSize(level);
            }
        } else {
            applyFontSize(DEFAULT_LEVEL);
        }
    }, []);

    const applyFontSize = (level: number) => {
        const scale = FONT_SIZE_LEVELS[level];
        document.documentElement.style.setProperty('--font-scale', scale.toString());
        document.documentElement.style.fontSize = `${scale * 16}px`;
    };

    const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
        let newLevel = fontLevel;
        if (direction === 'increase' && fontLevel < FONT_SIZE_LEVELS.length - 1) {
            newLevel = fontLevel + 1;
        } else if (direction === 'decrease' && fontLevel > 0) {
            newLevel = fontLevel - 1;
        }
        setFontLevel(newLevel);
        applyFontSize(newLevel);
        localStorage.setItem(FONT_SIZE_KEY, newLevel.toString());
    };

    const resetFontSize = () => {
        setFontLevel(DEFAULT_LEVEL);
        applyFontSize(DEFAULT_LEVEL);
        localStorage.setItem(FONT_SIZE_KEY, DEFAULT_LEVEL.toString());
    };

    const handleNavigate = (screen: AppScreen) => {
        if (screen === AppScreen.Intervention || screen === AppScreen.Psychosocial) {
            setTargetModule(screen);
            setCurrentScreen(AppScreen.PatientList);
        } else {
            setTargetModule(null);
            setCurrentScreen(screen);
        }
    };

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        if (targetModule) {
            setCurrentScreen(targetModule);
        } else {
            setCurrentScreen(AppScreen.Intervention);
        }
    };

    const handleUpdatePatient = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case AppScreen.Home:
                return <MainMenu onNavigate={handleNavigate} />;

            case AppScreen.Education:
                return (
                    <div className="p-4">
                        <EducationModule />
                    </div>
                );

            case AppScreen.PatientList:
                return (
                    <div className="p-4">
                        <div className="max-w-4xl mx-auto mb-4">
                            {targetModule === AppScreen.Psychosocial && (
                                <div className="bg-purple-50 text-purple-800 p-3 rounded-lg text-base text-center font-medium border border-purple-100">
                                    Motivasyonel Görüşme için danışan seçiniz...
                                </div>
                            )}
                        </div>
                        <PatientList onSelectPatient={handlePatientSelect} />
                    </div>
                );

            case AppScreen.Intervention:
                if (!selectedPatient) return null;
                return (
                    <div className="p-4">
                        <InterventionModule
                            patient={selectedPatient}
                            autoStart={autoStartIntervention}
                            onUpdatePatient={handleUpdatePatient}
                            onBack={() => {
                                setSelectedPatient(null);
                                setTargetModule(null);
                                setAutoStartIntervention(false);
                                setCurrentScreen(AppScreen.PatientList);
                            }}
                            onSwitchToPsychosocial={() => {
                                setAutoStartIntervention(false);
                                setCurrentScreen(AppScreen.Psychosocial);
                            }}
                        />
                    </div>
                );

            case AppScreen.Psychosocial:
                if (!selectedPatient) return null;
                return (
                    <div className="p-4">
                        <PsychosocialModule
                            patient={selectedPatient}
                            onUpdatePatient={handleUpdatePatient}
                            onBack={() => {
                                setSelectedPatient(null);
                                setTargetModule(null);
                                setAutoStartIntervention(false);
                                setCurrentScreen(AppScreen.PatientList);
                            }}
                            onSwitchToIntervention={() => {
                                setAutoStartIntervention(true);
                                setTargetModule(AppScreen.Intervention);
                                setCurrentScreen(AppScreen.Intervention);
                            }}
                        />
                    </div>
                );

            default:
                return <MainMenu onNavigate={handleNavigate} />;
        }
    };

    const currentScale = FONT_SIZE_LEVELS[fontLevel];
    const scalePercent = Math.round(currentScale * 100);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and Title - Clickable to go home */}
                    <div
                        className="flex items-center cursor-pointer group"
                        onClick={() => setCurrentScreen(AppScreen.Home)}
                        title="Ana Sayfaya Dön"
                    >
                        {/* Lung Icon instead of T */}
                        <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-2xl mr-3 shadow-md group-hover:scale-105 transition-transform">
                            🫁
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-semibold text-slate-800 text-lg block leading-tight">Tütün Kontrol Asistanı</span>
                            <span className="text-xs text-teal-600 font-medium">🏠 Ana Sayfa</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Font Size Controls - Plus/Minus Style */}
                        <div className="font-size-controls" title="Yazı Boyutu Ayarı">
                            <button
                                className="font-ctrl-btn"
                                onClick={() => handleFontSizeChange('decrease')}
                                disabled={fontLevel === 0}
                                aria-label="Yazı boyutunu küçült"
                            >
                                <span className="text-lg font-bold">−</span>
                            </button>
                            <button
                                className="font-ctrl-display"
                                onClick={resetFontSize}
                                title="Varsayılana dön"
                            >
                                <span className="text-xs font-medium">{scalePercent}%</span>
                            </button>
                            <button
                                className="font-ctrl-btn"
                                onClick={() => handleFontSizeChange('increase')}
                                disabled={fontLevel === FONT_SIZE_LEVELS.length - 1}
                                aria-label="Yazı boyutunu büyüt"
                            >
                                <span className="text-lg font-bold">+</span>
                            </button>
                        </div>

                        {currentScreen !== AppScreen.Home && currentScreen !== AppScreen.PatientList && (
                            <Button
                                variant="secondary"
                                className="py-2 px-3 sm:px-4 flex items-center whitespace-nowrap"
                                onClick={() => {
                                    // Eğitim ekranından geri dönüş ana sayfaya gider; klinik ekranlardan danışan listesine.
                                    setSelectedPatient(null);
                                    setTargetModule(null);
                                    setCurrentScreen(currentScreen === AppScreen.Education ? AppScreen.Home : AppScreen.PatientList);
                                }}
                                aria-label={currentScreen === AppScreen.Education ? 'Ana sayfaya dön' : 'Danışan listesine dön'}
                            >
                                <span className="mr-1">←</span>
                                <span className="hidden sm:inline">{currentScreen === AppScreen.Education ? 'Ana Sayfa' : 'Danışan Listesi'}</span>
                                <span className="sm:hidden">Geri</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            <main>{renderScreen()}</main>
        </div>
    );
};

export default App;

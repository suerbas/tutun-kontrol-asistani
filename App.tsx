
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
                        <div className="max-w-5xl mx-auto mb-4">
                            <Button variant="secondary" onClick={() => setCurrentScreen(AppScreen.Home)}>← Ana Menü</Button>
                        </div>
                        <EducationModule />
                    </div>
                );

            case AppScreen.PatientList:
                return (
                    <div className="p-4">
                        <div className="max-w-4xl mx-auto mb-4">
                            <Button variant="secondary" onClick={() => setCurrentScreen(AppScreen.Home)}>← Ana Menü</Button>
                            {targetModule === AppScreen.Psychosocial && (
                                <div className="mt-2 bg-purple-50 text-purple-800 p-3 rounded-lg text-base text-center font-medium border border-purple-100">
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
                    <div className="flex items-center cursor-pointer" onClick={() => setCurrentScreen(AppScreen.Home)}>
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold mr-3 text-lg shadow-md">T</div>
                        <span className="font-semibold text-slate-800 hidden sm:block text-lg">Tütün Kontrol Asistanı</span>
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
                                className="py-2 px-4 flex items-center"
                                onClick={() => {
                                    setSelectedPatient(null);
                                    setTargetModule(null);
                                    setCurrentScreen(AppScreen.PatientList);
                                }}
                            >
                                <span className="mr-1">←</span> Danışan Listesi
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

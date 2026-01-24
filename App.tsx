
import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { PatientList } from './components/PatientList';
import { EducationModule } from './components/EducationModule';
import { InterventionModule } from './components/InterventionModule';
import { PsychosocialModule } from './components/PsychosocialModule';
import { AppScreen, Patient } from './types';
import { Button } from './components/Button';

type FontSize = 'small' | 'normal' | 'large';

const FONT_SIZE_KEY = 'tutun_font_size';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Home);
    const [targetModule, setTargetModule] = useState<AppScreen | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [autoStartIntervention, setAutoStartIntervention] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('normal');

    // Load font size preference from localStorage on mount
    useEffect(() => {
        const savedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize;
        if (savedFontSize && ['small', 'normal', 'large'].includes(savedFontSize)) {
            setFontSize(savedFontSize);
            applyFontSize(savedFontSize);
        } else {
            applyFontSize('normal');
        }
    }, []);

    const applyFontSize = (size: FontSize) => {
        const html = document.documentElement;
        html.classList.remove('font-small', 'font-normal', 'font-large');
        html.classList.add(`font-${size}`);
    };

    const handleFontSizeChange = (size: FontSize) => {
        setFontSize(size);
        applyFontSize(size);
        localStorage.setItem(FONT_SIZE_KEY, size);
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

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => setCurrentScreen(AppScreen.Home)}>
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 text-lg">T</div>
                        <span className="font-semibold text-slate-800 hidden sm:block text-lg">Tütün Kontrol Asistanı</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Font Size Selector */}
                        <div className="font-size-selector" title="Yazı Boyutu Ayarı">
                            <button
                                className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
                                onClick={() => handleFontSizeChange('small')}
                                aria-label="Küçük yazı boyutu"
                            >
                                <span style={{ fontSize: '12px' }}>A</span>
                            </button>
                            <button
                                className={`font-size-btn ${fontSize === 'normal' ? 'active' : ''}`}
                                onClick={() => handleFontSizeChange('normal')}
                                aria-label="Normal yazı boyutu"
                            >
                                <span style={{ fontSize: '16px' }}>A</span>
                            </button>
                            <button
                                className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
                                onClick={() => handleFontSizeChange('large')}
                                aria-label="Büyük yazı boyutu"
                            >
                                <span style={{ fontSize: '20px' }}>A</span>
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

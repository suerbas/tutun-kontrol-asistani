import React, { useState, useEffect } from 'react';
import { Patient, Visit, DependenceLevel, TreatmentStatus } from '../types';
import { BEHAVIORAL_GUIDE, PHARMACOLOGICAL_TREATMENTS, FIVE_R_DETAILS } from '../constants';
import { patientService } from '../services/patientService';

// Alt bileşenler
import {
    InterventionStep,
    DrugFollowUp,
    HomeworkCheck,
    FagerstromTest,
    SuccessScreen,
    Dashboard,
    AskStep,
    AssessReadyStep,
    AssistBehavioralStep,
    AssistMedStep
} from './intervention';

interface InterventionProps {
    patient: Patient;
    onBack: () => void;
    onUpdatePatient: (patient: Patient) => void;
    onSwitchToPsychosocial?: () => void;
    autoStart?: boolean;
}

export const InterventionModule: React.FC<InterventionProps> = ({ patient, onBack, onUpdatePatient, onSwitchToPsychosocial, autoStart }) => {
    // === STATE ===
    const [currentStep, setCurrentStep] = useState<InterventionStep>(
        patient.visits.length > 0 ? InterventionStep.Dashboard : InterventionStep.Ask
    );
    const [fagerstromAnswers, setFagerstromAnswers] = useState<number[]>(new Array(6).fill(-1));
    const [score, setScore] = useState(0);
    const [dependence, setDependence] = useState<DependenceLevel>(DependenceLevel.Low);
    const [isReady, setIsReady] = useState<boolean | null>(null);
    const [selectedTreatment, setSelectedTreatment] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
    const [activeRStep, setActiveRStep] = useState<number>(0);
    const [selectedRItems, setSelectedRItems] = useState<string[]>([]);

    // İlaç Takip State'leri
    const [adherence, setAdherence] = useState<'full' | 'partial' | 'none' | null>(null);
    const [smokingStatus, setSmokingStatus] = useState<'clean' | 'slipped' | null>(null);
    const [hasSideEffects, setHasSideEffects] = useState<boolean | null>(null);

    // === EFFECTS ===
    useEffect(() => {
        if (autoStart && currentStep === InterventionStep.Dashboard) {
            const activeHomeworkText = patient.psychosocialStatus?.homework || '';
            const isPassiveFollowUp = activeHomeworkText.includes('Ödevsiz Takip');
            const hasHomework = activeHomeworkText.length > 0 && !isPassiveFollowUp;
            if (hasHomework) {
                setCurrentStep(InterventionStep.Check_Homework);
            } else {
                setIsReady(true);
                setDependence(DependenceLevel.Medium);
                setCurrentStep(InterventionStep.Assist_Behav);
            }
        }
    }, [autoStart, currentStep, patient.psychosocialStatus?.homework]);

    // === HELPER FUNCTIONS ===
    const calculateScore = () => {
        const total = fagerstromAnswers.reduce((a, b) => a + (b === -1 ? 0 : b), 0);
        setScore(total);
        if (total <= 2) setDependence(DependenceLevel.Low);
        else if (total <= 7) setDependence(DependenceLevel.Medium);
        else setDependence(DependenceLevel.High);
    };

    const handleAnswer = (questionIndex: number, points: number) => {
        const newAnswers = [...fagerstromAnswers];
        newAnswers[questionIndex] = points;
        setFagerstromAnswers(newAnswers);
    };

    const toggleTrigger = (triggerId: string) => {
        if (selectedTriggers.includes(triggerId)) {
            setSelectedTriggers(selectedTriggers.filter(t => t !== triggerId));
        } else {
            setSelectedTriggers([...selectedTriggers, triggerId]);
        }
    };

    const toggleRItem = (itemId: string) => {
        if (selectedRItems.includes(itemId)) {
            setSelectedRItems(selectedRItems.filter(i => i !== itemId));
        } else {
            setSelectedRItems([...selectedRItems, itemId]);
        }
    };

    const saveVisit = () => {
        // İngilizce ID'leri Türkçe isimlere çevir
        const triggerNames = selectedTriggers.map(id => {
            const trigger = BEHAVIORAL_GUIDE.find(b => b.id === id);
            return trigger ? trigger.trigger : id;
        });
        const behavioralNotes = triggerNames.length > 0 ? `Tetikleyiciler: ${triggerNames.join(', ')}. ` : '';

        let fiveRNotes = '';
        if (!isReady && selectedRItems.length > 0) {
            const items = FIVE_R_DETAILS.flatMap(r => r.items).filter(i => selectedRItems.includes(i.id));
            fiveRNotes = `5R Bulguları: ${items.map(i => i.text).join(', ')}. `;
        }
        const visit: Visit = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            status: isReady ? TreatmentStatus.Active : TreatmentStatus.New,
            notes: `Fagerström: ${score} (${dependence}). ${isReady ? 'Bırakmaya hazır.' : 'Hazır değil (5R uygulandı).'} ${behavioralNotes} ${fiveRNotes}Tedavi: ${selectedTreatment}. Notlar: ${notes}`,
            treatmentType: selectedTreatment
        };
        let updatedPatient = { ...patient };
        if (selectedTreatment && selectedTreatment !== 'Sadece Davranışsal') {
            const drugInfo = PHARMACOLOGICAL_TREATMENTS.find(t => t.name === selectedTreatment);
            updatedPatient.activeTreatment = {
                drugName: selectedTreatment,
                commercialName: drugInfo?.commercialName,
                startDate: new Date().toLocaleDateString('tr-TR'),
                dosage: drugInfo?.dosage,
                isActive: true
            };
            updatedPatient.fagerstromScore = score;
        }
        updatedPatient.visits = [...updatedPatient.visits, visit];
        patientService.savePatient(updatedPatient);
        onUpdatePatient(updatedPatient);
        setCurrentStep(InterventionStep.Success);
    };

    // === RENDER STEPS ===

    // Success Screen
    if (currentStep === InterventionStep.Success) {
        return <SuccessScreen isReady={isReady} onBack={onBack} />;
    }

    // Drug Follow-Up
    if (currentStep === InterventionStep.Drug_Follow_Up) {
        return (
            <DrugFollowUp
                patient={patient}
                adherence={adherence}
                setAdherence={setAdherence}
                smokingStatus={smokingStatus}
                setSmokingStatus={setSmokingStatus}
                hasSideEffects={hasSideEffects}
                setHasSideEffects={setHasSideEffects}
                notes={notes}
                setNotes={setNotes}
                onBack={() => setCurrentStep(InterventionStep.Dashboard)}
                onComplete={() => setCurrentStep(InterventionStep.Success)}
                onSwitchToPsychosocial={onSwitchToPsychosocial}
            />
        );
    }

    // Homework Check
    if (currentStep === InterventionStep.Check_Homework) {
        return (
            <HomeworkCheck
                patient={patient}
                onProceedToTreatment={() => { setIsReady(true); setDependence(DependenceLevel.Medium); setCurrentStep(InterventionStep.Assist_Behav); }}
                onSwitchToPsychosocial={onSwitchToPsychosocial}
                onBack={() => setCurrentStep(InterventionStep.Dashboard)}
            />
        );
    }

    // Fagerstrom Test
    if (currentStep === InterventionStep.Assess_Test) {
        return (
            <FagerstromTest
                answers={fagerstromAnswers}
                onAnswer={handleAnswer}
                onBack={() => setCurrentStep(InterventionStep.Ask)}
                onComplete={() => { calculateScore(); setCurrentStep(InterventionStep.Assess_Ready); }}
            />
        );
    }

    // Dashboard
    if (currentStep === InterventionStep.Dashboard) {
        return (
            <Dashboard
                patient={patient}
                onBack={onBack}
                onSwitchToPsychosocial={onSwitchToPsychosocial}
                onSetCurrentStep={setCurrentStep}
                onSetIsReady={setIsReady}
                onSetDependence={setDependence}
            />
        );
    }

    // Ask Step
    if (currentStep === InterventionStep.Ask) {
        return (
            <AskStep
                patient={patient}
                isReady={isReady}
                onBack={onBack}
                onProceed={() => setCurrentStep(InterventionStep.Assess_Test)}
            />
        );
    }

    // Assess Ready Step
    if (currentStep === InterventionStep.Assess_Ready) {
        return (
            <AssessReadyStep
                patient={patient}
                score={score}
                dependence={dependence}
                isReady={isReady}
                onSetIsReady={setIsReady}
                onProceed={() => setCurrentStep(isReady ? InterventionStep.Assist_Behav : InterventionStep.Assist_Med)}
            />
        );
    }

    // Assist Behavioral Step
    if (currentStep === InterventionStep.Assist_Behav) {
        return (
            <AssistBehavioralStep
                isReady={isReady}
                selectedTriggers={selectedTriggers}
                onToggleTrigger={toggleTrigger}
                onBack={() => setCurrentStep(InterventionStep.Assess_Ready)}
                onProceed={() => setCurrentStep(InterventionStep.Assist_Med)}
            />
        );
    }

    // Assist Med Step (5R veya İlaç Seçimi)
    if (currentStep === InterventionStep.Assist_Med) {
        return (
            <AssistMedStep
                patient={patient}
                score={score}
                isReady={isReady}
                selectedTreatment={selectedTreatment}
                notes={notes}
                activeRStep={activeRStep}
                selectedRItems={selectedRItems}
                onSetSelectedTreatment={setSelectedTreatment}
                onSetNotes={setNotes}
                onSetActiveRStep={setActiveRStep}
                onToggleRItem={toggleRItem}
                onBack={() => setCurrentStep(InterventionStep.Assist_Behav)}
                onSaveVisit={saveVisit}
            />
        );
    }

    return null;
};

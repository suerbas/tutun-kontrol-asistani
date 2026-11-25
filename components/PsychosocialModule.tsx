import React, { useState, useEffect } from 'react';
import { Patient, Visit, TreatmentStatus, SpecialProfile, PsychosocialStatus, COMORBIDITIES } from '../types';
import { patientService } from '../services/patientService';
import { PsychosocialSetup, PsychosocialDashboard, PsychosocialInterview, FinishModal } from './psychosocial';

interface PsychosocialProps {
    patient: Patient;
    onBack: () => void;
    onUpdatePatient: (patient: Patient) => void;
    onSwitchToIntervention?: () => void;
}

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

export const PsychosocialModule: React.FC<PsychosocialProps> = ({ patient, onBack, onUpdatePatient, onSwitchToIntervention }) => {
    // Determine initial profile based on comorbidities and age
    const getInitialProfile = (): SpecialProfile => {
        if (patient.psychosocialStatus?.profile) return patient.psychosocialStatus.profile;
        if (patient.comorbidities.includes(COMORBIDITIES.PREGNANCY)) return SpecialProfile.Pregnant;
        if (patient.comorbidities.includes(COMORBIDITIES.COPD)) return SpecialProfile.COPD;
        if (patient.age < 18) return SpecialProfile.Under18;
        return SpecialProfile.General;
    };

    const initialProfile = getInitialProfile();

    const [view, setView] = useState<'SETUP' | 'DASHBOARD' | 'INTERVIEW'>(
        patient.psychosocialStatus ? 'DASHBOARD' : 'SETUP'
    );

    const [sessionState, setSessionState] = useState<SessionState>({
        patientName: patient.code,
        profile: initialProfile,
        motivation: patient.psychosocialStatus?.motivation || '',
        currentStepId: '',
        history: [],
        homework: patient.psychosocialStatus?.homework || '',
        notes: []
    });

    const [showFinishModal, setShowFinishModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (!patient.psychosocialStatus) {
            setSessionState(prev => ({ ...prev, profile: getInitialProfile() }));
        }
    }, [patient]);

    const startSession = (profile: SpecialProfile, motivation: string, category: string | null, isFollowUp: boolean = false) => {
        let startStep = 'INTRO_GENERAL';

        if (isFollowUp) {
            const lastHomework = patient.psychosocialStatus?.homework || '';
            if (lastHomework.includes('Ödevsiz Takip')) {
                startStep = 'FOLLOWUP_PASSIVE';
            } else if (lastHomework.includes('Ters El')) {
                startStep = 'FOLLOWUP_CHECK_MECHANICAL';
            } else {
                startStep = 'FOLLOWUP_CHECK';
            }
        } else if (category === 'forced') {
            startStep = 'RESISTANCE_DIRECT';
        } else {
            if (profile === SpecialProfile.Pregnant) startStep = 'INTRO_PREGNANT';
            else if (profile === SpecialProfile.Under18) startStep = 'INTRO_UNDER18';
            else if (profile === SpecialProfile.COPD) startStep = 'INTRO_COPD';
        }

        setSelectedCategory(category);
        setSessionState(prev => ({
            ...prev,
            profile,
            motivation,
            currentStepId: startStep,
            history: [startStep],
            notes: isFollowUp ? [`${(patient.psychosocialStatus?.sessionCount || 0) + 1}. takip seansı başladı.`] : []
        }));
        setView('INTERVIEW');
    };

    const handleNextStep = (nextStepId: string, insight?: string, homework?: string) => {
        if (nextStepId === 'FINISH') {
            setSessionState(prev => ({
                ...prev,
                history: [...prev.history, 'FINISH'],
                notes: insight ? [...prev.notes, insight] : prev.notes,
                homework: homework || prev.homework
            }));
            setShowFinishModal(true);
            return;
        }

        let actualNextStep = nextStepId;

        if (nextStepId === 'CALCULATED_PATH') {
            const score = sessionState.selectedScore ?? 0;
            let pathDescription = '';

            if (score <= 3) {
                actualNextStep = 'RESISTANCE_ENTRY';
                pathDescription = 'Direnç Yolu (Düşük Hazır Oluş)';
            } else if (score <= 7) {
                actualNextStep = 'AMBIVALENCE_ENTRY';
                pathDescription = 'İkilem Yolu (Kararsızlık)';
            } else {
                actualNextStep = 'ACTION_PATH';
                pathDescription = 'Eylem Yolu (Yüksek Motivasyon)';
            }
            insight = `Hazır Oluş Puanı (${score}) analizi: ${pathDescription} seçildi.`;
        }

        setSessionState(prev => ({
            ...prev,
            currentStepId: actualNextStep,
            history: [...prev.history, actualNextStep],
            notes: insight ? [...prev.notes, insight] : prev.notes,
            homework: homework || prev.homework
        }));
    };

    const handleBack = () => {
        if (sessionState.history.length <= 1) return;
        const newHistory = [...sessionState.history];
        newHistory.pop();
        const prevStepId = newHistory[newHistory.length - 1];
        setSessionState(prev => ({
            ...prev,
            history: newHistory,
            currentStepId: prevStepId
        }));
    };

    const handleScoreSelect = (score: number) => {
        setSessionState(prev => ({ ...prev, selectedScore: score }));
        handleNextStep('SCALE_PROBE');
    };

    const handleFinish = (insight: string) => {
        handleNextStep('FINISH', insight);
    };

    const saveAndExit = () => {
        const currentScore = sessionState.selectedScore;
        let stage: 'Resistance' | 'Ambivalence' | 'Action' | undefined;

        if (currentScore !== undefined) {
            if (currentScore <= 3) stage = 'Resistance';
            else if (currentScore <= 7) stage = 'Ambivalence';
            else stage = 'Action';
        }

        if (!stage) {
            const historyStr = sessionState.history.join(',');
            if (historyStr.includes('RESISTANCE') || historyStr.includes('HOMEWORK_OBSERVE') || historyStr.includes('PASSIVE_FOLLOWUP')) {
                stage = 'Resistance';
            } else if (historyStr.includes('AMBIVALENCE')) {
                stage = 'Ambivalence';
            } else if (historyStr.includes('ACTION') || historyStr.includes('CBT')) {
                stage = 'Action';
            }
        }

        if (!stage && patient.psychosocialStatus?.lastStage) {
            stage = patient.psychosocialStatus.lastStage;
        }

        if (!stage && sessionState.homework) {
            stage = 'Resistance';
        }

        let finalHomework = sessionState.homework;
        if (!finalHomework && sessionState.history.includes('HOMEWORK_OBSERVE')) {
            finalHomework = "Gözlem Ödevi: Sigara isteği ile davranışı ayırt etme.";
        }
        if (!finalHomework && sessionState.history.includes('PASSIVE_FOLLOWUP')) {
            finalHomework = "Ödevsiz Takip: Sigara konusunu açmadan rutin kontrol.";
        }

        // Clinical Memory
        const pastTriggers = new Set<string>();
        const pastHomeworks: string[] = [];
        patient.visits.forEach(v => {
            if (v.notes.includes('Tetikleyiciler:')) {
                const match = v.notes.match(/Tetikleyiciler: ([^|.]*)/);
                if (match && match[1]) {
                    match[1].split(',').forEach(t => pastTriggers.add(t.trim()));
                }
            }
            if (v.notes.includes('Verilen Ödev:')) {
                const match = v.notes.match(/Verilen Ödev: (.*)/);
                if (match && match[1] && match[1].trim() !== 'Yok') {
                    pastHomeworks.push(match[1].trim());
                }
            }
        });

        sessionState.history.forEach(stepId => {
            if (stepId.includes('CBT_SOLUTION_STRESS')) pastTriggers.add('Stres');
            if (stepId.includes('CBT_SOLUTION_COFFEE')) pastTriggers.add('Kahve');
            if (stepId.includes('CBT_SOLUTION_MEAL')) pastTriggers.add('Yemek Sonrası');
            if (stepId.includes('CBT_SOLUTION_SOCIAL')) pastTriggers.add('Sosyal Ortam');
            if (stepId.includes('CBT_SOLUTION_BOREDOM')) pastTriggers.add('Can Sıkıntısı');
            if (stepId.includes('CBT_SOLUTION_DRIVE')) pastTriggers.add('Araba Kullanırken');
        });

        // Evre Türkçeye çevir
        const stageTr = stage === 'Resistance' ? 'Direnç' : stage === 'Ambivalence' ? 'İkilem' : stage === 'Action' ? 'Eylem' : 'Belirsiz';
        const prevStageTr = patient.psychosocialStatus?.lastStage === 'Resistance' ? 'Direnç' :
            patient.psychosocialStatus?.lastStage === 'Ambivalence' ? 'İkilem' :
                patient.psychosocialStatus?.lastStage === 'Action' ? 'Eylem' : null;

        // Özet not oluştur (tek satır, okunabilir format)
        const triggersText = pastTriggers.size > 0 ? Array.from(pastTriggers).join(', ') : '';
        const progressText = prevStageTr ? `${prevStageTr} → ${stageTr}` : stageTr;

        // Ana notları birleştir
        const mainNotes = sessionState.notes.length > 0
            ? sessionState.notes.join(' | ')
            : 'Rutin motivasyonel görüşme yapıldı.';

        // Kısa ve öz visit notu
        let visitNote = `Seans #${(patient.psychosocialStatus?.sessionCount || 0) + 1}`;
        visitNote += ` | Evre: ${progressText}`;
        if (currentScore !== undefined) visitNote += ` | Skor: ${currentScore}/10`;
        visitNote += ` | ${mainNotes}`;
        if (triggersText) visitNote += ` | Tetikleyiciler: ${triggersText}`;
        if (finalHomework && finalHomework !== 'Yok') visitNote += ` | Ödev: ${finalHomework}`;

        const newPsychosocialStatus: PsychosocialStatus = {
            profile: sessionState.profile,
            motivation: sessionState.motivation,
            lastStage: stage || 'Resistance',
            lastScore: currentScore ?? patient.psychosocialStatus?.lastScore,
            homework: finalHomework,
            sessionCount: (patient.psychosocialStatus?.sessionCount || 0) + 1,
            isQuitting: false,
            // BDT düşünce kayıtları seans kaydıyla silinmesin
            thoughtRecords: patient.psychosocialStatus?.thoughtRecords
        };

        const visit: Visit = {

            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            status: TreatmentStatus.Active,
            treatmentType: 'Motivasyonel Görüşme',
            notes: visitNote,
            sessionDuration: 'Tam Seans'
        };

        const updatedPatient: Patient = {
            ...patient,
            psychosocialStatus: newPsychosocialStatus,
            visits: [...patient.visits, visit]
        };

        patientService.savePatient(updatedPatient);
        onUpdatePatient(updatedPatient);
        onBack();
    };

    // --- VIEW ROUTING ---
    if (view === 'DASHBOARD' && patient.psychosocialStatus) {
        return (
            <PsychosocialDashboard
                patient={patient}
                status={patient.psychosocialStatus}
                onStartFollowUp={() => startSession(sessionState.profile, sessionState.motivation, null, true)}
                onSwitchToIntervention={onSwitchToIntervention}
                onUpdateProfile={() => setView('SETUP')}
                onBack={onBack}
                onUpdatePatient={onUpdatePatient}
            />
        );
    }

    if (view === 'SETUP') {
        return (
            <PsychosocialSetup
                patient={patient}
                initialProfile={initialProfile}
                initialMotivation={patient.psychosocialStatus?.motivation || ''}
                hasPsychosocialStatus={!!patient.psychosocialStatus}
                onCancel={patient.psychosocialStatus ? () => setView('DASHBOARD') : onBack}
                onStart={(profile, motivation, category) => startSession(profile, motivation, category, false)}
            />
        );
    }

    // INTERVIEW view
    return (
        <>
            <PsychosocialInterview
                sessionState={sessionState}
                onNextStep={handleNextStep}
                onBack={handleBack}
                onScoreSelect={handleScoreSelect}
                onSwitchToIntervention={onSwitchToIntervention}
                onFinish={handleFinish}
            />
            <FinishModal
                isVisible={showFinishModal}
                homework={sessionState.homework}
                score={sessionState.selectedScore}
                onCancel={() => setShowFinishModal(false)}
                onSave={saveAndExit}
            />
        </>
    );
};

// Intervention Module Types
export enum InterventionStep {
    Dashboard = -1,
    Ask = 0,
    Assess_Test = 1,
    Assess_Ready = 2,
    Assist_Behav = 3,
    Assist_Med = 4,
    Success = 5,
    Check_Homework = 6,
    Drug_Follow_Up = 7
}

export interface InterventionState {
    currentStep: InterventionStep;
    fagerstromAnswers: number[];
    score: number;
    isReady: boolean | null;
    selectedTreatment: string;
    notes: string;
    selectedTriggers: string[];
    adherence: 'full' | 'partial' | 'none' | null;
    smokingStatus: 'clean' | 'slipped' | null;
    hasSideEffects: boolean | null;
    showReportModal: boolean;
    activeRStep: number;
    selectedRItems: string[];
}

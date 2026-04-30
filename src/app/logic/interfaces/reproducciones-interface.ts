export interface ButtonClicksDTO {
    previous: number;
    next: number;
    complete: number;
    exit: number;
}

export interface StepTrackingDTO {
    stepIndex: number;
    text: string;
    viewCount: number;
    timeActive: string;
}

export interface ReproductionDetailDTO {
    id: number;
    sequenceTitle: string;
    studentName: string;
    categoryName: string;
    status: 'COMPLETADA' | 'ABANDONADA' | 'IN_PROGRESS';
    startedAt: string;
    endedAt: string;
    duration: string;
    buttonClicks: ButtonClicksDTO;
    steps: StepTrackingDTO[];
}
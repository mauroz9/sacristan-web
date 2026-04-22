// Response DTOs
export interface DailyExpectedSequencesDto {
    date: string;
    expected: number;
    completed: number;
}

export interface MostUsedSequencesDto {
    id: number;
    title: string;
    reproductions: number;
}

export interface LatestReproductionsDto {
    studentName: string;
    sequenceTitle: string;
    endedAt: string;
}

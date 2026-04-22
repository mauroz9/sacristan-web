export interface StudentListResponse {
    id: number;
    name: string;
    lastName: string;
    sequencesCount: number;
    routinesCount: number;
    kind: 'student';
}

export interface SequenceResponse {
    id: number;
    title: string;
    category: string | null;
}

export interface RoutineResponse {
    id: number;
    name: string;
    category: string | null;
}

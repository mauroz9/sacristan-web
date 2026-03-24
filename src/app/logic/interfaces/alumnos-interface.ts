export interface ReadStudentResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
}

export interface StudentListResponse {
    id: number;
    name: string;
    lastName: string;
    sequencesCount: number;
    routinesCount: number;
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

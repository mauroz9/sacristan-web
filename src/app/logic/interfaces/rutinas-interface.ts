// Response DTOs
export interface RoutineDetailResponse {
    id: number;
    name: string;
    category: string | null;
    daysOfTheWeek: Set<string>;
    sequences: RoutineSegmentResponse[];
}

export interface RoutineListResponse {
    id: number;
    name: string;
    category: string | null;
    daysOfTheWeek: Set<string>;
    sequenceCount: number;
}

export interface RoutineSegmentResponse {
    id: number;
    sequenceId: number | null;
    sequenceTitle: string | null;
    startTime: string;
    endTime: string;
}

// Request DTOs
export interface CreateRoutineSegmentRequest {
    sequenceId: number;
    startTime: string;
    endTime: string;
}

export interface CreateRoutineRequest {
    name: string;
    categoryId: number;
    daysOfTheWeek: Set<string>;
    sequences: CreateRoutineSegmentRequest[];
}

export interface UpdateRoutineSegmentRequest {
    routineSegmentId: number;
    sequenceId: number;
    startTime: string;
    endTime: string;
}

export interface UpdateRoutineRequest {
    name: string;
    categoryId: number;
    daysOfTheWeek: Set<string>;
    sequences: UpdateRoutineSegmentRequest[];
}

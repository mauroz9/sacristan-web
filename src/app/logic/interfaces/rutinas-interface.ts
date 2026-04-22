// Response DTOs
export interface RoutineDetailResponse {
    id: number;
    name: string;
    category: CategoryDetailResponse
    daysOfTheWeek: string[];
    sequences: RoutineSegmentResponse[];
}

export interface RoutineListResponse {
    id: number;
    name: string;
    category: CategoryDetailResponse;
    daysOfTheWeek: string[];
    sequenceCount: number;
    kind: 'routine';
}

export interface CategoryDetailResponse {
    id: number;
    name: string;
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
    daysOfTheWeek: string[];
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
    daysOfTheWeek: string[];
    sequences: UpdateRoutineSegmentRequest[];
}

// Response DTOs
export interface SequenceDetailResponse {
    id: number;
    title: string;
    description: string;
    category: CategoryResponse | null;
    estimatedDuration: string | null;
    allowGoBack: boolean;
    frontPage: number | null;
    steps: StepResponse[];
}

export interface SequenceListResponse {
    id: number;
    title: string;
    description: string;
    category: string | null;
    stepCount: number;
    kind: 'sequence';
}

export interface StepResponse {
    id: number;
    name: string;
    position: number;
    estimatedDuration: string | null;
    arasaacPictogramId: number;
}

// Request DTOs - Steps
export interface CreateStepRequest {
    name: string;
    position: number;
    estimatedDuration: string | null;
    arasaacPictogramId: number;
}

export interface UpdateStepRequest {
    name: string;
    position: number;
    estimatedDuration: string | null;
    arasaacPictogramId: number;
}

// Request DTOs - Sequences
export interface CreateSequenceRequest {
    title: string;
    description: string;
    categoryId: number;
    estimatedDuration: string | null;
    allowGoBack: boolean;
    frontPage: number | null;
    steps: CreateStepRequest[];
}

export interface UpdateSequenceRequest {
    title: string;
    description: string;
    categoryId: number;
    estimatedDuration: string | null;
    allowGoBack: boolean;
    frontPage: number | null;
    steps: UpdateStepRequest[];
}

export interface CategoryResponse {
    id: number;
    name: string;
}

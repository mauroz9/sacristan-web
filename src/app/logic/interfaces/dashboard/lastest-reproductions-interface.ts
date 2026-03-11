export interface LastestReproduction {
    studentName: string;
    sequenceTitle: string;
    endedAt: string;
}

export interface LastestReproductionsResponse {
    content: LastestReproduction[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}
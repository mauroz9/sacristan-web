export interface MostUsedSequence {
    id: number;
    title: string;
    reproductions: number;
}

export interface MostUsedSequencesResponse {
    content: MostUsedSequence[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}
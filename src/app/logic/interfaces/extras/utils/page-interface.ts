export interface Page<T> {
    content: T[],
    page: PageParams
}

export interface PageParams {
    number: number,
    size: number,
    totalElements: number,
    totalPages: number
}
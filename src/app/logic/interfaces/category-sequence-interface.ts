export interface Category {
  id: number;
  name: string;
}

export interface CategoryResponse {
  content: Category[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

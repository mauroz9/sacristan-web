import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryResponse } from '../interfaces/category-sequence-interface';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root',
})
export class CategorySequenceService {
  
  constructor (private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(API_URL + '/api/v1/categories');
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(API_URL + `/api/v1/categories/${id}`);
  }
}

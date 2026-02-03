import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category-sequence-interface';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root',
})
export class CategorySequenceService {
  
  constructor (private http: HttpClient) {}

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(API_URL + '/api/categories');
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(API_URL + `/api/categories/${id}`);
  }
}

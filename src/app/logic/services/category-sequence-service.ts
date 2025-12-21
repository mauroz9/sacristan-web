import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category-sequence-interface';

@Injectable({
  providedIn: 'root',
})
export class CategorySequenceService {
  
  constructor (private http: HttpClient) {}

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>('http://localhost:8000/api/categorias');
  }

  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(`http://localhost:8000/api/categorias/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './env';
import { Sequence } from '../interfaces/sequence-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentSequenceService {

  constructor(private http: HttpClient) {}

  getStudentSequences(studentId:  number): Observable<Sequence[]> {
    return this.http.get<Sequence[]>(`${API_URL}/api/estudiantes/${studentId}/secuencias`);
  }

  getAvailableSequences(studentId:  number): Observable<Sequence[]> {
    return this.http.get<Sequence[]>(`${API_URL}/api/estudiantes/${studentId}/secuencias-disponibles`);
  }

  assignSequence(studentId: number, sequenceId: number): Observable<any> {
    return this.http.post(`${API_URL}/api/estudiantes/${studentId}/secuencias/${sequenceId}`, {});
  }

  unassignSequence(studentId: number, sequenceId: number): Observable<any> {
    return this.http.delete(`${API_URL}/api/estudiantes/${studentId}/secuencias/${sequenceId}`);
  }
}
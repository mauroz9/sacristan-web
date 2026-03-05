import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './env';
import { RoutineList } from '../interfaces/routine-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentRoutineService {

  constructor(private http: HttpClient) {}

  getStudentRoutines(studentId: number): Observable<RoutineList[]> {
    return this.http.get<RoutineList[]>(`${API_URL}/api/v1/admin/students/${studentId}/routines`);
  }

  // getStudentRoutineCount(studentId: number): Observable<number> {
  //   return this.http.get<number>(`${API_URL}/api/v1/admin/students/${studentId}/routine-count`);
  // }

  getAvailableRoutines(studentId: number): Observable<RoutineList[]> {
    return this.http.get<RoutineList[]>(`${API_URL}/api/v1/admin/students/${studentId}/routines-available`);
  }

  assignRoutine(studentId: number, routineId: number): Observable<any> {
    return this.http.post(`${API_URL}/api/v1/admin/students/${studentId}/routines/${routineId}`, {});
  }

  unassignRoutine(studentId: number, routineId: number): Observable<any> {
    return this.http.delete(`${API_URL}/api/v1/admin/students/${studentId}/routines/${routineId}`);
    }
  }
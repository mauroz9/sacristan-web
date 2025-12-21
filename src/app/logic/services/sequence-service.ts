import { Injectable } from '@angular/core';
import { Sequence } from '../interfaces/sequence-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {

  constructor (private http: HttpClient) {}

  getSequences(): Observable<Sequence[]>{
    return this.http.get<Sequence[]>('/api/secuencias');
  }

  getSequenceById(id: number): Observable<Sequence> {
    return this.http.get<Sequence>(API_URL + `/api/secuencias/${id}`);
  }

  addSequence(newSequence: Sequence): Observable<any>{
    return this.http.post(API_URL + '/api/secuencias', newSequence);
  }

  modifySequence(modifySequence: Sequence): Observable<any>{
    return this.http.put(API_URL + `/api/secuencias/${modifySequence.id}`, modifySequence);
  }

  deleteSequence(id: number): Observable<any>{
    return this.http.delete(API_URL + `/api/secuencias/${id}`)
  }
}

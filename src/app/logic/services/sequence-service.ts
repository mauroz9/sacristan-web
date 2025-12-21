import { Injectable } from '@angular/core';
import { Sequence } from '../interfaces/sequence-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {

  constructor (private http: HttpClient) {}

  getSequences(): Observable<Sequence[]>{
    return this.http.get<Sequence[]>('http://localhost:8000/api/secuencias');
  }

  getSequenceById(id: number): Observable<Sequence> {
    return this.http.get<Sequence>(`http://localhost:8000/api/secuencias/${id}`);
  }

  addSequence(newSequence: Sequence){
    this.http.post('http://localhost:8000/api/secuencias', newSequence);
  }

  modifySequence(modifySequence: Sequence){
    
    this.http.put( `http://localhost:8000/api/secuencias/${modifySequence.id}`, modifySequence);
  }

  deleteSequence(id: number){
    this.http.delete(`http://localhost:8000/api/secuencias/${id}`)
  }
}

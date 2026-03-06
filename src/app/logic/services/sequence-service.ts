import { Injectable } from '@angular/core';
import { Sequence, SequenceRequest } from '../interfaces/sequence-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './env';
import { PageResponse } from '../interfaces/utils/page-interface';
import { SortParam } from '../interfaces/content-interface';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {

  constructor (private http: HttpClient) {}

  getSequences({
    query = "",
    sortBy = "title",
    sortDir = "asc",
    page = 0
  }: GetParams = {}): Observable<PageResponse<Sequence>>{
    return this.http.get<PageResponse<Sequence>>(API_URL + `/api/v1/sequences?q=${query}&sort=${sortBy},${sortDir}&page=${page}`);
  }

  getSequenceById(id: number): Observable<Sequence> {
    return this.http.get<Sequence>(API_URL + `/api/v1/sequences/${id}`);
  }

  addSequence(newSequence: SequenceRequest): Observable<any>{
    return this.http.post(API_URL + '/api/v1/sequences', newSequence);
  }

  modifySequence(sequenceId: number, modifySequence: SequenceRequest): Observable<any>{
    return this.http.put(API_URL + `/api/v1/sequences/${sequenceId}`, modifySequence);
  }

  deleteSequence(id: number): Observable<any>{
    return this.http.delete(API_URL + `/api/v1/sequences/${id}`);
  }

  duplicateSequence(id: number): Observable<any> {
    return this.http.post(API_URL + `/api/v1/sequences/${id}/duplicate`, {});
  }

  getSortParams(): Observable<SortParam[]> {
    return this.http.get<SortParam[]>(API_URL + `/api/v1/sequences/sort-params`);
  }
}

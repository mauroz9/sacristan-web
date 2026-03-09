import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Routine, RoutineRequest } from '../interfaces/routine-interface';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/utils/page-interface';
import { API_URL } from './env';
import { SortParam } from '../interfaces/content-interface';


@Injectable({
    providedIn: 'root',
})
export class RoutineService {

    constructor(private http: HttpClient) { }

    getRoutines({
        query = "",
        sortBy = "name",
        sortDir = "asc",
        page = 0
    }: GetParams = {}): Observable<PageResponse<Routine>> {
        return this.http.get<PageResponse<Routine>>(API_URL + `/api/v1/routines?q=${query}&sort=${sortBy},${sortDir}&page=${page}`);
    }

    getRoutineById(id: number): Observable<Routine> {
        return this.http.get<Routine>(API_URL + `/api/v1/routines/${id}`);
    }

    deleteRoutine(id: number): Observable<any> {
        return this.http.delete(API_URL + `/api/v1/routines/${id}`);
    }

    addRoutine(routine: RoutineRequest): Observable<RoutineRequest> {
        return this.http.post<RoutineRequest>(API_URL + '/api/v1/routines', routine);
    }

    modifyRoutine(id: number, routine: RoutineRequest): Observable<RoutineRequest> {
        return this.http.put<RoutineRequest>(API_URL + `/api/v1/routines/${id}`, routine);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(API_URL + `/api/v1/routines/sort-params`);
    }

}

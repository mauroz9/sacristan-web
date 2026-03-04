import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Routine } from '../interfaces/routine-interface';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/utils/page-interface';
import { API_URL } from './env';
import { SortParam } from '../interfaces/content-interface';


@Injectable({
    providedIn: 'root',
})
export class RoutineService {

    constructor(private http: HttpClient) { }

    getRoutines(query: string = "", sortBy: string = "name", sortDir: string = "asc"): Observable<PageResponse<Routine>> {
        return this.http.get<PageResponse<Routine>>(API_URL + `/api/v1/routines?q=${query}&sort=${sortBy},${sortDir}`);
    }

    getRoutineById(id: number): Observable<Routine> {
        return this.http.get<Routine>(API_URL + `/api/v1/routines/${id}`);
    }

    deleteRoutine(id: number): Observable<any> {
        return this.http.delete(API_URL + `/api/v1/routines/${id}`);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(API_URL + `/api/v1/routines/sort-params`);
    }

}

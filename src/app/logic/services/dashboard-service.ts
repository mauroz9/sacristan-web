import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyExpectedCompletedSequence } from '../interfaces/dashboard/daily-expected-completed-sequences-interface';
import { MostUsedSequencesResponse } from '../interfaces/dashboard/most-used-sequences-interface';
import { LastestReproduction, LastestReproductionsResponse } from '../interfaces/dashboard/lastest-reproductions-interface';
import { API_URL } from './env';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) { }

    getTotalSequences(): Observable<number> {
        return this.http.get<number>(API_URL + '/api/v1/admin/statistics/total-sequences');
    }

    getTotalStudents(): Observable<number> {
        return this.http.get<number>(API_URL + '/api/v1/admin/statistics/total-students');
    }

    getTotalTeachers(): Observable<number> {
        return this.http.get<number>(API_URL + '/api/v1/admin/statistics/total-teachers');
    }

    getCompletedSequencesToday(): Observable<number> {
        return this.http.get<number>(API_URL + '/api/v1/admin/statistics/completed-sequences');
    }

    getAverageCompletedSequences(): Observable<number> {
        return this.http.get<number>(API_URL + '/api/v1/admin/statistics/average-completed-sequences');
    }

    getDailyExpectedAndCompletedSequences(from: string, to: string): Observable<DailyExpectedCompletedSequence[]> {
        return this.http.get<DailyExpectedCompletedSequence[]>(API_URL + `/api/v1/admin/statistics/daily-sequences?from=${from}&to=${to}`);
    }

    getMostUsedSequences(): Observable<MostUsedSequencesResponse>{
        return this.http.get<MostUsedSequencesResponse>(API_URL + '/api/v1/admin/statistics/most-used-sequences');
    }

    getLastestReproductions(): Observable<LastestReproductionsResponse> {
        return this.http.get<LastestReproductionsResponse>(API_URL + '/api/v1/admin/statistics/lastest-reproductions');
    }

}
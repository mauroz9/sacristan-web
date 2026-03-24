import { Injectable } from "@angular/core";
import { API_URL } from "../env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    DailyExpectedSequencesDto,
    MostUsedSequencesDto,
    LatestReproductionsDto
} from "../interfaces/dashboard-interface";
import { Page } from "../interfaces/extras/utils/page-interface";


@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    private API_URL = API_URL + "/api/v1/admin/statistics";

    constructor(private http: HttpClient) {}

    // * TOTAL COUNTS
    countTotalSequences(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/total-sequences`);
    }

    countTotalStudents(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/total-students`);
    }

    countTotalTeachers(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/total-teachers`);
    }

    // * TODAY STATS
    countCompletedSequencesToday(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/completed-sequences`);
    }

    averageCompletedSequencesPerStudentToday(): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/average-completed-sequences`);
    }

    // * DAILY STATS
    getDailyExpectedAndCompleted(from: string, to: string): Observable<DailyExpectedSequencesDto[]> {
        return this.http.get<DailyExpectedSequencesDto[]>(`${this.API_URL}/daily-sequences?from=${from}&to=${to}`);
    }

    // * MOST USED SEQUENCES
    getMostUsedSequences(page: number = 0, size: number = 5): Observable<Page<MostUsedSequencesDto>> {
        return this.http.get<Page<MostUsedSequencesDto>>(`${this.API_URL}/most-used-sequences?page=${page}&size=${size}`);
    }

    // * LATEST REPRODUCTIONS
    getLatestReproductions(page: number = 0, size: number = 5): Observable<Page<LatestReproductionsDto>> {
        return this.http.get<Page<LatestReproductionsDto>>(`${this.API_URL}/latest-reproductions?page=${page}&size=${size}`);
    }

}

import { Injectable } from "@angular/core";
import { API_URL } from "../env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    RoutineDetailResponse,
    RoutineListResponse,
    CreateRoutineRequest,
    UpdateRoutineRequest
} from "../interfaces/rutinas-interface";
import { Page } from "../interfaces/extras/utils/page-interface";
import { SortParam } from "../interfaces/extras/content/content-interface";
import { QuerySortParameters } from "../interfaces/extras/utils/sort-params-interface";

@Injectable({
    providedIn: 'root',
})
export class RutinasService {

    private API_URL = API_URL + "/api/v1/admin/rutinas";

    constructor(private http: HttpClient) {}

    // * CRUD
    create(createRequest: CreateRoutineRequest): Observable<void> {
        return this.http.post<void>(this.API_URL, createRequest);
    }

    read(id: number): Observable<RoutineDetailResponse> {
        return this.http.get<RoutineDetailResponse>(`${this.API_URL}/${id}`);
    }

    update(id: number, updateRequest: UpdateRoutineRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, updateRequest);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    list({
        query = "",
        sortBy = "name",
        sortDir = "asc",
        page = 0
    }: QuerySortParameters = {}): Observable<Page<RoutineListResponse>> {
        return this.http.get<Page<RoutineListResponse>>(this.API_URL + "?q="+query+"&sort="+sortBy+","+sortDir+"&page="+page);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(`${this.API_URL}/sort-params`);
    }

}

import { Injectable } from "@angular/core";
import { API_URL } from "../env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    SequenceDetailResponse,
    SequenceListResponse,
    CreateSequenceRequest,
    UpdateSequenceRequest
} from "../interfaces/secuencias-interface";
import { Page } from "../interfaces/extras/utils/page-interface";
import { UserService } from "./extras/user-service";
import { SortParam } from "../interfaces/extras/content/content-interface";


@Injectable({
    providedIn: 'root',
})
export class SecuenciasService {

    private API_URL = API_URL + "/api/v1/admin/secuencias";

    constructor(private http: HttpClient, private userService: UserService) {}

    // * CRUD
    create(createRequest: CreateSequenceRequest): Observable<void> {
        return this.http.post<void>(this.API_URL, createRequest);
    }

    read(id: number): Observable<SequenceDetailResponse> {
        return this.http.get<SequenceDetailResponse>(`${this.API_URL}/${id}`);
    }

    update(id: number, updateRequest: UpdateSequenceRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, updateRequest);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    duplicate(id: number): Observable<SequenceDetailResponse> {
        return this.http.post<SequenceDetailResponse>(`${this.API_URL}/${id}/duplicate`, {});
    }

    // * LIST & SORT
    list({
        query = "",
        sortBy = "title",
        sortDir = "asc",
        page = 0
    }: QuerySortParameters = {}): Observable<Page<SequenceListResponse>> {
        return this.http.get<Page<SequenceListResponse>>(this.API_URL + "?q="+query+"&sort="+sortBy+","+sortDir+"&page="+page);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(`${this.API_URL}/sort-params`);
    }

}

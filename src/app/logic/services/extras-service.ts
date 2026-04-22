import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../env";
import { ReadUserResponse } from "../interfaces/extras/users-interface";
import { Page } from "../interfaces/extras/utils/page-interface";
import { ListCategoryResponse, ReadCategoryResponse } from "../interfaces/extras-interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ExtraService {
    getCategoryById(id: number): Observable<ReadCategoryResponse> {
        return this.http.get<ReadCategoryResponse>(`${this.API_URL}/categories/${id}`);
    }

    constructor(private http: HttpClient) {}

    API_URL = API_URL + "/api/v1/admin/extras";

    getUserById(id: number): Observable<ReadUserResponse> {
        return this.http.get<ReadUserResponse>(`${this.API_URL}/users/${id}`);
    }

    getCategories(): Observable<Page<ListCategoryResponse>> {
        return this.http.get<Page<ListCategoryResponse>>(`${this.API_URL}/categories`);
    }


}
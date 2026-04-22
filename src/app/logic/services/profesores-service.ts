import { Injectable } from "@angular/core";
import { API_URL } from "../env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    TeacherListResponse,
    AssignedStudentResponse,
    UnAssignedStudentResponse
} from "../interfaces/profesores-interface";
import { CreateUserRequest, ReadUserResponse, UpdateUserRequest } from "../interfaces/extras/users-interface";
import { SortParam } from "../interfaces/extras/content/content-interface";
import { Page } from "../interfaces/extras/utils/page-interface";
import { FormGroup } from "@angular/forms";
import { UserService } from "./extras/user-service";
import { QuerySortParameters } from "../interfaces/extras/utils/sort-params-interface";

@Injectable({
    providedIn: 'root',
})
export class ProfesoresService {

    private API_URL = API_URL + "/api/v1/admin/profesores";

    constructor(private http: HttpClient, private userService: UserService) {}

    create(createUser: CreateUserRequest): Observable<void> {
        return this.http.post<void>(this.API_URL, createUser);
    }

    read(id: number): Observable<ReadUserResponse> {
        return this.http.get<ReadUserResponse>(`${this.API_URL}/${id}`);
    }

    update(id: number, updateUser: UpdateUserRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, updateUser);
    }

    sendTeacher(formData: any): Observable<void> {
        let originalId = formData.id || null
        if(originalId){
            return this.update(originalId, this.userService.convertToUpdateUser(formData));
        } else {
            return this.create(this.userService.convertToCreateUser(formData));
        }
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    list({
        query = "",
        sortBy = "user.name",
        sortDir = "asc",
        page = 0
    }: QuerySortParameters = {}): Observable<Page<TeacherListResponse>> {
        return this.http.get<Page<TeacherListResponse>>(this.API_URL + "?q="+query+"&sort="+sortBy+","+sortDir+"&page="+page);
    }

    getStudentCount(id: number): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/${id}/student-count`);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(`${this.API_URL}/sort-params`);
    }
    assignStudentToTeacher(teacherId: number, studentId: number): Observable<AssignedStudentResponse> {
        return this.http.put<AssignedStudentResponse>(`${this.API_URL}/${teacherId}/students/${studentId}`, {});
    }

    unassignStudentFromTeacher(teacherId: number, studentId: number): Observable<UnAssignedStudentResponse> {
        return this.http.delete<UnAssignedStudentResponse>(`${this.API_URL}/${teacherId}/students/${studentId}`);
    }

    getStudentsWithoutTeacher(): Observable<UnAssignedStudentResponse[]> {
        return this.http.get<UnAssignedStudentResponse[]>(`${this.API_URL}/students/unassigned`);
    }

    getStudentsByTeacher(teacherId: number): Observable<AssignedStudentResponse[]> {
        return this.http.get<AssignedStudentResponse[]>(`${this.API_URL}/${teacherId}/students`);
    }

        handleFormErrors(errors: any, formGroup: FormGroup) {
        this.userService.handleFormErrors(errors, formGroup);
    }

}

import { Injectable } from "@angular/core";
import { Page } from "../interfaces/extras/utils/page-interface";
import { API_URL } from "../env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateUserRequest, UpdateUserRequest } from "../interfaces/extras/users-interface";
import { ReadStudentResponse, StudentListResponse, SequenceResponse, RoutineResponse } from "../interfaces/alumnos-interface";
import { UserService } from "./extras/user-service";
import { FormGroup } from "@angular/forms";
import { SortParam } from "../interfaces/extras/content/content-interface";

@Injectable({
    providedIn: 'root',
})
export class AlumnosService{

    private API_URL = API_URL + "/api/v1/admin/alumnos";

    constructor (private http:HttpClient, private userService: UserService) {}

    create(createUser: CreateUserRequest): Observable<void> {
        return this.http.post<void>(this.API_URL, createUser);
    }

    read(id: number): Observable<ReadStudentResponse> {
        return this.http.get<ReadStudentResponse>(`${this.API_URL}/${id}`);
    }

    update(id: number, updateUser: UpdateUserRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/${id}`, updateUser);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    sendStudent(formData: any): Observable<void> {
        let originalId = formData.id || null
        if(originalId){
            return this.update(originalId, this.userService.convertToUpdateUser(formData));
        } else {
            return this.create(this.userService.convertToCreateUser(formData));
        }
    }

    list({
        query = "",
        sortBy = "user.name",
        sortDir = "asc",
        page = 0
    }: QuerySortParameters = {}): Observable<Page<StudentListResponse>> {
        return this.http.get<Page<StudentListResponse>>(this.API_URL + "?q="+query+"&sort="+sortBy+","+sortDir+"&page="+page);
    }

    getSortParams(): Observable<SortParam[]> {
        return this.http.get<SortParam[]>(`${this.API_URL}/sort-params`);
    }

    assignSequenceToStudent(studentId: number, sequenceId: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/${studentId}/sequences/${sequenceId}`, {});
    }

    unassignSequenceFromStudent(studentId: number, sequenceId: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${studentId}/sequences/${sequenceId}`);
    }

    getAssignedSequences(studentId: number): Observable<SequenceResponse[]> {
        return this.http.get<SequenceResponse[]>(`${this.API_URL}/${studentId}/sequences`);
    }

    getUnassignedSequences(studentId: number): Observable<SequenceResponse[]> {
        return this.http.get<SequenceResponse[]>(`${this.API_URL}/${studentId}/sequences-available`);
    }

    countAssignedSequences(studentId: number): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/${studentId}/sequence-count`);
    }

    assignRoutineToStudent(studentId: number, routineId: number): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/${studentId}/routines/${routineId}`, {});
    }

    unassignRoutineFromStudent(studentId: number, routineId: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${studentId}/routines/${routineId}`);
    }

    getAssignedRoutines(studentId: number): Observable<RoutineResponse[]> {
        return this.http.get<RoutineResponse[]>(`${this.API_URL}/${studentId}/routines`);
    }

    getUnassignedRoutines(studentId: number): Observable<RoutineResponse[]> {
        return this.http.get<RoutineResponse[]>(`${this.API_URL}/${studentId}/routines-available`);
    }

    countAssignedRoutines(studentId: number): Observable<number> {
        return this.http.get<number>(`${this.API_URL}/${studentId}/routine-count`);
    }

    handleFormErrors(errors: any, formGroup: FormGroup) {
        this.userService.handleFormErrors(errors, formGroup);
    }

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './env';
import { Observable } from 'rxjs';
import { TeacherResponse } from '../interfaces/user/teacher/teacher-interface';
import { PageResponse } from '../interfaces/utils/page-interface';
import { UserService } from './user-service';
import { CreateUser } from '../interfaces/user/user-interface';
import { FormGroup } from '@angular/forms';
import { SortParam } from '../interfaces/content-interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  
  constructor (private http: HttpClient, private userService: UserService) {}

  API_URL = API_URL + "/api/v1/admin/teachers";

  getTeachers(query:string = "", sortDir: string = "asc", sortBy: string = "user.name"): Observable<PageResponse<TeacherResponse>> {
    return this.http.get<PageResponse<TeacherResponse>>(this.API_URL + "?q=" + query + "&sort=" + sortBy + "," + sortDir);
  }

  getStudentCountByTeacher(id: number): Observable<number> {
    return this.http.get<number>(this.API_URL + "/" + id + "/student-count");
  };

  getTeacherById(id: number): Observable<TeacherResponse> {
    return this.http.get<TeacherResponse>(this.API_URL + "/" + id);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(this.API_URL + "/" + id)
  }

  sendTeacher(formData: any): Observable<TeacherResponse> {
    let originalId = formData.id || null
    if(originalId){
      formData = this.userService.convertFormDataToUpdateUser(formData);
      return this.updateTeacher(formData, originalId);
    } else {
      formData = this.userService.convertFormDataToCreateUser(formData);
      return this.addTeacher(formData);
    }
  }

  addTeacher(formData: CreateUser): Observable<TeacherResponse> {
    console.log(formData);
    return this.http.post<TeacherResponse>(this.API_URL, formData)
  }

  updateTeacher(formData: TeacherResponse, originalId: number): Observable<TeacherResponse> {        
    return this.http.put<TeacherResponse>(this.API_URL + "/" + originalId, formData)
  }

  handleFormErrors(errors: any, userFormGroup: FormGroup) {
    this.userService.handleFormErrors(errors, userFormGroup);
  }

  getSortParams(): Observable<SortParam[]> {
    return this.http.get<SortParam[]>(this.API_URL + "/sort-params");
  }

}
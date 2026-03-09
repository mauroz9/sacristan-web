import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user-service';
import { API_URL } from './env';
import { StudentResponse } from '../interfaces/user/student/student-interface';
import { PageResponse } from '../interfaces/utils/page-interface';
import { CreateUser } from '../interfaces/user/user-interface';
import { FormGroup } from '@angular/forms';
import { SortParam } from '../interfaces/content-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  
  constructor (private http:HttpClient, private userService:UserService) {}

  API_URL = API_URL + "/api/v1/admin/students";



  getStudents({
    query = "",
    sortBy = "user.name",
    sortDir = "asc",
    page = 0
  }: GetParams = {}): Observable<PageResponse<StudentResponse>> {
    return this.http.get<PageResponse<StudentResponse>>(this.API_URL + "?q="+query+"&sort="+sortBy+","+sortDir+"&page="+page);
  }


  getStudentsWithTeacher(id: number): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.API_URL + "/teacher/" + id);
  }
  
  getStudentsWithoutTeacher(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.API_URL + "/no-teacher");
  }

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(this.API_URL + "/" + studentId);
  }

  deleteStudent(id: number) {
    return this.http.delete(this.API_URL + "/" + id)
  }

  assignTeacherToStudent(studentId: number, teacherId: number) {
    return this.http.put(this.API_URL + "/" + studentId + "/assign-teacher/" + teacherId, {}).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.error("Error assigning teacher to student", error);
      }
    }); 
  }

  unassignTeacherFromStudent(studentId: number) {
    return this.http.put(this.API_URL + "/" + studentId + "/unassign-teacher", {}).subscribe({
      next: (data) => {
        console.log("Teacher unassigned from student successfully");
      },
      error: (error) => {
        console.error("Error unassigning teacher from student", error);
      }
    });
  }
  
  sendStudent(formData: any): Observable<StudentResponse> {
      let originalId = formData.id || null
      if(originalId){
        formData = this.userService.convertFormDataToUpdateUser(formData);
        return this.updateStudent(formData, originalId);
      } else {
        formData = this.userService.convertFormDataToCreateUser(formData);
        return this.addStudent(formData);
      }
    
  }

  addStudent(formData: CreateUser): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.API_URL, formData);
  }

  updateStudent(formData: StudentResponse, originalId: number) : Observable<StudentResponse> {        
    return this.http.put<StudentResponse>(this.API_URL + "/" + originalId, formData)
  }

  handleFormErrors(errors: any, formGroup: FormGroup) {
    this.userService.handleFormErrors(errors, formGroup);
  }

  getSortParams(): Observable<SortParam[]> {
    return this.http.get<SortParam[]>(this.API_URL + "/sort-params");
  }

}

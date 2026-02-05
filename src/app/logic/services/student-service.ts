import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { API_URL } from './env';
import { StudentResponse } from '../interfaces/user/student/student-interface';
import { PageResponse } from '../interfaces/utils/page-interface';
import { CreateUser } from '../interfaces/user/user-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor (private http:HttpClient, private router: Router, private userService:UserService) {}

  API_URL = API_URL + "/api/v1/admin/students";

  getStudent(query:string = ""): Observable<PageResponse<StudentResponse>> {
    return this.http.get<PageResponse<StudentResponse>>(this.API_URL + "?q="+query);
  }

  // NOT YET
  getStudentsWithTeacher(id: number): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.API_URL + "/con-profesor" + id);
  }
  
  // NOT YET
  getStudentsWithoutTeacher(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.API_URL + "/sin-profesor");
  }

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(this.API_URL + "/" + studentId);
  }

  deleteStudent(id: number) {
    return this.http.delete(this.API_URL + "/" + id)
  }

  // NOT YET
  assignTeacherToStudent(studentId: number, teacherId: number) {
    return this.http.put(this.API_URL + "/" + studentId + "/asignar-profesor/" + teacherId, {}).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.error("Error assigning teacher to student", error);
      }
    }); 
  }

  // NOT YET
  unassignTeacherFromStudent(studentId: number) {
    return this.http.put(this.API_URL + "/" + studentId + "/desasignar-profesor", {}).subscribe({
      next: (data) => {
        console.log("Teacher unassigned from student successfully");
      },
      error: (error) => {
        console.error("Error unassigning teacher from student", error);
      }
    });
  }
  
  sendStudent(formData: any) {
    let originalId = formData.id || null
    if(originalId){
      formData = this.userService.convertFormDataToUpdateUser(formData);
      this.updateStudent(formData, originalId);
    } else {
      formData = this.userService.convertFormDataToCreateUser(formData);
      this.addStudent(formData);
    }
  }

  addStudent(formData: CreateUser) {
    console.log(formData);
    
    this.http.post(this.API_URL, formData).pipe(
      finalize(() => {
        console.log("Returning to students");
        this.router.navigate(['/students']);
      })
    ).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem('infoMessage', 'Alumno añadido correctamente');
      },
      error: (error) => {
        console.error("Error adding student", error);        
        let errorMessage = 'Error al añadir el alumno: '
        this.errorHandler(error, errorMessage);
      }
    });
  }

  updateStudent(formData: StudentResponse, originalId: number) {        
    this.http.put(this.API_URL + "/" + originalId, formData).pipe(
      finalize(() => {
        console.log("Returning to students");
        this.router.navigate(['/students']);
      })
    ).subscribe(
      {
        next: (data) => {
          localStorage.setItem('infoMessage', 'Alumno actualizado correctamente');
        },
        error: (error) => {
          console.error("Error updating student", error);
          let errorMessage = 'Error al actualizar al alumno: '
          this.errorHandler(error, errorMessage);
        }
      }
    );
  }

  errorHandler(error: any, errorMessage: string) {
    if (error.status == 400) {
      if (error.error.error == "001") {
        errorMessage = errorMessage + "El email " + error.error.detail + " ya está registrado.";
      }
      localStorage.setItem('errorMessage',  errorMessage);
    } else {
      localStorage.setItem('errorMessage',  "Ha ocurrido un error inesperado.");
    }
  }

}

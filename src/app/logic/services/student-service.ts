import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { API_URL } from './env';
import { StudentResponse } from '../interfaces/user/student/student-interface';
import { PageResponse } from '../interfaces/utils/page-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor (private http:HttpClient, private router: Router, private userService:UserService) {}

  getStudent(query:string = ""): Observable<PageResponse<StudentResponse>> {
    return this.http.get<PageResponse<StudentResponse>>(API_URL + "/api/v1/admin/students?q="+query);
  }

  // NOT YET
  getStudentsWithTeacher(id: number): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(API_URL + "/api/v1/admin/students/con-profesor/" + id);
  }
  
  
  // NOT YET
  getStudentsWithoutTeacher(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(API_URL + "/api/v1/admin/students/sin-profesor");
  }

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(API_URL + "/api/v1/admin/students/" + studentId);
  }

  deleteStudent(id: number) {
    return this.http.delete(API_URL + "/api/v1/admin/students/" + id)
  }

  // NOT YET
  assignTeacherToStudent(studentId: number, teacherId: number) {
    return this.http.put(API_URL + "/api/v1/admin/students/" + studentId + "/asignar-profesor/" + teacherId, {}).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.error("Error assigning teacher to student", error);
      }
    }); 
  }

  // NOT YET
  unassignTeacherFromStudent(studentId: number) {
    return this.http.put(API_URL + "/api/v1/admin/students/" + studentId + "/desasignar-profesor", {}).subscribe({
      next: (data) => {
        console.log("Teacher unassigned from student successfully");
      },
      error: (error) => {
        console.error("Error unassigning teacher from student", error);
      }
    });
  }
  
  // NOT YET
  // sendStudent(formData: any) {
  //   let processedFormData:StudentResponse = this.convertFormDataToStudent(formData);
  //   if(processedFormData.user.id){
  //     this.updateStudent(processedFormData);
  //   } else {
  //     this.addStudent(processedFormData);
  //   }
  // }

  // NOT YET
  addStudent(formData: StudentResponse) {
    this.http.post(API_URL + "/api/v1/admin/students/", formData).subscribe({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Alumno añadido correctamente');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error("Error adding student", error);
      }
    });
  }

  // NOT YET
  updateStudent(formData: StudentResponse) {    

    this.http.put(API_URL + "/api/usuarios/" + formData.id, formData).subscribe(
      {
        next: (data) => {
          
          localStorage.setItem('infoMessage', 'Alumno actualizado correctamente');
          this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error("Error updating student", error);
        }
      }
    );
  }

  // NOT YET
  // convertFormDataToStudent(formData: any): StudentResponse {
  //   let student: StudentResponse = {
  //     kind: 'student',
  //     role: 'student',
  //     user: {
  //       id: formData.id,
  //       name: formData.nameFormControl,
  //       lastName: formData.lastNameFormControl,
  //       email: formData.emailFormControl
  //     },
  //     teacher: null
  //   }

  //   if (formData.passwordFormControl === '') { 
  //     delete student.user.password;
  //   } else {
  //     student.user.password_confirmation = formData.passwordFormControl;
  //   }

  //   return student;

  // }

}

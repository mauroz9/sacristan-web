import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { API_URL } from './env';
import { Sequence } from '../interfaces/sequence-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  constructor (private http:HttpClient, private router: Router, private userService:UserService) {}

  getStudent(): Observable<Student[]> {
    return this.http.get<Student[]>(API_URL + "/api/estudiantes");
  }

  getStudentsWithTeacher(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(API_URL + "/api/estudiantes/con-profesor/" + id);
  }

  getStudentsWithoutTeacher(): Observable<Student[]> {
    return this.http.get<Student[]>(API_URL + "/api/estudiantes/sin-profesor");
  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>(API_URL + "/api/estudiantes/" + studentId);
  }

  deleteStudent(id: number) {
    return this.http.delete(API_URL + "/api/estudiantes/" + id)
  }

  assignTeacherToStudent(studentId: number, teacherId: number) {
    return this.http.put(API_URL + "/api/estudiantes/" + studentId + "/asignar-profesor/" + teacherId, {}).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.error("Error assigning teacher to student", error);
      }
    }); 
  }

  unassignTeacherFromStudent(studentId: number) {
    return this.http.put(API_URL + "/api/estudiantes/" + studentId + "/desasignar-profesor", {}).subscribe({
      next: (data) => {
        console.log("Teacher unassigned from student successfully");
      },
      error: (error) => {
        console.error("Error unassigning teacher from student", error);
      }
    });
  }

  sendStudent(formData: any) {
    let processedFormData:Student = this.convertFormDataToStudent(formData);
    if(processedFormData.user.id){
      this.updateStudent(processedFormData);
    } else {
      this.addStudent(processedFormData);
    }
  }

  addStudent(formData: Student) {
    this.http.post(API_URL + "/api/estudiantes/", formData.user).subscribe({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Alumno añadido correctamente');
        this.router.navigate(['/students']);
      },
      error: (error) => {
        console.error("Error adding student", error);
      }
    });
  }

  updateStudent(formData: Student) {    

    this.http.put(API_URL + "/api/usuarios/" + formData.user.id, formData.user).subscribe(
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

  convertFormDataToStudent(formData: any): Student {
    let student: Student = {
      kind: 'alumno',
      user: {
        id: formData.id,
        name: formData.nameFormControl,
        last_name: formData.lastNameFormControl,
        email: formData.emailFormControl,
        role_id: 2,
        password: formData.passwordFormControl,
        password_confirmation: formData.passwordFormControl
      }
    }

    if (formData.passwordFormControl === '') { 
      delete student.user.password;
    } else {
      student.user.password_confirmation = formData.passwordFormControl;
    }

    return student;

  }

  getStudentSequences(studentId: number): Observable<Sequence[]>{
    return this.http.get<Sequence[]>(API_URL + `/api/estudiantes/${studentId}/secuencias`);
  }

  assignSequence(studentId: number, sequenceId: number): Observable<any>{
    return this.http.post(API_URL + `/api/student-sequences`, {
      studentId: studentId,
      sequenceId: sequenceId
    });
  }

  unassignSequence(studentId: number, sequenceId: number): Observable<any>{
    return this.http.delete(API_URL + `/api/student-sequences/${studentId}/${sequenceId}`)
  }

}

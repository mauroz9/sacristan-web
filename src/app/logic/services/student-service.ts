import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  deleteStudent(id: number) {
    return this.http.delete("http://127.0.0.1:8000/api/usuarios/" + id)
  }

  convertFormDataToStudent(formData: any): Student {
    let student: Student = {
      kind: 'alumno',
      id: formData.id,
      name: formData.nameFormControl,
      last_name: formData.lastNameFormControl,
      email: formData.emailFormControl,
      password: formData.passwordFormControl,
      assignedSequences: 0
    }

    if (formData.passwordFormControl === '') { 
      delete student.password;
    }

    return student;

  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>("http://127.0.0.1:8000/api/usuarios/" + studentId);
  }

  sendStudent(formData: any) {
    formData = this.convertFormDataToStudent(formData);
    if(formData.id){
      this.updateStudent(formData);
    } else {
      this.addStudent(formData);
    }
  }

  addStudent(formData: Student) {
    this.http.post("http://127.0.0.1:8000/api/usuarios/", formData).subscribe
    ({
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

    this.http.put("http://127.0.0.1:8000/api/usuarios/" + formData.id, formData).subscribe(
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

  constructor (private http:HttpClient, private router: Router) {}

  getStudent(): Observable<Student[]> {
    return this.http.get<Student[]>("http://127.0.0.1:8000/api/usuarios")
  }



}

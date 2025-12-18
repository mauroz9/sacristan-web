import { Injectable } from '@angular/core';
import { backStudent, backStudentDetails, backStudentRequest, Student } from '../interfaces/student-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  convertToStudent(data: any): Student {
    return {
      kind: 'alumno',
      id: data.id,
      name: data.nombre,
      lastName: data.apellidos,
      email: data.email,
      password: data.contrasena,
      assignedSequences: 0
    };
  }

  convertToBackStudentRequest(student: Student): backStudentRequest {    
    return {
      id: student.id,
      nombre: student.name,
      apellidos: student.lastName,
      email: student.email,
      contrasena: student.password,
      contrasena_confirmation: student.password,
    };
  }

  convertFormDataToStudent(formData: any): Student {
    return {
      kind: 'alumno',
      id: formData.id,
      name: formData.nameFormControl,
      lastName: formData.lastNameFormControl,
      email: formData.emailFormControl,
      password: formData.passwordFormControl,
      assignedSequences: 0
    };
  }

  getStudentById(studentId: number): Observable<backStudentDetails> {
    return this.http.get<backStudentDetails>("http://127.0.0.1:8000/api/usuarios/" + studentId);
  }

  sendStudent(formData: Student) {
    formData = this.convertFormDataToStudent(formData);
    if(formData.id){
      this.updateStudent(formData);
    } else {
      this.addStudent(formData);
    }
  }

  addStudent(formData: Student) {
    this.http.post("http://127.0.0.1:8000/api/usuarios/", this.convertToBackStudentRequest(formData)).subscribe
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

    this.http.put("http://127.0.0.1:8000/api/usuarios/" + formData.id, this.convertToBackStudentRequest(formData)).subscribe(
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

  getStudent(): Observable<backStudent[]> {
    return this.http.get<backStudent[]>("http://127.0.0.1:8000/api/usuarios")
  }



}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './env';
import { Teacher } from '../interfaces/teacher-interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor (private http: HttpClient, private router: Router) {}


  getTeachers(filterText:String = ""): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(API_URL + "/api/profesores?q=" + filterText);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(API_URL + "/api/profesores/" + id);
  }

  deleteTeacher(id: number) {
    return this.http.delete(API_URL + "/api/profesores/" + id)
  }

  getAssignedStudentsCount(id: number): Observable<number> {
    return this.http.get<number>(API_URL + "/api/profesores/" + id + "/estudiantes-asignados");
  }

  // sendTeacher(formData: any) {
  //   let processedFormData:Teacher = this.convertFormDataToTeacher(formData);
  //   if(processedFormData.user.id){
  //     this.updateTeacher(processedFormData);
  //   } else {
  //     this.addTeacher(processedFormData);
  //   }
  // }
  addTeacher(formData: Teacher) {
    this.http.post(API_URL + "/api/profesores/", formData.user).subscribe({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Profesor añadido correctamente');
        this.router.navigate(['/teachers']);
      },
      error: (error) => {
        console.error("Error adding teacher", error);
      }
    });
  }

  updateTeacher(formData: Teacher) {
      this.http.put(API_URL + "/api/usuarios/" + formData.user.id, formData.user).subscribe(
      {
        next: (data) => {          
          localStorage.setItem('infoMessage', 'Profesor actualizado correctamente');
          this.router.navigate(['/teachers']);
        },
        error: (error) => {
          console.error("Error updating teacher", error);
        }
      }
    );
  }

  // convertFormDataToTeacher(formData: any): Teacher {
  //   let teacher: Teacher = {
  //     kind: 'profesor',
  //     user: {
  //       id: formData.id,
  //       name: formData.nameFormControl,
  //       last_name: formData.lastNameFormControl,
  //       email: formData.emailFormControl,
  //       password: formData.passwordFormControl,
  //       password_confirmation: formData.passwordFormControl,
  //       role_id: 3,
  //     },
  //   };

  //   if (formData.id) {
  //     teacher.user.id = formData.id;
  //   }

  //   if (formData.passwordFormControl === '') {
  //     delete teacher.user.password;
  //   } else {
  //     teacher.user.password_confirmation = formData.passwordFormControl;
  //   }
  //   return teacher;
  // }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './env';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TeacherResponse } from '../interfaces/user/teacher/teacher-interface';
import { PageResponse } from '../interfaces/utils/page-interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor (private http: HttpClient, private router: Router) {}

  API_URL = API_URL + "/api/v1/admin/teachers";

  getTeachers(filterText:String = ""): Observable<PageResponse<TeacherResponse>> {
    return this.http.get<PageResponse<TeacherResponse>>(this.API_URL + "?q=" + filterText);
  }

  getStudentCountByTeacher(id: number): Observable<number> {
    return this.http.get<number>(this.API_URL + "/" + id + "/student-count");
  };

  getTeacherById(id: number): Observable<TeacherResponse> {
    return this.http.get<TeacherResponse>(this.API_URL + "/" + id);
  }

  deleteTeacher(id: number) {
    return this.http.delete(this.API_URL + "/" + id)
  }

  // sendTeacher(formData: any) {
  //   let processedFormData:Teacher = this.convertFormDataToTeacher(formData);
  //   if(processedFormData.user.id){
  //     this.updateTeacher(processedFormData);
  //   } else {
  //     this.addTeacher(processedFormData);
  //   }
  // }
  // addTeacher(formData: TeacherResponse  ) {
  //   this.http.post(this.API_URL + "/", formData.user).subscribe({
  //     next: (data) => {
  //       localStorage.setItem('infoMessage', 'Profesor añadido correctamente');
  //       this.router.navigate(['/teachers']);
  //     },
  //     error: (error) => {
  //       console.error("Error adding teacher", error);
  //     }
  //   });
  // }

  // updateTeacher(formData: TeacherResponse) {
  //     this.http.put(this.API_URL + "/" + formData.user.id, formData.user).subscribe(
  //     {
  //       next: (data) => {          
  //         localStorage.setItem('infoMessage', 'Profesor actualizado correctamente');
  //         this.router.navigate(['/teachers']);
  //       },
  //       error: (error) => {
  //         console.error("Error updating teacher", error);
  //       }
  //     }
  //   );
  // }

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

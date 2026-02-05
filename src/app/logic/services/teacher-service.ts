import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './env';
import { finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TeacherResponse } from '../interfaces/user/teacher/teacher-interface';
import { PageResponse } from '../interfaces/utils/page-interface';
import { UserService } from './user-service';
import { CreateUser } from '../interfaces/user/user-interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor (private http: HttpClient, private router: Router, private userService: UserService) {}

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

  sendTeacher(formData: any) {
      let originalId = formData.id || null
      if(originalId){
        formData = this.userService.convertFormDataToUpdateUser(formData);
        this.updateTeacher(formData, originalId);
      } else {
        formData = this.userService.convertFormDataToCreateUser(formData);
        this.addTeacher(formData);
      }
    }
  
    addTeacher(formData: CreateUser) {
      console.log(formData);
      
      this.http.post(this.API_URL, formData).pipe(
        finalize(() => {
          console.log("Returning to teachers");
          this.router.navigate(['/teachers']);
        })
      ).subscribe({
        next: (data) => {
          console.log(data);
          localStorage.setItem('infoMessage', 'Profesor añadido correctamente');
        },
        error: (error) => {
          console.error("Error adding teacher", error);        
          let errorMessage = 'Error al añadir el profesor: '
          this.userService.errorHandler(error, errorMessage);
        }
      });
    }
  
    updateTeacher(formData: TeacherResponse, originalId: number) {        
      this.http.put(this.API_URL + "/" + originalId, formData).pipe(
        finalize(() => {
          console.log("Returning to teachers");
          this.router.navigate(['/teachers']);
        })
      ).subscribe(
        {
          next: (data) => {
            localStorage.setItem('infoMessage', 'Profesor actualizado correctamente');
          },
          error: (error) => {
            console.error("Error updating teacher", error);
            let errorMessage = 'Error al actualizar el profesor: '
            this.userService.errorHandler(error, errorMessage);
          }
        }
      );
    }

  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from './env';
import { UserResponse } from '../interfaces/user/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(API_URL + "/api/usuarios/");
  }

  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_URL}/api/usuarios/${userId}`);
  }

  // sendUser(formData: any) {
  //   formData = this.convertFormDataToUser(formData);
  //   if(formData.id){
  //     this.updateUser(formData);
  //   } else {
  //     this.addUser(formData);
  //   }
  // }


  addUser(formData: UserResponse) {
    this.http.post(API_URL + "/api/usuarios/", formData).subscribe
    ({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Usuario añadido correctamente');
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error("Error adding user", error);
      }
    });
  }

  updateUser(formData: UserResponse) {
    this.http.put(API_URL + "/api/usuarios/" + formData.id, formData).subscribe({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Usuario modificado correctamente');
      },
      error: (error) => {
        console.error("Error updating user", error);
      }
    });
  }

  // convertFormDataToUser(formData: any): UserResponse {
  //   let user: UserResponse = {
  //     id: formData.id,
  //     name: formData.nameFormControl,
  //     lastName: formData.lastNameFormControl,
  //     email: formData.emailFormControl
  //     username: formData.usernameFormControl
  //   }


  //   return user;
  // }

}

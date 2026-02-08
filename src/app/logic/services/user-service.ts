import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from './env';
import { CreateUser, UpdateUser, UserResponse } from '../interfaces/user/user-interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(API_URL + "/api/usuarios/");
  }

  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_URL}/api/v1/admin/users/${userId}`);
  }



  convertFormDataToCreateUser(formData: any): CreateUser {
    return { 
        name: formData.nameFormControl,
        lastName: formData.lastNameFormControl,
        email: formData.emailFormControl,
        username: formData.usernameFormControl,
        password: formData.passwordFormControl,
        verifyPassword: formData.passwordFormControl,
      }
  }

  convertFormDataToUpdateUser(formData: any): UpdateUser {
    return {
        name: formData.nameFormControl,
        lastName: formData.lastNameFormControl,
        email: formData.emailFormControl,
        username: formData.usernameFormControl,
      }
  }

  handleFormErrors(errors: any, formGroup: FormGroup) {
    for (let index = 0; index < errors.length; index++) {
      const element = errors[index];
      if(element.field == "username"){
        formGroup.get('usernameFormControl')?.setErrors({'validation': element.message});
      }
      if(element.field == "email"){
        formGroup.get('emailFormControl')?.setErrors({'validation': element.message});
      }
    }
  }
  

}

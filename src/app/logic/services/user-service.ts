import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("http://127.0.0.1:8000/api/usuarios/");
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`http://127.0.0.1:8000/api/usuarios/${userId}`);
  }

  sendUser(formData: any) {
    formData = this.convertFormDataToUser(formData);
    if(formData.id){
      this.updateUser(formData);
    } else {
      this.addUser(formData);
    }
  }


  addUser(formData: User) {
    this.http.post("http://127.0.0.1:8000/api/usuarios/", formData).subscribe
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

  updateUser(formData: User) {
    this.http.put("http://127.0.0.1:8000/api/usuarios/" + formData.id, formData).subscribe({
      next: (data) => {
        localStorage.setItem('infoMessage', 'Usuario modificado correctamente');
      },
      error: (error) => {
        console.error("Error updating user", error);
      }
    });
  }

  convertFormDataToUser(formData: any): User {
    let user: User = {
      id: formData.id,
      name: formData.nameFormControl,
      last_name: formData.lastNameFormControl,
      email: formData.emailFormControl,
      role_id: formData.roleIdFormControl,
      password: formData.passwordFormControl,
      password_confirmation: formData.passwordFormControl
    }

    if (formData.passwordFormControl === '') { 
      delete user.password;
    }
    return user;
  }

}

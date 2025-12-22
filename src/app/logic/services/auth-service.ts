import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router){
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.currentUser.set({ token }); 
    }
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${API_URL}/api/login`, credentials).pipe(
      tap((response: any) => {
        if(response.token){
          localStorage.setItem('auth_token', response.token)
          this.currentUser.set(response.user);
        }
      })
    );
  }
  
  logout(): void{
    this.http.post(`${API_URL}/api/logout`, {}).subscribe(() => {
      this.doLogout()
    });
  }

  doLogout() {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { API_URL } from './env';
import { JwtUserResponse } from '../interfaces/auth/jwt-user-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private http: HttpClient, private router: Router) {}
  loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));
  
  isLoggedIn$ = this.loggedInSubject.asObservable();
  
  logout() {
    this.loggedInSubject.next(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    this.http.post(`${API_URL}/logout`, {}).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
        this.router.navigate(['/login']);
      }
    });

  }
  
  getToken() {
    return localStorage.getItem('auth_token');
  }


  public login(data: { email: string; password: string }): Observable<JwtUserResponse> {
    return this.http.post<JwtUserResponse>(`${API_URL}/login`, data)
  }

  public refreshToken(): Observable<JwtUserResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<JwtUserResponse>(`${API_URL}/refresh-token`, { refreshToken });
  }

}
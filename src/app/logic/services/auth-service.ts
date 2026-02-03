import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,  Observable} from 'rxjs';
import { API_URL } from './env';
import { JwtUserResponse } from '../interfaces/auth/jwt-user-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  saveLogInData(res: JwtUserResponse) {
    this.setLoggedInStatus(true);
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('refresh_token', res.refreshToken);
  }
  
  constructor(private http: HttpClient, private router: Router) {}
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));
    
  setLoggedInStatus(status: boolean): void {
    this.loggedInSubject.next(status);
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }


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

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<JwtUserResponse>(`${API_URL}/refresh-token`, { refreshToken });
  }

}
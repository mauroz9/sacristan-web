import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,  Observable} from 'rxjs';
import { API_URL } from '../../env';
import { JwtUserResponse } from '../../interfaces/extras/auth/jwt-user-response';

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

  removeStorage() {
    console.log("Borrando almacenamiento");
    
    this.loggedInSubject.next(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  localLogout() {
    this.removeStorage();
    localStorage.setItem('errorMessage', 'Se ha cerrado la sesión.');
    this.router.navigate(['/login']);
  }
  
  logout() {
    this.removeStorage();
    
    this.http.post(`${API_URL}/logout`, {}).subscribe();
    localStorage.setItem('errorMessage', 'Se ha cerrado la sesión.');
    this.router.navigate(['/login']);
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

    console.log("TOKEN REFRESCADO");
    return this.http.post<JwtUserResponse>(`${API_URL}/refresh-token`, { refreshToken });
  }

}
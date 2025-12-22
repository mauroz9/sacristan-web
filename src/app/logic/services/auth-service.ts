import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from './env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  currentUser = signal<any>(null);
  isLoggedIn$ = this.loggedInSubject.asObservable();

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
          this.currentUser.set(response.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }
  
  logout(): void{
    this.http.post(`${API_URL}/api/logout`, {}).subscribe(() => {
        this.loggedInSubject.next(false);
      this.doLogout()
    });
  }

  doLogout() {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

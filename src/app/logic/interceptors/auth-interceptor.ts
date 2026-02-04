import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { JwtUserResponse } from '../interfaces/auth/jwt-user-response';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = addToken(req, token);
  }
  
  return next(authReq).pipe(
    // IF ERROR STATUS 0 SEND TO LOGIN AND SAY THAT THE SERVER IS DOWN, CONTACT WITH SYSTEM ADMIN
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        
        const isLoginRequest = authReq.url.includes('/login');
        const isRefreshRequest = authReq.url.includes('/refresh-token');
        
        if (!isLoginRequest && !isRefreshRequest) {
          return handle401Error(authReq, next, authService);
        }
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse: JwtUserResponse) => {
        isRefreshing = false;
        
        authService.saveLogInData(tokenResponse);

        refreshTokenSubject.next(tokenResponse.token);
        return next(addToken(request, tokenResponse.token));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap((token) => next(addToken(request, token)))
    );
  }
}

function addToken(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

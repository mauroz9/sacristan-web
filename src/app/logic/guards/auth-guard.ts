import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/extras/auth-service';
import { firstValueFrom } from 'rxjs';



export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  
  if (await firstValueFrom(authService.getLoggedInStatus())) {
    return true;
  } else {
    localStorage.setItem('errorMessage', 'Debes iniciar sesión para acceder a esta página.');
    router.navigate(['/login']);
    return false;
  }
};

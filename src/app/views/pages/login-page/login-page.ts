import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../logic/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para *ngIf

@Component({
  selector: 'app-login-page',
  standalone: true, // Asegúrate de esto si usas Angular moderno
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false; // Estado para mostrar/ocultar contraseña
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {}

  getEmailErrorMessage() {
    const email = this.loginForm.get('email');
    if (email?.hasError('required')) return 'El email es obligatorio';
    return email?.hasError('email') ? 'Formato de email no válido' : '';
  }

  ngOnInit(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');  
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const data = {
        "email": this.loginForm.get('email')!.value!,
        "password": this.loginForm.get('password')!.value!
      }
      
      // El valor del formulario se puede pasar directamente
      this.authService.login(data).subscribe({
        next: (res) => {

          if (res.roles.includes('ADMIN')) {
            this.authService.setLoggedInStatus(true);
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('refresh_token', res.refreshToken);

            this.router.navigate(['/sequences']);
          } else {
            this.handleAuthError({status: 403, message: 'No tienes permisos'});
          }


        },
        error: (err) => {
          this.isLoading = false;
          this.handleAuthError(err);
        },
        complete: () => this.isLoading = false
      });
    }
  }

  private handleAuthError(err: any) {
    if (err.status === 401) {
      this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
    } else if (err.status === 403 || err.message === 'No tienes permisos') {
      this.errorMessage = 'No dispones de la autorización necesaria para acceder a esta web.';
    } else {
      this.errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.';
    }
  }

}
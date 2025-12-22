import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    if (localStorage.getItem('auth_token')) {
      this.router.navigate(['/sequences']);
    }    
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // El valor del formulario se puede pasar directamente
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/sequences']);
        },
        error: (err) => {
          this.isLoading = false;
          // En lugar de alert, podrías usar un toast o un mensaje en el UI
          console.error('Error de login:', err);
          alert('Credenciales incorrectas. Inténtalo de nuevo.');
        },
        complete: () => this.isLoading = false
      });
    }
  }
}
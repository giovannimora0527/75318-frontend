// src/app/demo/pages/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  cargando: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  mostrarPassword: boolean = false;
  intentosRestantes: number | null = null;
  usuarioBloqueado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.intentosRestantes = null;

    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({
      next: (response) => {
        this.cargando = false;

        if (response.exitoso) {
          this.mensajeExito = response.mensaje;
          
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username || '');
            localStorage.setItem('rol', response.rol || '');
          }

          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1000);

        } else {
          if (response.bloqueado) {
            this.usuarioBloqueado = true;
            this.mensajeError = response.mensaje;
          } else {
            this.mensajeError = response.mensaje;
            this.intentosRestantes = response.intentosRestantes || null;
          }
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error en login:', error);
        this.mensajeError = 'Error al intentar iniciar sesión. Por favor, intente nuevamente.';
      }
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
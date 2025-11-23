// src/app/demo/pages/auth/recuperar-password/recuperar-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { RecuperacionRequest } from '../models/recuperacion-request';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.scss'
})
export class RecuperarPasswordComponent {

  recuperarForm: FormGroup;
  cargando: boolean = false;
  mensajeInfo: string = '';
  solicitudEnviada: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recuperarForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  recuperarPassword(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeInfo = '';

    const request: RecuperacionRequest = this.recuperarForm.value;

    this.authService.recuperarPassword(request).subscribe({
      next: (response) => {
        this.cargando = false;
        this.solicitudEnviada = true;
        this.mensajeInfo = response.mensaje;
        this.recuperarForm.reset();
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error en recuperación:', error);
        this.solicitudEnviada = true;
        this.mensajeInfo = 'Si el usuario existe, se ha enviado un correo con instrucciones para recuperar la contraseña.';
      }
    });
  }

  volverLogin(): void {
    this.router.navigate(['/login']);
  }

  get username() {
    return this.recuperarForm.get('username');
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoginRq } from './models/login-rq';
import { LoginRs } from './models/login-rs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  titleSpinner: string = 'Autenticando...';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarSesion: [false]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const loginData: LoginRq = {
        username: this.f['username'].value,
        password: this.f['password'].value,
        // ip: '192.168.0.10'// si necesitas la IP, puedes agregarla aquí
      };

      this.loginService.loginUsuario(loginData).subscribe({
        next: (response: LoginRs) => {
          console.log('Respuesta del servidor:', response);

          // Guardar en AuthService
          this.authService.login(response, response.usuario);

          this.isLoading = false;
          this.spinner.hide();

          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success'
          }).then(() => {
            // Redirigir al dashboard o página principal
            this.router.navigate(['/inicio']);
          });
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
          this.spinner.hide();
          this.isLoading = false;

          Swal.fire({
            title: 'Error',
            text: 'Ups! Algo salió mal durante el inicio de sesión.',
            icon: 'error'
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });
    }
  }

  onForgotPassword(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: 'Recuperar contraseña',
      text: 'Ingrese su correo electrónico para recuperar su contraseña',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'correo@ejemplo.com'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('El correo electrónico es requerido');
          return false;
        }

        return new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log('Enviar email de recuperación a:', email);
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Email enviado',
          text: 'Se ha enviado un enlace de recuperación a su correo electrónico',
          icon: 'success'
        });
      }
    });
  }
}

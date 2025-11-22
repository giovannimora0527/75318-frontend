import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
    private readonly router: Router,
    private readonly tokenService: TokenService
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

      // Simular llamada al servicio de autenticación
      const loginData = {
        username: this.f['username'].value,
        password: this.f['password'].value,
        recordarSesion: this.f['recordarSesion'].value
      };

      console.log('Datos de login:', loginData);
      this.loginService.loginUsuario(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          localStorage.setItem("token", response.token);

          // Revisar cambio de contraseña
          const requireChange = response.requiereCambioPassword;

          // Ocultar spinner antes de mostrar alert
          this.spinner.hide();
          this.isLoading = false;

          if (requireChange) {
            Swal.fire({
              icon: 'warning',
              title: 'Contraseña temporal usada',
              text: 'Debes cambiar tu contraseña antes de continuar.',
            }).then(() => {
              this.router.navigate(['/change-password']);
            });
            return;
          }

          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        }
        ,
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;

          console.error('Error en la autenticación:', error);

          // Obtener mensaje del backend
          const backendMessage =
            error?.error?.message ||
            error?.error?.error ||
            "Ups! Algo salió mal durante el inicio de sesión.";

          Swal.fire({
            title: 'Error',
            text: backendMessage,
            icon: 'error',
          });
        }

      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      // Marcar todos los campos como tocados para mostrar errores
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
      text: 'Ingrese su nombre de usuario para enviar una contraseña temporal',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'nombre de usuario'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
        if (!username) {
          Swal.showValidationMessage('El nombre de usuario es requerido');
          return false;
        }

        return this.loginService.recoverPassword(username).toPromise()
          .catch(() => {
            Swal.showValidationMessage('Error enviando la solicitud.');
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Solicitud enviada',
          text: 'Si el usuario existe, recibirá una contraseña temporal.',
          icon: 'success'
        });
      }
    });
  }
}

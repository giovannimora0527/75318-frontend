import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../usuario/models/usuario';

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
    private readonly authService: AuthService
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
          
          // Crear un objeto usuario básico con el username del login
          const usuario: Usuario = {
            id: 0,
            username: loginData.username,
            rol: 'USER', // Se puede obtener del token JWT si es necesario
            activo: true,
            email: '',
            fechaCreacion: new Date()
          };
          
          // Usar AuthService para guardar la sesión
          this.authService.login(response, usuario);
          
          this.isLoading = false;
          this.spinner.hide();
          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        },
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);
          
          // Extraer el mensaje de error del backend
          let mensajeError = 'Ups! Algo salió mal durante el inicio de sesión.';
          
          if (error?.error?.message) {
            mensajeError = error.error.message;
          } else if (error?.error?.mensaje) {
            mensajeError = error.error.mensaje;
          } else if (error?.message) {
            mensajeError = error.message;
          } else if (typeof error?.error === 'string') {
            mensajeError = error.error;
          }
          
          // Determinar el tipo de error para mostrar el icono apropiado
          let icono: 'error' | 'warning' | 'info' = 'error';
          if (mensajeError.toLowerCase().includes('bloqueado')) {
            icono = 'warning';
          }
          
          Swal.fire({
            title: icono === 'warning' ? 'Usuario Bloqueado' : 'Error',
            text: mensajeError,
            icon: icono,
            confirmButtonText: 'Entendido'
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
      text: 'Ingrese su nombre de usuario para recuperar su contraseña',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Nombre de usuario'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value || value.trim().length < 3) {
          return 'El nombre de usuario debe tener al menos 3 caracteres';
        }
        return null;
      },
      preConfirm: (username) => {
        return new Promise<boolean>((resolve, reject) => {
          this.loginService.recuperarContrasena(username.trim()).subscribe({
            next: (response) => {
              console.log('Solicitud de recuperación procesada:', response);
              resolve(true);
            },
            error: (error) => {
              console.error('Error al procesar solicitud de recuperación:', error);
              // Por seguridad, mostramos el mismo mensaje genérico
              resolve(true);
            }
          });
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Solicitud procesada',
          text: 'Si el usuario existe, se enviará un correo con las instrucciones de recuperación.',
          icon: 'success'
        });
      }
    });
  }
}

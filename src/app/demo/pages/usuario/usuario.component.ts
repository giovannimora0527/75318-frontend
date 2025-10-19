import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './models/usuario';
import { CommonModule } from '@angular/common';

<<<<<<< HEAD
// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

<<<<<<< HEAD
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
=======
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-usuario',
<<<<<<< HEAD
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
=======
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  mostrarPassword: boolean = false;
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  usuarios: Usuario[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  usuarioSelected: Usuario;
<<<<<<< HEAD
  titleSpinner: string = "Cargando...";
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3

  form: FormGroup;

  constructor(
    private readonly usuarioService: UsuarioService,
<<<<<<< HEAD
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {    
    this.listarUsuarios();
    this.inicializarFormulario();    
=======
    private readonly formBuilder: FormBuilder
  ) {
    this.listarUsuarios();
    this.inicializarFormulario();
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
<<<<<<< HEAD
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)], this.passwordAsyncValidator],
=======
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)], [this.passwordAsyncValidator]],
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      rol: ['', [Validators.required]],
      activo: [true]
    });
  }

  passwordAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const contrasenasProhibidas = ['123456', 'password', 'admin'];

    return of(contrasenasProhibidas.includes(control.value)).pipe(
      delay(800), // simulamos llamada a servidor
      map((invalida) => (invalida ? { passwordProhibida: true } : null))
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarUsuarios() {
<<<<<<< HEAD
    this.spinner.show();
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al listar usuarios', error);
        this.spinner.hide();
=======
    console.log('Listando Usuarios..');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log(this.usuarios);
      },
      error: (error) => {
        console.error('Error al listar usuarios', error);
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

<<<<<<< HEAD
  openModal(modo: string) {
=======
  openModal(modo: string) {    
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearUsuario');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoUsuario() {
    this.usuarioSelected = null;
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.openModal('E');
  }

  /**
   * Funcion que permite guardar/actualizar un usuario.
   */
  guardarUsuario() {
<<<<<<< HEAD
    this.titleSpinner = this.modoFormulario === 'C' ? "Creando usuario..." : "Actualizando usuario...";
    this.spinner.show();   
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
=======
    console.log(this.form.invalid);
    console.log(this.form);
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    } 
    if (this.form.invalid) {
      // Manejar el formulario inválido
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
<<<<<<< HEAD
        next: (data) => {          
          if (data.status === 200) {
            this.spinner.hide();
=======
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarUsuarios();
          } else {
<<<<<<< HEAD
            this.spinner.hide();
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
<<<<<<< HEAD
          this.spinner.hide();        
=======
          console.error('Error al guardar usuario', error);
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      // Modo Edición
      const usuarioActualizado: Usuario = this.form.getRawValue();
<<<<<<< HEAD
      usuarioActualizado.id = this.usuarioSelected.id;
      this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
        next: (data) => {       
          if (data.status === 200) {
            this.spinner.hide();
=======
      usuarioActualizado.id = this.usuarioSelected.id;   
      this.usuarioService.actualizarUsuario(usuarioActualizado).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarUsuarios();
          } else {
<<<<<<< HEAD
            this.spinner.hide();
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
<<<<<<< HEAD
          this.spinner.hide();          
=======
          console.error('Error al actualizar usuario', error);
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      username: this.usuarioSelected ? this.usuarioSelected.username : '',
      password: this.usuarioSelected ? this.usuarioSelected.password : '',
      rol: this.usuarioSelected ? this.usuarioSelected.rol : '',
      activo: this.usuarioSelected ? this.usuarioSelected.activo : false
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

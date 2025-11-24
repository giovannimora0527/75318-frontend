import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './models/usuario';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  usuarios: Usuario[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  usuarioSelected: Usuario | null = null;
  titleSpinner: string = "Cargando...";

  form: FormGroup;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {    
    this.inicializarFormulario();
    this.listarUsuarios();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      activo: [true],
      password: [''] // Solo obligatorio en creación
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarUsuarios() {
    this.spinner.show();
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => { this.usuarios = data; this.spinner.hide(); },
      error: (error) => { console.error(error); this.spinner.hide(); }
    });
  }

  openModal(modo: string) {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    const modalElement = document.getElementById('modalCrearUsuario');
    if (modalElement) this.modalInstance ??= new Modal(modalElement);
    this.modalInstance?.show();
  }

  abrirNuevoUsuario() {
    this.usuarioSelected = null;
    // Password obligatorio en creación
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.form.reset({ username: '', email: '', rol: '', activo: true, password: '' });
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.usuarioSelected = usuario;
    // No requerimos password en edición
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();

    this.form.patchValue({
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      password: ''
    });

    this.openModal('E');
  }

  guardarUsuario() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const datos = this.form.getRawValue();

    // --- CREACIÓN ---
    if (this.modoFormulario === 'C') {
      if (!datos.password || !datos.username || !datos.rol) {
        Swal.fire('Error', 'Username, rol y contraseña son obligatorios.', 'error');
        return;
      }
      datos.activo = true; // obligatorio en backend
      this.spinner.show();
      this.usuarioService.guardarUsuario(datos).subscribe({
        next: (resp) => {
          this.spinner.hide();
          Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
          this.closeModal();
          this.listarUsuarios();
        },
        error: (err) => {
          this.spinner.hide();
          Swal.fire('Error', err.error.message || 'Error al crear usuario', 'error');
        }
      });

    // --- EDICIÓN ---
    } else if (this.usuarioSelected) {
      datos.id = this.usuarioSelected.id;
      // Eliminar password si está vacío para no sobreescribir
      if (!datos.password) delete datos.password;

      this.spinner.show();
      this.usuarioService.actualizarUsuario(datos).subscribe({
        next: () => {
          this.spinner.hide();
          Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
          this.closeModal();
          this.listarUsuarios();
        },
        error: (err) => {
          this.spinner.hide();
          Swal.fire('Error', err.error.message || 'Error al actualizar usuario', 'error');
        }
      });
    }
  }

  closeModal() {
    this.modalInstance?.hide();
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.form.reset({
      username: this.usuarioSelected?.username || '',
      email: this.usuarioSelected?.email || '',
      rol: this.usuarioSelected?.rol || '',
      activo: this.usuarioSelected?.activo ?? true,
      password: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

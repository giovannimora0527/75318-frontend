import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent {
  especializaciones: Especializacion[] = [];
  especializacionesFiltradas: Especializacion[] = [];
  filtro = { codigoEspecializacion: '', nombre: '', descripcion: '' };

  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly especializacionService: EspecializacionService
  ) {
    this.inicializarFormulario();
    this.listarEspecializaciones();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      codigoEspecializacion: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  listarEspecializaciones(): void {
    this.cargando = true;
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializaciones = data || [];
        this.especializacionesFiltradas = [...this.especializaciones];
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar las especializaciones', 'error');
        this.cargando = false;
      }
    });
  }

  filtrarEspecializaciones(): void {
    this.especializacionesFiltradas = this.especializaciones.filter(e =>
      (!this.filtro.codigoEspecializacion || e.codigoEspecializacion.toLowerCase().includes(this.filtro.codigoEspecializacion.toLowerCase())) &&
      (!this.filtro.nombre || e.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase())) &&
      (!this.filtro.descripcion || e.descripcion.toLowerCase().includes(this.filtro.descripcion.toLowerCase()))
    );
  }

  abrirNueva(): void {
    this.form.reset();
    this.modoFormulario = 'C';
    this.titleModal = 'Nueva Especialización';
    this.titleBoton = 'Guardar';
    this.openModal();
  }

  abrirEditar(e: Especializacion): void {
    this.form.patchValue(e);
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Especialización';
    this.titleBoton = 'Actualizar';
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardar(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: Especializacion = { ...this.form.value };
    const obs = this.modoFormulario === 'C'
      ? this.especializacionService.guardarEspecializacion(payload)
      : this.especializacionService.actualizarEspecializacion(payload);

    this.cargando = true;
    obs.subscribe({
      next: () => {
        Swal.fire('Éxito', this.modoFormulario === 'E' ? 'Especialización actualizada con éxito' : 'Especialización guardada con éxito', 'success');
        this.closeModal();
        this.listarEspecializaciones();
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la especialización', 'error');
        this.cargando = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent {
  especializaciones: Especializacion[] = [];
  especializacionSeleccionada: Especializacion | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly especializacionService: EspecializacionService
  ) {
    this.inicializarFormulario();
    this.listarEspecializaciones();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      estado: ['Activa', Validators.required]
    });
  }

  listarEspecializaciones(): void {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => (this.especializaciones = data || []),
      error: () => Swal.fire('Error', 'No fue posible listar las especializaciones', 'error')
    });
  }

  abrirNuevaEspecializacion(): void {
    this.especializacionSeleccionada = null;
    this.titleModal = 'Nueva Especialización';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset({ estado: 'Activa' });
    this.openModal();
  }

  abrirEditarEspecializacion(e: Especializacion): void {
    this.especializacionSeleccionada = e;
    this.titleModal = 'Editar Especialización';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(e);
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

  guardarEspecializacion(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: Especializacion = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.especializacionService.guardarEspecializacion(payload)
        : this.especializacionService.actualizarEspecializacion({
            ...payload,
            id: this.especializacionSeleccionada?.id
          });

    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarEspecializaciones();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la especialización', 'error');
      }
    });
  }
}

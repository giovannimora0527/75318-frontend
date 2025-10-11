import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  citas: Cita[] = [];
  citaSeleccionada: Cita | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly citaService: CitaService
  ) {
    this.inicializarFormulario();
    this.listarCitas();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(200)]],
      observaciones: [''],
      idPaciente: [null, Validators.required],
      idMedico: [null, Validators.required],
      estado: ['Programada']
    });
  }

  get f() {
    return this.form.controls;
  }

  listarCitas(): void {
    this.citaService.listarCitas().subscribe({
      next: (data) => (this.citas = data || []),
      error: () =>
        Swal.fire('Error', 'No fue posible listar las citas', 'error')
    });
  }

  abrirNuevaCita(): void {
    this.citaSeleccionada = null;
    this.titleModal = 'Registrar Cita';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset({ estado: 'Programada' });
    this.openModal();
  }

  abrirEditarCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.titleModal = 'Editar Cita';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(cita);
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalCita');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  guardarCita(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: Cita = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.citaService.guardarCita(payload)
        : this.citaService.actualizarCita({
            ...payload,
            id: this.citaSeleccionada?.id
          });

    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarCitas();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la cita', 'error');
      }
    });
  }
}

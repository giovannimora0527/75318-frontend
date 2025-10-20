import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistoriaMedicaService } from './service/historia-medica.service';
import { HistoriaMedica } from './models/historia-medica';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historia-medica.component.html',
  styleUrls: ['./historia-medica.component.scss']
})
export class HistoriaMedicaComponent {
  historias: HistoriaMedica[] = [];
  historiaSeleccionada: HistoriaMedica | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly historiaService: HistoriaMedicaService
  ) {
    this.inicializarFormulario();
    this.listarHistorias();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      idPaciente: [null, Validators.required],
      idMedico: [null, Validators.required],
      fecha: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.maxLength(200)]],
      antecedentes: [''],
      diagnostico: ['', Validators.required],
      tratamiento: [''],
      observaciones: ['']
    });
  }

  listarHistorias(): void {
    this.historiaService.listarHistorias().subscribe({
      next: (data) => (this.historias = data || []),
      error: () => Swal.fire('Error', 'No fue posible listar las historias médicas', 'error')
    });
  }

  abrirNuevaHistoria(): void {
    this.historiaSeleccionada = null;
    this.titleModal = 'Nueva Historia Médica';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset();
    this.openModal();
  }

  abrirEditarHistoria(h: HistoriaMedica): void {
    this.historiaSeleccionada = h;
    this.titleModal = 'Editar Historia Médica';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(h);
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalHistoria');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarHistoria(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: HistoriaMedica = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.historiaService.guardarHistoria(payload)
        : this.historiaService.actualizarHistoria({
            ...payload,
            id: this.historiaSeleccionada?.id
          });

    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarHistorias();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la historia médica', 'error');
      }
    });
  }
}

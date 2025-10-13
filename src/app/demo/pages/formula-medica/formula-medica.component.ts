import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulaMedicaService } from './service/formula-medica.service';
import { FormulaMedica } from './models/formula-medica';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent {
  formulas: FormulaMedica[] = [];
  formulaSeleccionada: FormulaMedica | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly formulaService: FormulaMedicaService
  ) {
    this.inicializarFormulario();
    this.listarFormulas();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      idPaciente: [null, Validators.required],
      idMedico: [null, Validators.required],
      fecha: ['', Validators.required],
      diagnostico: ['', [Validators.required, Validators.maxLength(200)]],
      indicaciones: ['', Validators.required],
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required],
      duracion: ['', Validators.required]
    });
  }

  listarFormulas(): void {
    this.formulaService.listarFormulas().subscribe({
      next: (data) => (this.formulas = data || []),
      error: () => Swal.fire('Error', 'No fue posible listar las fórmulas', 'error')
    });
  }

  abrirNuevaFormula(): void {
    this.formulaSeleccionada = null;
    this.titleModal = 'Nueva Fórmula Médica';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset();
    this.openModal();
  }

  abrirEditarFormula(f: FormulaMedica): void {
    this.formulaSeleccionada = f;
    this.titleModal = 'Editar Fórmula Médica';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(f);
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarFormula(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: FormulaMedica = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.formulaService.guardarFormula(payload)
        : this.formulaService.actualizarFormula({
            ...payload,
            id: this.formulaSeleccionada?.id
          });

    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarFormulas();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la fórmula médica', 'error');
      }
    });
  }
}

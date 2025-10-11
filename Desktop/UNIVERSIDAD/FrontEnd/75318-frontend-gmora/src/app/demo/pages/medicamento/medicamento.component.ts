import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
import { RespuestaRs } from 'src/app/models/respuesta-rs'
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent {
  medicamentos: Medicamento[] = [];
  medicamentoSeleccionado: Medicamento | null = null;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  form: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      presentacion: [''],
      fechaCompra: [''],
      fechaVence: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos(): void {
    console.log('Listando medicamentos...');
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data || [];
      },
      error: (error) => {
        console.error('Error al listar medicamentos', error);
        Swal.fire('Error', 'No se pudo cargar la lista de medicamentos', 'error');
      }
    });
  }

  openModal(modo: 'C' | 'E'): void {
    this.titleModal = modo === 'C' ? 'Registrar Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  abrirNuevoMedicamento(): void {
    this.medicamentoSeleccionado = null;
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento): void {
    this.medicamentoSeleccionado = medicamento;
    this.form.patchValue(medicamento);
    this.openModal('E');
  }

  guardarMedicamento(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores del formulario.', 'error');
      return;
    }

    const payload: Medicamento = { ...this.form.value };

    if (this.modoFormulario === 'C') {
      this.medicamentoService.guardarMedicamento(payload).subscribe({
        next: (res: RespuestaRs) => {
          Swal.fire('Éxito', res.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al guardar medicamento', error);
          Swal.fire('Error', 'No se pudo guardar el medicamento.', 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.medicamentoSeleccionado) {
      payload.id = this.medicamentoSeleccionado.id;
      this.medicamentoService.actualizarMedicamento(payload).subscribe({
        next: (res: RespuestaRs) => {
          Swal.fire('Éxito', res.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al actualizar medicamento', error);
          Swal.fire('Error', 'No se pudo actualizar el medicamento.', 'error');
        }
      });
    }
  }

  limpiarFormulario(): void {
    this.form.reset({
      nombre: this.medicamentoSeleccionado ? this.medicamentoSeleccionado.nombre : '',
      descripcion: this.medicamentoSeleccionado ? this.medicamentoSeleccionado.descripcion : '',
      presentacion: this.medicamentoSeleccionado ? this.medicamentoSeleccionado.presentacion : '',
      fechaCompra: this.medicamentoSeleccionado ? this.medicamentoSeleccionado.fechaCompra : '',
      fechaVence: this.medicamentoSeleccionado ? this.medicamentoSeleccionado.fechaVence : ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

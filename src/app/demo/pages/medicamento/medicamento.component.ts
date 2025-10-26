import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';

import Swal from 'sweetalert2';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  medicamentoList: Medicamento[] = [];

  form: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      presentacion: ['', [Validators.required]],
      fechaCompra: ['', [Validators.required, Validators.minLength(4)]],
      fechaVence: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentoList = data;
      },
      error: (error) => {
        console.error('Error fetching medicamento list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
  this.medicamentoSelected = null;
  this.form.reset({ activo: true });
  this.openModal('C');
  }

  editarModalMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    console.log(medicamento);
    this.openModal('E');
  }

  guardarMedicamento() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando medicamento...' : 'Actualizando medicamento...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const medicamento = { ...this.form.getRawValue() };
medicamento.fechaCompra = medicamento.fechaCompra.split('T')[0]; // formato YYYY-MM-DD
medicamento.fechaVence = medicamento.fechaVence.split('T')[0]; // formato YYYY-MM-DD
delete medicamento.activo;


    if (this.modoFormulario === 'C') {
      // Crear     
      this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicamentos();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      // Actualizar      
      const medicamentoActualizado = { ...this.form.getRawValue(), id: this.medicamentoSelected.id };
console.log('🔄 Actualizando medicamento:', medicamentoActualizado);

  this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
    next: (data) => {
      this.spinner.hide();
      Swal.fire('Éxito', data.mensaje, 'success');
      this.closeModal();
      this.listarMedicamentos();
    },
    error: (error) => {
      this.spinner.hide();
      console.error('Error al actualizar medicamento:', error);
      Swal.fire('Error', error.error?.message || 'Error al actualizar', 'error');
    }
  });
}
  }
}

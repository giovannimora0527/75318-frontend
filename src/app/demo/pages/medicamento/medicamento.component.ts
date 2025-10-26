import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
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
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentosComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamentos: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento;

  form: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: [''],
      presentacion: [''],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    console.log('Listando Medicamentos..');
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;
        console.log(this.medicamentos);
      },
      error: (error) => {
        console.error('Error al listar medicamentos', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
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
      this.form.reset({
        nombre: '',
        descripcion: '',
        presentacion: '',
        fechaCompra: '',
        fechaVence: ''
      });
      this.openModal('C');
  }

  abrirEditarMedicamento(m: Medicamento) {
    this.medicamentoSelected = m;
    // patch form with existing values (format dates for date inputs)
    const formatDate = (d: string | Date | null | undefined) => {
      if (!d) return '';
      const date = new Date(d);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    this.form.patchValue({
      nombre: m.nombre || '',
      descripcion: m.descripcion || '',
      presentacion: m.presentacion || '',
      fechaCompra: formatDate(m.fechaCompra),
      fechaVence: formatDate(m.fechaVence)
    });

    this.openModal('E');
  }

  guardarMedicamento() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicamentos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al guardar medicamento', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      // Modo Edición
      const medicamentoActualizado: Medicamento = this.form.getRawValue();
      medicamentoActualizado.id = this.medicamentoSelected.id;
      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicamentos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al actualizar medicamento', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: this.medicamentoSelected ? this.medicamentoSelected.nombre : '',
      descripcion: this.medicamentoSelected ? this.medicamentoSelected.descripcion : '',
      presentacion: this.medicamentoSelected ? this.medicamentoSelected.presentacion : '',
      fechaCompra: this.medicamentoSelected ? this.medicamentoSelected.fechaCompra : '',
      fechaVence: this.medicamentoSelected ? this.medicamentoSelected.fechaVence : ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

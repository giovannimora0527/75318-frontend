import { Component } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';

// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  especializaciones: Especializacion[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion;
  titleSpinner: string = "Cargando...";

  form: FormGroup;

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarEspecializaciones();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      codigoEspecializacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarEspecializaciones() {
    this.spinner.show();
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializaciones = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al listar especializaciones', error);
        this.spinner.hide();
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
    this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
    this.titleBoton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoEspecializacion() {
    this.especializacionSelected = null;
    this.openModal('C');
  }

  abrirEditarEspecializacion(especializacion: Especializacion) {
    this.especializacionSelected = especializacion;
    this.openModal('E');
  }

  /**
   * Funcion que permite guardar/actualizar una especialización.
   */
  guardarEspecializacion() {
    this.titleSpinner = this.modoFormulario === 'C' ? "Creando especialización..." : "Actualizando especialización...";
    this.spinner.show();
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.especializacionService.guardarEspecializacion(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarEspecializaciones();
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
      // Modo Edición
      const especializacionActualizada: Especializacion = this.form.getRawValue();
      especializacionActualizada.id = this.especializacionSelected.id;
      this.especializacionService.actualizarEspecializacion(especializacionActualizada).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarEspecializaciones();
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
    }
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: this.especializacionSelected ? this.especializacionSelected.nombre : '',
      descripcion: this.especializacionSelected ? this.especializacionSelected.descripcion : '',
      codigoEspecializacion: this.especializacionSelected ? this.especializacionSelected.codigoEspecializacion : '',
      activo: this.especializacionSelected ? this.especializacionSelected.activo : false
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

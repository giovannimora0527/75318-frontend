import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Especializacion } from './models/especializacion';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];

  form: FormGroup;

  constructor(
    private readonly medicoService: MedicoService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(4)]],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      registroProfesional: ['', [Validators.required]],
      especializacion: ['', [Validators.required]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarEspecializaciones() {
    this.utilApiService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data;
      },
      error: (error) => {
        console.error('Error fetching especializaciones:', error);
      }
    });
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error fetching medico list:', error);
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
    this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
    this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.patchValue({
      tipoDocumento: '',
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      registroProfesional: '',
      especializacion: '',
      activo: true
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    console.log(medico);
    this.cargarDatosEnFormulario(medico);
    this.openModal('E');
  }

  cargarDatosEnFormulario(medico: Medico) {
    this.form.patchValue({
      tipoDocumento: medico.tipoDocumento || '',
      documento: medico.documento || '',
      nombres: medico.nombres || '',
      apellidos: medico.apellidos || '',
      telefono: medico.telefono || '',
      registroProfesional: medico.registroProfesional || '',
      especializacion: medico.especializacion?.id || ''
    });
  }

  guardarMedico() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando médico...' : 'Actualizando médico...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear
      const formData = this.form.getRawValue();
      if (!formData.especializacion) {
        this.spinner.hide();
        Swal.fire('Error', 'La especialización es obligatoria', 'error');
        return;
      }
      
      const medicoNuevo: any = {
        tipoDocumento: formData.tipoDocumento,
        documento: formData.documento,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        registroProfesional: formData.registroProfesional,
        especializacion: parseInt(formData.especializacion, 10)
      };
      
      this.medicoService.guardarMedico(medicoNuevo).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          const errorMessage = error.error?.message || error.error?.mensaje || error.message || 'Error al guardar el médico';
          Swal.fire('Error', errorMessage, 'error');
        }
      });
    } else {
      // Actualizar
      const formData = this.form.getRawValue();
      if (!formData.especializacion) {
        this.spinner.hide();
        Swal.fire('Error', 'La especialización es obligatoria', 'error');
        return;
      }
      
      const medicoActualizado: any = {
        id: parseInt(this.medicoSelected.id.toString(), 10),
        tipoDocumento: formData.tipoDocumento,
        documento: formData.documento,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        registroProfesional: formData.registroProfesional,
        especializacion: parseInt(formData.especializacion, 10)
      };
      
      this.medicoService.actualizarMedico(medicoActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          const errorMessage = error.error?.message || error.error?.mensaje || error.message || 'Error al actualizar el médico';
          Swal.fire('Error', errorMessage, 'error');
        }
      });
    }
  }
}

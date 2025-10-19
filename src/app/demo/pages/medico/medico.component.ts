import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
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
=======

// Importa los objetos necesarios de Bootstrap
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
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
<<<<<<< HEAD
  titleSpinner: string = 'Cargando...';
=======

  form: FormGroup;
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3

  /**
   * Variables para la tabla de datos o datatable.
   */
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];

<<<<<<< HEAD
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

=======
  constructor(private readonly medicoService: MedicoService,
    private readonly utilApiService: UtilApiService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarMedicos();
    this.listarEspecializaciones();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      registroProfesional: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      especializacionId: ['', [Validators.required]]
    });
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   */
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarEspecializaciones() {
<<<<<<< HEAD
    this.utilApiService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data;
      },
      error: (error) => {
        console.error('Error fetching especializaciones:', error);
      }
    });
=======
    this.utilApiService.listarEspecializaciones().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.especializacionList = data;
        },
        error: (error) => {
          console.error('Error fetching especializaciones:', error);
          Swal.fire('Error', 'No se pudieron cargar las especializaciones', 'error');
        }
      }
    );
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
<<<<<<< HEAD
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error fetching medico list:', error);
=======
        this.medicoList = data;        
      },
      error: (error) => {
        console.error('Error fetching medico list:', error);
        Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
<<<<<<< HEAD
=======
    this.limpiarFormulario();
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
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
<<<<<<< HEAD
=======
    this.limpiarFormulario();
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
    this.openModal('C');
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    console.log(medico);
<<<<<<< HEAD
    this.openModal('E');
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
      this.medicoService.guardarMedico(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
=======
    this.cargarDatosFormulario(medico);
    this.openModal('E');
  }

  cargarDatosFormulario(medico: Medico) {
    this.form.patchValue({
      tipoDocumento: medico.tipoDocumento,
      documento: medico.documento,
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      telefono: medico.telefono,
      registroProfesional: medico.registroProfesional,
      especializacionId: medico.especializacion?.id || ''
    });
  }

  guardarMedico() {
    // Validar formulario
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      this.form.markAllAsTouched();
      return;
    }

    const medicoData: Medico = {
      ...this.form.getRawValue(),
      id: this.medicoSelected?.id || 0
    };

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.medicoService.guardarMedico(medicoData).subscribe({
        next: (data) => {
          if (data.status === 200) {
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
<<<<<<< HEAD
            this.spinner.hide();
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
<<<<<<< HEAD
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      // Actualizar      
      const usuarioActualizado: Medico = this.form.getRawValue();
      usuarioActualizado.id = this.medicoSelected.id;
      this.medicoService.actualizarMedico(usuarioActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
=======
          console.error('Error al guardar médico:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo guardar el médico', 'error');
        }
      });
    } else {
      // Modo Edición
      this.medicoService.actualizarMedico(medicoData).subscribe({
        next: (data) => {
          if (data.status === 200) {
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
<<<<<<< HEAD
            this.spinner.hide();
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
<<<<<<< HEAD
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
=======
          console.error('Error al actualizar médico:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo actualizar el médico', 'error');
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
        }
      });
    }
  }
<<<<<<< HEAD
}
=======

  limpiarFormulario() {
    this.form.reset({
      tipoDocumento: '',
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      registroProfesional: '',
      especializacionId: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3

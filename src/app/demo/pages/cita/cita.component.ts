import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';

import Swal from 'sweetalert2';
import { Cita } from './models/cita';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';
import { CitaService } from './service/cita.service';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  citaSelected: Cita;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  citaList: Cita[] = [];
  pacienteList: Paciente[] = [];
  medicoList: Medico[] = [];
  form: FormGroup;

  constructor(
    private readonly citaService: CitaService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarCitas();
    this.listarPacientes();
    this.listarMedicos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      paciente: ['', [Validators.required]],
      medico: ['', [Validators.required]],
      fechaHora: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      motivo: ['', [Validators.required]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.utilApiService.listarPacientes().subscribe({
      next: (data) => {
        this.pacienteList = data;
      },
      error: (error) => {
        console.error('Error fetching pacientes:', error);
      }
    });
  }

    listarMedicos() {
    this.utilApiService.listarMedicos().subscribe({
      next: (data) => {
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.citaList = data;
      },
      error: (error) => {
        console.error('Error fetching cita list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Cita' : 'Editar Cita';
    this.titleBoton = modo === 'C' ? 'Guardar Cita' : 'Actualizar Cita';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearCita');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoCita() {
    this.citaSelected = null;
    this.openModal('C');
  }

  editarModalCita(cita: Cita) {
    this.citaSelected = cita;
    console.log(cita);
    this.openModal('E');
  }

  guardarCita() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando cita...' : 'Actualizando cita...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear     
      this.citaService.guardarCita(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarCitas();
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
      const usuarioActualizado: Cita = this.form.getRawValue();
      usuarioActualizado.id = this.citaSelected.id;
      this.citaService.actualizarCita(usuarioActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarCitas();
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
}

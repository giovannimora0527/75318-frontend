import { Component } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
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
//import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  pacientes: Paciente[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente;

  form: FormGroup;

    constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarPacientes();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    console.log('Listando Pacientes...');
    this.pacienteService.listarPaciente().subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('Pacientes:', this.pacientes);
      },
      error: (error) => {
        console.error('Error al listar pacientes', error);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
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
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.cargarDatosFormulario(paciente);
    this.openModal('E');
  }

  /**
   * Carga los datos del paciente en el formulario para edición
   */
  cargarDatosFormulario(paciente: Paciente) {
    this.form.patchValue({
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion
    });
  }

  /**
   * Funcion que permite guardar/actualizar un paciente.
   */
  guardarPaciente() {
    console.log('Formulario válido:', !this.form.invalid);
    console.log('Datos del formulario:', this.form.value);
    
    if (this.form.invalid) {
      // Manejar el formulario inválido
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return;
    }

    if (this.modoFormulario === 'C') {
      // Modo Creación
      const pacienteNuevo: Paciente = this.form.getRawValue();
      
      this.pacienteService.guardarPaciente(pacienteNuevo).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarPacientes();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al guardar paciente', error);
          Swal.fire('Error', error.error?.message || 'Error al guardar el paciente', 'error');
        }
      });
    } else {
      // Modo Edición
      const pacienteActualizado: Paciente = this.form.getRawValue();
      pacienteActualizado.id = this.pacienteSelected!.id;
      
      this.pacienteService.actualizarPaciente(pacienteActualizado).subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarPacientes();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al actualizar paciente', error);
          Swal.fire('Error', error.error?.message || 'Error al actualizar el paciente', 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

import { Component } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente, PacienteRq } from './models/paciente';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente | null = null;
  pacienteList: Paciente[] = [];
  pacienteListOriginal: Paciente[] = []; // Lista original sin filtrar
  
  form: FormGroup;
  
  // Filtros
  filtros = {
    id: '',
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    direccion: '',
    genero: '',
    estado: ''
  };

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarPacientes();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6)]],
      tipoDocumento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      usuarioId: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacienteList = data;
        this.pacienteListOriginal = [...data]; // Guardar copia original
        console.log('Pacientes cargados:', data);
      },
      error: (error) => {
        console.error('Error al obtener pacientes:', error);
        Swal.fire('Error', 'Error al cargar los pacientes', 'error');
      }
    });
  }



  // Métodos de filtrado
  aplicarFiltros() {
    this.pacienteList = this.pacienteListOriginal.filter(paciente => {
      return (
        this.filtrarPorCampo(paciente.id?.toString(), this.filtros.id) &&
        this.filtrarPorCampo(paciente.tipoDocumento, this.filtros.tipoDocumento) &&
        this.filtrarPorCampo(paciente.numeroDocumento, this.filtros.numeroDocumento) &&
        this.filtrarPorCampo(paciente.nombres, this.filtros.nombres) &&
        this.filtrarPorCampo(paciente.apellidos, this.filtros.apellidos) &&
        this.filtrarPorCampo(paciente.telefono, this.filtros.telefono) &&
        this.filtrarPorCampo(paciente.email, this.filtros.email) &&
        this.filtrarPorCampo(paciente.fechaNacimiento, this.filtros.fechaNacimiento) &&
        this.filtrarPorCampo(paciente.direccion, this.filtros.direccion) &&
        this.filtrarPorCampo(paciente.genero, this.filtros.genero) &&
        this.filtrarPorEstado(paciente.activo, this.filtros.estado)
      );
    });
  }

  filtrarPorCampo(valor: string, filtro: string): boolean {
    if (!filtro) return true;
    return valor?.toLowerCase().includes(filtro.toLowerCase()) || false;
  }

  filtrarPorEstado(activo: boolean, estadoFiltro: string): boolean {
    if (!estadoFiltro) return true;
    if (estadoFiltro === 'activo') return activo;
    if (estadoFiltro === 'inactivo') return !activo;
    return true;
  }

  limpiarFiltros() {
    this.filtros = {
      id: '',
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      direccion: '',
      genero: '',
      estado: ''
    };
    this.pacienteList = [...this.pacienteListOriginal];
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  editarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.cargarDatosEnFormulario(paciente);
    this.openModal('E');
  }

  cargarDatosEnFormulario(paciente: Paciente) {
    this.form.patchValue({
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      numeroDocumento: paciente.numeroDocumento,
      tipoDocumento: paciente.tipoDocumento,
      telefono: paciente.telefono,
      email: paciente.email,
      fechaNacimiento: paciente.fechaNacimiento,
      direccion: paciente.direccion,
      genero: paciente.genero,
      usuarioId: paciente.usuarioId
    });
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.patchValue({ usuarioId: 1 }); // Resetear usuarioId a 1
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }


  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  guardarPaciente() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const pacienteData: PacienteRq = this.form.getRawValue();
    console.log('Datos del paciente a enviar:', pacienteData);

    if (this.modoFormulario === 'C') {
      this.pacienteService.guardarPaciente(pacienteData).subscribe({
        next: (data) => {
          console.log('Paciente creado:', data);
          Swal.fire('Éxito', 'Paciente creado correctamente', 'success');
          this.closeModal();
          this.listarPacientes();
        },
        error: (error) => {
          console.error('Error al crear paciente:', error);
          console.error('Detalles del error:', error.error);
          Swal.fire('Error', `Error al crear el paciente: ${error.error?.message || error.message}`, 'error');
        }
      });
    } else {
      this.pacienteService.actualizarPaciente(this.pacienteSelected!.id, pacienteData).subscribe({
        next: (data) => {
          console.log('Paciente actualizado:', data);
          Swal.fire('Éxito', 'Paciente actualizado correctamente', 'success');
          this.closeModal();
          this.listarPacientes();
        },
        error: (error) => {
          console.error('Error al actualizar paciente:', error);
          console.error('Detalles del error:', error.error);
          Swal.fire('Error', `Error al actualizar el paciente: ${error.error?.message || error.message}`, 'error');
        }
      });
    }
  }

  buscarPorDocumento() {
    const numeroDocumento = prompt('Ingrese el número de documento:');
    if (numeroDocumento) {
      this.pacienteService.encontrarPorDocumento(numeroDocumento).subscribe({
        next: (data) => {
          console.log('Paciente encontrado:', data);
          Swal.fire('Paciente encontrado', `Paciente: ${data.nombres} ${data.apellidos}`, 'success');
        },
        error: (error) => {
          console.error('Error al buscar paciente:', error);
          Swal.fire('Error', 'No se encontró el paciente', 'error');
        }
      });
    }
  }

  listarPorFechaNacimiento(orden: string) {
    this.pacienteService.listarPacientesPorFechaNacimiento(orden).subscribe({
      next: (data) => {
        this.pacienteList = data;
        this.pacienteListOriginal = [...data];
        console.log(`Pacientes ordenados por fecha (${orden}):`, data);
        Swal.fire('Ordenado', `Pacientes ordenados por fecha de nacimiento (${orden})`, 'success');
      },
      error: (error) => {
        console.error('Error al ordenar pacientes:', error);
        Swal.fire('Error', 'Error al ordenar pacientes', 'error');
      }
    });
  }
}
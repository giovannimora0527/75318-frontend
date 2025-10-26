import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import Swal from 'sweetalert2';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import Modal from 'bootstrap/js/dist/modal';



@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  pacienteList: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  filtros: any = {};


  form: FormGroup;

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarPacientes();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(4)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.pacienteService.listarPaciente().subscribe({
      next: (data) => {
        this.pacienteList = data;
        this.filteredPacientes = data;
      },
      error: (error) => {
        console.error('Error fetching paciente list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
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
    this.openModal('C');
  }

  editarModalPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    console.log(paciente);
    this.openModal('E');
  }

  guardarPaciente() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando paciente...' : 'Actualizando paciente...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear     
      this.pacienteService.guardarPaciente(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarPacientes();
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
      const usuarioActualizado: Paciente = this.form.getRawValue();
      usuarioActualizado.id = this.pacienteSelected.id;
      this.pacienteService.actualizarPaciente(usuarioActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarPacientes();
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
  filtrar(columna: string, valor: string) {
      this.filtros[columna] = valor.toLowerCase(); // guardar filtro

      this.filteredPacientes = this.pacienteList.filter((p) => {
        return Object.keys(this.filtros).every((key) => {
          const filtroValor = this.filtros[key];
          if (!filtroValor) return true; // si el campo está vacío, no filtra
          const campo = p[key]?.toString().toLowerCase() || '';
          return campo.includes(filtroValor);
        });
      });
    }
}


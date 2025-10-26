  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
  import { FiltroPacientesPipe } from './filtro-pacientes.pipe';

  // Importa los objetos necesarios de Bootstrap
  import Modal from 'bootstrap/js/dist/modal';
  import { UtilApiService } from 'src/app/services/common/util-api.service';

  import Swal from 'sweetalert2';
  import { Usuario } from 'src/app/models/usuario';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { Medicamento } from '../medicamento/models/medicamento';

  @Component({
    selector: 'app-paciente',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, FiltroPacientesPipe],
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
    usuarioList: Usuario[] = [];

    form: FormGroup;

    constructor(
      private readonly pacienteService: PacienteService,
      private readonly formBuilder: FormBuilder,
      private readonly utilApiService: UtilApiService,
      private readonly spinner: NgxSpinnerService
    ) {
      this.listarPacientes();
      this.listarUsuarios();
      this.inicializarFormulario();
    }

    inicializarFormulario() {
      this.form = this.formBuilder.group({
        tipoDocumento: ['', [Validators.required]],
        numeroDocumento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
        nombres: ['', [Validators.required, Validators.minLength(3)]],
        apellidos: ['', [Validators.required, Validators.minLength(4)]],
        telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
        genero: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        usuario: ['', [Validators.required]],
        activo: [true]
      });
    }

    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }

    listarUsuarios() {
      this.utilApiService.listarUsuarios().subscribe({
        next: (data) => {
          this.usuarioList = data;
        },
        error: (error) => {
          console.error('Error fetching usuarios:', error);
        }
      });
    }

    listarPacientes() {
      this.pacienteService.listarPacientes().subscribe({
        next: (data) => {
          this.pacienteList = data;
          this.pacienteListFiltrada = [...this.pacienteList]; // copia inicial

        },
        error: (error) => {
          console.error('Error fetching paciente list:', error);
        }
      });
    }

      filtros = {
        id: '',
        tipoDocumento: '',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        genero: '',
        usuario: '',
        fechaNacimiento: '',
        direccion: ''
};

pacienteListFiltrada: Paciente[] = [];


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
      this.form.reset(); // Limpia los valores anteriores
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
        this.spinner.hide();
        Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
  }

        // ✅ Preparar correctamente el objeto antes de enviarlo
const paciente = { ...this.form.getRawValue() };
paciente.usuario = {id: Number(paciente.usuario)};
paciente.fechaNacimiento = paciente.fechaNacimiento.split('T')[0]; // formato YYYY-MM-DD
delete paciente.activo;

console.log('🧩 Formulario actual:', this.form.value);
const medicamento = { ...this.form.getRawValue() };
console.log('📤 JSON ENVIADO AL BACKEND:', JSON.stringify(medicamento, null, 2));

      
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
  }


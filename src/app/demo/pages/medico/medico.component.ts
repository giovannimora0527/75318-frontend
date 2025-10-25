import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl,FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Especializacion } from "src/app/demo/pages/especializacion/models/especializacion";

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

  form: FormGroup = new FormGroup({
    tipoDocumento: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    telefono: new FormControl(''),
    registroProfesional: new FormControl('', Validators.required),
    especializacionId: new FormControl(null, Validators.required)
  });

  constructor(
    private readonly medicoService: MedicoService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
    this.inicializarFormulario();
    this.titleSpinner = "Cargando";
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(4)]],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      registroProfesional: ['', [Validators.required]],
      especializacionId: [null, [Validators.required]]
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
    this.medicoSelected = new Medico();
    this.openModal('C');
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    console.log(medico);
    this.openModal('E');
  }

  guardarMedico() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando médico...' : 'Actualizando médico...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear     
      this.medicoService.guardarMedico(this.form.getRawValue()).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.listarMedicos();
          this.closeModal();
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      // Editar médico
      const medicoActualizado = { ...this.medicoSelected, ...this.form.getRawValue() };      
      this.medicoService.actualizarMedico(medicoActualizado).subscribe({
        next: (data) => { 
          Swal.fire('Éxito', data.mensaje, 'success');
          this.listarMedicos();
          this.closeModal();
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error updating medico:', error);
          Swal.fire("Error", error.error.message, "error");
          this.spinner.hide();
        }
      });
    }
  }
}

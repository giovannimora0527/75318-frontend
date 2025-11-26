import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
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

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;
  titleSpinner: string = 'Cargando...';

  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];

  form: FormGroup;

  rol: string = '';
  isAdmin: boolean = false;

  constructor(
    private readonly medicoService: MedicoService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {

    // 👌 Cargar rol correctamente
    this.rol = localStorage.getItem('rol');
    this.isAdmin = this.rol === 'ADMIN';

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
      next: data => this.especializacionList = data,
      error: err => console.error(err)
    });
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: data => this.medicoList = data,
      error: err => console.error(err)
    });
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
    this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = null;
    this.openModal('C');
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    this.form.patchValue(medico);
    this.openModal('E');
  }

  guardarMedico() {
    this.spinner.show();

    if (this.form.invalid) {
      this.spinner.hide();
      Swal.fire('Error', 'Corrige el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      this.medicoService.guardarMedico(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicos();
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
        }
      });

    } else {
      const medicoActualizado = {
        ...this.form.getRawValue(),
        id: this.medicoSelected.id
      };

      this.medicoService.actualizarMedico(medicoActualizado).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicos();
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }
}

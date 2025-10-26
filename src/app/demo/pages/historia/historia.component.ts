import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { UtilApiService } from 'src/app/services/common/util-api.service';
import { HistoriaService } from './service/historia.service';
import { Historia } from './models/historia';
import { Paciente } from '../paciente/models/paciente';

@Component({
  selector: 'app-historia',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  historiaSelected: Historia = {} as Historia;
  titleSpinner: string = 'Cargando...';

  historiaList: Historia[] = [];
  pacienteList: Paciente[] = [];
  form: FormGroup;

  constructor(
    private readonly historiaService: HistoriaService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarHistorias();
    this.listarPacientes();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      paciente: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      fecha: ['', Validators.required] // aquí solo required
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.utilApiService.listarPacientes().subscribe({
      next: (data) => this.pacienteList = data,
      error: (error) => console.error('Error fetching pacientes:', error)
    });
  }

  listarHistorias() {
    this.historiaService.listarHistorias().subscribe({
      next: (data) => this.historiaList = data,
      error: (error) => console.error('Error fetching historias:', error)
    });
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Historia' : 'Editar Historia';
    this.titleBoton = modo === 'C' ? 'Guardar Historia' : 'Actualizar Historia';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearHistoria');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
  }

  abrirNuevoHistoria() {
    this.historiaSelected = {} as Historia;
    this.form.reset();
    this.openModal('C');
  }

  editarModalHistoria(historia: Historia) {
    this.historiaSelected = historia;
    this.form.patchValue({
      paciente: historia.paciente?.id,
      descripcion: historia.descripcion,
      fecha: historia.fecha
    });
    this.openModal('E');
  }

  guardarHistoria() {
    this.spinner.show();
    if (this.form.invalid) {
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const formValues = this.form.getRawValue();

    // Formatear fecha correctamente
    let fechaFormateada = '';
    if (formValues.fecha) {
      if (typeof formValues.fecha === 'string') {
        fechaFormateada = formValues.fecha.includes('T') ? formValues.fecha.split('T')[0] : formValues.fecha;
      } else if (formValues.fecha instanceof Date) {
        fechaFormateada = formValues.fecha.toISOString().split('T')[0];
      }
    }

    const historia: Historia = {
      id: this.historiaSelected?.id ?? null,
      paciente: formValues.paciente,
      descripcion: formValues.descripcion,
      fecha: fechaFormateada ? new Date(fechaFormateada) : new Date() // Convertir string a Date
    };

    console.log('Historia a enviar:', JSON.stringify(historia, null, 2));

    if (this.modoFormulario === 'C') {
      this.historiaService.guardarHistoria(historia).subscribe({
        next: (data) => {
          this.spinner.hide();
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarHistorias();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error?.message || 'Error al guardar historia', 'error');
        }
      });
    } else {
      historia.id = Number(this.historiaSelected.id);
      this.historiaService.actualizarHistoria(historia).subscribe({
        next: (data) => {
          this.spinner.hide();
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarHistorias();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error?.message || 'Error al actualizar historia', 'error');
        }
      });
    }
  }
}

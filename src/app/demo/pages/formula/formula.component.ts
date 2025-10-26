import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';

import Swal from 'sweetalert2';
import { Formula } from './models/formula';
import { Cita } from '../cita/models/cita';
import { Medicamento } from '../medicamento/models/medicamento';
import { FormulaService } from './service/formula.service';


@Component({
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  formulaList: Formula[] = [];
  citaList: Cita[] = [];
  medicamentoList: Medicamento[] = [];
  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarFormulas();
    this.listarCitas();
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      cita: ['', [Validators.required]],
      medicamento: ['', [Validators.required]],
      dosis: ['', [Validators.required]],
      indicaciones: ['', [Validators.required]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarCitas() {
    this.utilApiService.listarCitas().subscribe({
      next: (data) => {
        this.citaList = data;
      },
      error: (error) => {
        console.error('Error fetching citas:', error);
      }
    });
  }

    listarMedicamentos() {
    this.utilApiService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentoList = data;
      },
      error: (error) => {
        console.error('Error fetching medicamentos:', error);
      }
    });
  }

  listarFormulas() {
    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulaList = data;
      },
      error: (error) => {
        console.error('Error fetching formula list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula' : 'Editar Formula';
    this.titleBoton = modo === 'C' ? 'Guardar Formula' : 'Actualizar Formula';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoFormula() {
    this.formulaSelected = null;
    this.form.reset( ); // Limpia los valores anteriores
    this.openModal('C');
  }

editarModalFormula(formula: Formula) {
  this.formulaSelected = formula;

  // Llenar formulario
  this.form.patchValue({
    cita: formula.cita?.id,         // si cita es un objeto
    medicamento: formula.medicamento?.id, // si medicamento es un objeto
    dosis: formula.dosis,
    indicaciones: formula.indicaciones
  });

  this.openModal('E');
}


  guardarFormula() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando formula...' : 'Actualizando formula...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear     
      this.formulaService.guardarFormula(this.form.getRawValue()).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarFormulas();
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
      const usuarioActualizado: Formula = this.form.getRawValue();
      usuarioActualizado.id = this.formulaSelected.id;
      this.formulaService.actualizarFormula(usuarioActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarFormulas();
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


import { Component } from '@angular/core';
import { FormulaService } from './service/formula.service';
import { Formula } from './models/formula';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Cita } from './models/cita';
import { Medicamento } from './models/medicamento';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
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
    FormulaList: Formula[] = [];
    citaList: Cita[] = [];
    medicamentoList: Medicamento[] = [];
  
    form: FormGroup;
  medicoSelected: null;
  medicoService: any;
  
    constructor(
      private readonly formulaService: FormulaService,
      private readonly formBuilder: FormBuilder,
      private readonly utilApiService: UtilApiService,
      private readonly spinner: NgxSpinnerService
    ) {
      this.listarFormula();
      this.listarCitas();
      this.listarMedicamentos();
      this.inicializarFormulario();
    }
  
    inicializarFormulario() {
      this.form = this.formBuilder.group({
        cita_id: ['', [Validators.required]],
        medicamento_id: ['', [Validators.required]],
        dosis: ['', [Validators.required, Validators.minLength(3)]],
        indicaciones: ['', [Validators.required, Validators.minLength(4)]],
      });
    }
  
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  
    listarCitas() {
      this.formulaService.listarCitas().subscribe({
        next: (data) => {
          this.citaList = data;
        },
        error: (error) => {
          console.error('Error fetching citas:', error);
        }
      });
    }
  
    listarFormula() {
      this.formulaService.listarFormulas().subscribe({
        next: (data) => {
          this.FormulaList = data;
        },
        error: (error) => {
          console.error('Error fetching formula list:', error);
        }
      });
    }

    listarMedicamentos() {
      this.formulaService.listarMedicamentos().subscribe({
        next: (data) => {
          this.medicamentoList = data;
        },
        error: (error) => {
          console.error('Error fetching medicamento list:', error);
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
      this.openModal('C');
    }
  
    editarModalFormula(formula: Formula) {
      this.formulaSelected = formula;
      console.log(formula);
      this.openModal('E');
    }

    guardarFormula() {
      this.titleSpinner = this.modoFormulario === 'C' ? 'Creando formula...' : 'Actualizando f...';
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
              this.listarMedicos();
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
        const formulaActualizada: Formula = this.form.getRawValue();
        formulaActualizada.id = this.formulaSelected.id;
        this.formulaService.actualizarFormula(formulaActualizada).subscribe({
          next: (data) => {
            if (data.status === 200) {
              this.spinner.hide();
              Swal.fire('Éxito', data.mensaje, 'success');
              this.closeModal();
              this.listarMedicos();
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
  listarMedicos() {
    throw new Error('Method not implemented.');
  }

  
}

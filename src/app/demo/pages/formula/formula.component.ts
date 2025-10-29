import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';
import { PacienteService } from '../paciente/service/paciente.service';
import { Paciente } from '../paciente/models/paciente';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  mostrarPassword: boolean = false;
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';
  busqueda: string = "";
  pacienteEncontrado: Paciente;

  formulaList: Formula[] = [];
  formulaFiltered: Formula[] = [];

  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarFormulas();
    this.buscarPacientePorDocumento("100000001");
  }

  buscarPacientePorDocumento(documento: string) {
    this.pacienteService.buscarPacientePorDocumento(documento).subscribe({
      next: (data) => {
        console.log('Paciente encontrado:', data);  
        this.pacienteEncontrado = data;
      },
      error: (error) => {
        console.error('Error al buscar paciente:', error);
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required]],
      indicaciones: ['', [Validators.required]]
    });
  }

  listarFormulas() {
    this.spinner.show();
    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulaList = data;
        this.formulaFiltered = this.formulaList;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();      
        Swal.fire('Error', error.error.mesage, 'error');
      }
    });

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
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

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.openModal('E');
  }

  limpiarFormulario() {    
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  filtrarFormula() {   
    if (this.busqueda === '') {
      this.formulaFiltered = this.formulaList;
      return;
    }
    this.formulaFiltered = this.formulaList.filter((formula) => {
      const busquedaLower = this.busqueda.toLowerCase();

      // Filtrar por dosis
      const dosisCumple = formula.dosis && formula.dosis.toLowerCase().includes(busquedaLower);

      // Filtrar por indicaciones
      const indicacionesCumple = formula.indicaciones && formula.indicaciones.toLowerCase().includes(busquedaLower);

      // Filtrar por número de documento del paciente
      const numeroDocumentoCumple =
        formula.cita?.paciente?.numeroDocumento && formula.cita.paciente.numeroDocumento.toLowerCase().includes(busquedaLower);

      // Filtrar por nombres del paciente
      const nombresCumple = formula.cita?.paciente?.nombres && formula.cita.paciente.nombres.toLowerCase().includes(busquedaLower);

      // Filtrar por apellidos del paciente
      const apellidosCumple = formula.cita?.paciente?.apellidos && formula.cita.paciente.apellidos.toLowerCase().includes(busquedaLower);

      // Filtrar por apellidos del paciente
      const fechasCumple = formula.cita?.fechaHora && formula.cita.fechaHora.toLowerCase().includes(busquedaLower);


      // Retorna true si cualquiera de los criterios se cumple
      return dosisCumple || indicacionesCumple || numeroDocumentoCumple || nombresCumple || apellidosCumple || fechasCumple;
    });
  }

  guardarFormula() {

  }
}

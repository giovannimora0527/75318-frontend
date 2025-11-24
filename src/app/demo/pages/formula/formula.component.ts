import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';
import { PacienteService } from '../paciente/service/paciente.service';
import { Paciente } from '../paciente/models/paciente';
import { CitaService } from '../cita/service/cita.service';
import { Cita } from '../cita/models/cita';
import { MedicoService } from '../medico/service/medico.service';
import { Medico } from '../medico/models/medico';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { Medicamento } from '../medicamento/models/medicamento';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent {
  mostrarPassword: boolean = false;
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';
  busqueda: string = '';

  documentoPacienteBuscar: string = '';
  pacienteEncontrado: Paciente;

  formulaList: Formula[] = [];
  formulaFiltered: Formula[] = [];
  citasPaciente: Cita[] = [];
  medicamentos: Medicamento[] = [];

  pacientesMap: Map<number, Paciente> = new Map();
  medicosMap: Map<number, Medico> = new Map();
  medicamentosMap: Map<number, Medicamento> = new Map();

  contadorIndicaciones: number = 0;
  maxCaracteresIndicaciones: number = 500;

  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly pacienteService: PacienteService,
    private readonly citaService: CitaService,
    private readonly medicoService: MedicoService,
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarFormulas();
    this.cargarPacientes();
    this.cargarMedicos();
    this.cargarMedicamentos();
  }

  // -----------------------
  // Funciones de inicialización
  // -----------------------
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required]],
      indicaciones: ['', [Validators.required, Validators.maxLength(this.maxCaracteresIndicaciones)]]
    });

    this.form.get('indicaciones')?.valueChanges.subscribe((valor: string) => {
      this.contadorIndicaciones = valor ? valor.length : 0;
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
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  cargarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes) => pacientes.forEach(p => this.pacientesMap.set(p.id, p)),
      error: (error) => console.error('Error cargando pacientes', error)
    });
  }

  cargarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (medicos) => medicos.forEach(m => this.medicosMap.set(m.id, m)),
      error: (error) => console.error('Error cargando medicos', error)
    });
  }

  cargarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (meds) => {
        this.medicamentos = meds;
        meds.forEach(m => this.medicamentosMap.set(m.id, m));
      },
      error: (error) => console.error('Error cargando medicamentos', error)
    });
  }

  // -----------------------
  // Funciones helper para el HTML
  // -----------------------
  getNombrePaciente(citaId: number): string {
    const cita = this.citasPaciente.find(c => c.id === citaId);
    if (!cita) return '';
    const paciente = this.pacientesMap.get(cita.pacienteId);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : '';
  }

  getNombreMedico(citaId: number): string {
    const cita = this.citasPaciente.find(c => c.id === citaId);
    if (!cita) return '';
    const medico = this.medicosMap.get(cita.medicoId);
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  getNombreMedicamento(formula: Formula): string {
    return this.medicamentosMap.get(formula.medicamentoId)?.nombre || '';
  }

  // -----------------------
  // Formularios y modales
  // -----------------------
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
    this.limpiarFormulario();
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula' : 'Editar Formula';
    this.titleBoton = modo === 'C' ? 'Guardar Formula' : 'Actualizar Formula';
    this.modoFormulario = modo;
    if (modo === 'C') this.limpiarFormulario();

    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoFormula() {
    this.formulaSelected = null;
    this.contadorIndicaciones = 0;
    this.openModal('C');
  }

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.contadorIndicaciones = formula.indicaciones ? formula.indicaciones.length : 0;
    this.openModal('E');

    this.form.patchValue({
      citaId: formula.citaId || '',
      medicamentoId: formula.medicamentoId || '',
      dosis: formula.dosis || '',
      indicaciones: formula.indicaciones || ''
    });
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset();
    this.contadorIndicaciones = 0;
  }

  // -----------------------
  // Búsqueda y filtrado
  // -----------------------
  filtrarFormula() {
    if (!this.busqueda) {
      this.formulaFiltered = this.formulaList;
      return;
    }
    const busquedaLower = this.busqueda.toLowerCase();

    this.formulaFiltered = this.formulaList.filter((formula) => {
      const dosisCumple = formula.dosis?.toLowerCase().includes(busquedaLower);
      const indicacionesCumple = formula.indicaciones?.toLowerCase().includes(busquedaLower);

      const cita = this.citasPaciente.find(c => c.id === formula.citaId);
      const paciente = cita ? this.pacientesMap.get(cita.pacienteId) : null;
      const medico = cita ? this.medicosMap.get(cita.medicoId) : null;

      const fechaCumple = cita?.fechaHora?.toLowerCase().includes(busquedaLower) || false;

      const pacienteCumple = paciente &&
        (paciente.nombres.toLowerCase().includes(busquedaLower) ||
         paciente.apellidos.toLowerCase().includes(busquedaLower) ||
         paciente.numero_documento.toLowerCase().includes(busquedaLower));

      const medicoCumple = medico &&
        (medico.nombres.toLowerCase().includes(busquedaLower) ||
         medico.apellidos.toLowerCase().includes(busquedaLower));

      return dosisCumple || indicacionesCumple || fechaCumple || pacienteCumple || medicoCumple;
    });
  }

  buscarPacientePorDocumento() {
    this.pacienteService.buscarPorDocumento(this.documentoPacienteBuscar).subscribe({
      next: (data) => {
        this.pacienteEncontrado = data;
        this.citaService.buscarCitasPorPacienteId(this.pacienteEncontrado.id).subscribe({
          next: (data) => {
            this.citasPaciente = data;
            Swal.fire("Citas cargadas correctamente","Citas del paciente encontradas", "success");
          },
          error: (error) => Swal.fire('Error', error.error.message, 'error')
        });
      },
      error: (error) => Swal.fire('Error', error.error.message, 'error')
    });
  }

  onIndicacionesChange(event: Event) {
    setTimeout(() => {
      const target = event.target as HTMLTextAreaElement;
      this.contadorIndicaciones = target.value.length;
    }, 0);
  }

  guardarFormula() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formula: Formula = {
      id: this.formulaSelected?.id,
      citaId: this.form.value.citaId,
      medicamentoId: this.form.value.medicamentoId,
      dosis: this.form.value.dosis,
      indicaciones: this.form.value.indicaciones
    };

    const peticion$ = this.modoFormulario === 'C'
      ? this.formulaService.crearFormula(formula)
      : this.formulaService.actualizarFormula(formula);

    this.spinner.show();
    peticion$.subscribe({
      next: () => {
        Swal.fire('Éxito', `Fórmula ${this.modoFormulario === 'C' ? 'creada' : 'actualizada'} correctamente`, 'success');
        this.listarFormulas();
        this.closeModal();
        this.spinner.hide();
      },
      error: (err) => {
        Swal.fire('Error', err.error.message, 'error');
        this.spinner.hide();
      }
    });
  }
}

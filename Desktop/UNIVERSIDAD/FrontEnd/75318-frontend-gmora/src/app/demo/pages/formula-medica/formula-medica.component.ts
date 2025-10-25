import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulaMedicaService } from './service/formula-medica.service';
import { CitaService } from '../cita/service/cita.service';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { FormulaMedica } from './models/formula-medica';
import { Cita } from '../cita/models/cita';
import { Medicamento } from '../medicamento/models/medicamento';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent {
  formulas: FormulaMedica[] = [];
  formulasFiltradas: FormulaMedica[] = [];
  citas: Cita[] = [];
  medicamentos: Medicamento[] = [];
  
  filtro = {
    id: '',
    citaId: '',
    medicamentoId: '',
    dosis: '',
    indicaciones: '',
    fechaCreacionRegistro: ''
  };

  formulaSeleccionada: FormulaMedica | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';
  cargando = false;
  cargandoCombos = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formulaService: FormulaMedicaService,
    private readonly citaService: CitaService,
    private readonly medicamentoService: MedicamentoService
  ) {
    this.inicializarFormulario();
    this.listarFormulas();
    this.cargarDatosCombos();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      citaId: [null, Validators.required],
      medicamentoId: [null, Validators.required],
      dosis: ['', Validators.required],
      indicaciones: ['', Validators.required],
      fechaCreacionRegistro: ['']
    });
  }

  listarFormulas(): void {
    this.cargando = true; 
    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulas = data || [];
        this.formulasFiltradas = [...this.formulas];
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar las fórmulas médicas', 'error');
        this.cargando = false;
      }
    });
  }

  cargarDatosCombos(): void {
    this.cargandoCombos = true;

    // Cargar citas
    this.citaService.listarCitas().subscribe({
      next: (citas) => {
        this.citas = citas || [];
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar las citas', 'error');
      }
    });

    // Cargar medicamentos
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (medicamentos) => {
        this.medicamentos = medicamentos || [];
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar los medicamentos', 'error');
      },
      complete: () => {
        this.cargandoCombos = false;
      }
    });
  }

  filtrarFormulas(): void {
    this.formulasFiltradas = this.formulas.filter(f =>
      (!this.filtro.id || (f.id?.toString() || '').toLowerCase().includes(this.filtro.id.toLowerCase())) &&
      (!this.filtro.citaId || (f.citaId?.toString() || '').toLowerCase().includes(this.filtro.citaId.toLowerCase())) &&
      (!this.filtro.medicamentoId || (f.medicamentoId?.toString() || '').toLowerCase().includes(this.filtro.medicamentoId.toLowerCase())) &&
      (!this.filtro.dosis || ((f.dosis || '').toLowerCase().includes(this.filtro.dosis.toLowerCase()))) &&
      (!this.filtro.indicaciones || ((f.indicaciones || '').toLowerCase().includes(this.filtro.indicaciones.toLowerCase()))) &&
      (!this.filtro.fechaCreacionRegistro || ((f.fechaCreacionRegistro || '').toString().toLowerCase().includes(this.filtro.fechaCreacionRegistro.toLowerCase())))
    );
  }

  abrirNuevaFormula(): void {
    this.formulaSeleccionada = null;
    this.titleModal = 'Nueva Fórmula Médica';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset();
    this.openModal();
  }

  abrirEditarFormula(f: FormulaMedica): void {
    this.formulaSeleccionada = f;
    this.titleModal = 'Editar Fórmula Médica';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    
    // Convertir IDs a number para que funcionen los selects
    this.form.patchValue({
      id: f.id,
      citaId: Number(f.citaId),
      medicamentoId: Number(f.medicamentoId),
      dosis: f.dosis,
      indicaciones: f.indicaciones,
      fechaCreacionRegistro: f.fechaCreacionRegistro
    });
    
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarFormula(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete los campos obligatorios', 'error');
      return;
    }

    const payload: FormulaMedica = { 
      ...this.form.value,
      citaId: Number(this.form.value.citaId),
      medicamentoId: Number(this.form.value.medicamentoId)
    };

    this.cargando = true; 

    const obs =
      this.modoFormulario === 'C'
        ? this.formulaService.guardarFormula(payload)
        : this.formulaService.actualizarFormula(payload);

    obs.subscribe({
      next: (res: RespuestaRs) => {
        const mensaje = res.mensaje || 
          (this.modoFormulario === 'E' 
            ? 'Fórmula médica actualizada con éxito' 
            : 'Fórmula médica guardada con éxito');
        
        Swal.fire('Éxito', mensaje, 'success');
        this.closeModal();
        this.listarFormulas();
        this.cargando = false; 
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la fórmula médica', 'error');
        this.cargando = false; 
      }
    });
  }

  // Método para obtener el texto descriptivo de una cita
  getDescripcionCita(citaId: number): string {
    const cita = this.citas.find(c => c.id === citaId);
    if (!cita) return `Cita #${citaId}`;
    
    return `Cita #${cita.id} - ${cita.nombrePaciente} con ${cita.nombreMedico} (${this.formatearFecha(cita.fechaHora)})`;
  }

  // Método para obtener el nombre del medicamento
  getNombreMedicamento(medicamentoId: number): string {
    const medicamento = this.medicamentos.find(m => m.id === medicamentoId);
    if (!medicamento) return `Medicamento #${medicamentoId}`;
    
    return `${medicamento.nombre} - ${medicamento.presentacion}`;
  }

  // Formatear fecha para display
  private formatearFecha(fecha: string): string {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES');
    } catch {
      return fecha;
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  
  filtro = {
    id: '',
    nombrePaciente: '',
    nombreMedico: '',
    fechaHora: '',
    estado: '',
    motivo: ''
  };

  citaSeleccionada: Cita | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';
  cargando = false;
  cargandoCombos = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly citaService: CitaService,
    private readonly pacienteService: PacienteService,
    private readonly medicoService: MedicoService
  ) {
    this.inicializarFormulario();
    this.listarCitas();
    this.cargarDatosCombos();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaHora: ['', Validators.required],
      estado: ['PROGRAMADA', Validators.required],
      motivo: ['']
    });
  }

  listarCitas(): void {
    this.cargando = true;
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.citas = data || [];
        this.citasFiltradas = [...this.citas];
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar las citas', 'error');
        this.cargando = false;
      }
    });
  }

  cargarDatosCombos(): void {
    this.cargandoCombos = true;

    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes || [];
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar los pacientes', 'error');
      }
    });

    this.medicoService.listarMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos || [];
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar los médicos', 'error');
      },
      complete: () => {
        this.cargandoCombos = false;
      }
    });
  }

  filtrar(): void {
    this.citasFiltradas = this.citas.filter(c =>
      (!this.filtro.id || (c.id?.toString() || '').includes(this.filtro.id)) &&
      (!this.filtro.nombrePaciente || (c.nombrePaciente || '').toLowerCase().includes(this.filtro.nombrePaciente.toLowerCase())) &&
      (!this.filtro.nombreMedico || (c.nombreMedico || '').toLowerCase().includes(this.filtro.nombreMedico.toLowerCase())) &&
      (!this.filtro.fechaHora || (c.fechaHora || '').toString().toLowerCase().includes(this.filtro.fechaHora.toLowerCase())) &&
      (!this.filtro.estado || (c.estado || '').toLowerCase().includes(this.filtro.estado.toLowerCase())) &&
      (!this.filtro.motivo || (c.motivo || '').toLowerCase().includes(this.filtro.motivo.toLowerCase()))
    );
  }

  getBadgeClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PROGRAMADA':
        return 'badge bg-warning text-dark';
      case 'CONFIRMADA':
        return 'badge bg-info text-white';
      case 'COMPLETADA':
        return 'badge bg-success text-white';
      case 'CANCELADA':
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }

  abrirNuevaCita(): void {
    this.citaSeleccionada = null;
    this.titleModal = 'Registrar Cita';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset({
      estado: 'PROGRAMADA'
    });
    this.openModal();
  }

  abrirEditarCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.titleModal = 'Editar Cita';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    
    const fechaHoraFormatted = cita.fechaHora ? this.formatDateForInput(cita.fechaHora) : '';
    
    this.form.patchValue({
      id: cita.id,
      pacienteId: cita.pacienteId,
      medicoId: cita.medicoId,
      fechaHora: fechaHoraFormatted,
      estado: cita.estado,
      motivo: cita.motivo
    });
    this.openModal();
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  openModal(): void {
    const modalElement = document.getElementById('modalCita');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarCita(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'error');
      return;
    }

    const payload: Cita = { 
      ...this.form.value,
      pacienteId: String(this.form.value.pacienteId),
      medicoId: String(this.form.value.medicoId),
      nombrePaciente: '',
      nombreMedico: ''
    };

    this.cargando = true;
    
    const obs = this.modoFormulario === 'C'
      ? this.citaService.guardarCita(payload)
      : this.citaService.actualizarCita(payload);

    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarCitas();
        this.cargarDatosCombos();
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la cita', 'error');
        this.cargando = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  filtro = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    direccion: ''
  };

  pacienteSeleccionado: Paciente | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly pacienteService: PacienteService
  ) {
    this.inicializarFormulario();
    this.listarPacientes();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: [''],
      direccion: ['']
    });
  }

  listarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientes = data || [];
        this.pacientesFiltrados = [...this.pacientes];
      },
      error: () => Swal.fire('Error', 'No fue posible listar los pacientes', 'error')
    });
  }

  filtrar(): void {
    this.pacientesFiltrados = this.pacientes.filter(p =>
      (!this.filtro.tipoDocumento || (p.tipoDocumento || '').toLowerCase().includes(this.filtro.tipoDocumento.toLowerCase())) &&
      (!this.filtro.numeroDocumento || (p.numeroDocumento || '').toString().toLowerCase().includes(this.filtro.numeroDocumento.toLowerCase())) &&
      (!this.filtro.nombres || (p.nombres || '').toLowerCase().includes(this.filtro.nombres.toLowerCase())) &&
      (!this.filtro.apellidos || (p.apellidos || '').toLowerCase().includes(this.filtro.apellidos.toLowerCase())) &&
      (!this.filtro.fechaNacimiento || (p.fechaNacimiento || '').toString().toLowerCase().includes(this.filtro.fechaNacimiento.toLowerCase())) &&
      (!this.filtro.genero || (p.genero || '').toLowerCase().includes(this.filtro.genero.toLowerCase())) &&
      (!this.filtro.telefono || (p.telefono || '').toLowerCase().includes(this.filtro.telefono.toLowerCase())) &&
      (!this.filtro.direccion || (p.direccion || '').toLowerCase().includes(this.filtro.direccion.toLowerCase()))
    );
  }

  abrirNuevoPaciente(): void {
    this.pacienteSeleccionado = null;
    this.titleModal = 'Registrar Paciente';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset();
    this.openModal();
  }

  abrirEditarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(paciente);
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarPaciente(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'error');
      return;
    }

    const payload: Paciente = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.pacienteService.guardarPaciente(payload)
        : this.pacienteService.actualizarPaciente(payload);

    obs.subscribe({
      next: (res: RespuestaRs) => {
       Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarPacientes();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el paciente', 'error');
      }
    });
  }
}

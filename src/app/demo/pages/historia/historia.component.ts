import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { HistoriaService } from './service/historia.service';
import { Historia } from './models/historia';
import { PacienteService } from '../paciente/service/paciente.service';
import { Paciente } from '../paciente/models/paciente';

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent implements OnInit {

  historias: Historia[] = [];
  pacientesMap: Map<number, Paciente> = new Map();
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nueva Historia';
  titleBoton = 'Guardar';
  modoFormulario = 'N';
  historiaSelected: Historia | null = null;

  constructor(
    private historiaService: HistoriaService,
    private pacienteService: PacienteService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
  this.form = this.fb.group({
    id: [''],
    PacienteId: ['', Validators.required],
    fechaCreacion: ['', Validators.required]
  });
  this.pacienteService.listarPacientes().subscribe({
    next: (pacientes) => {
      pacientes.forEach(p => this.pacientesMap.set(p.id, p));
      this.obtenerHistorias();
    },
    error: (error) => console.error('Error cargando pacientes', error)
  });
}


  // -----------------------
  // Cargar pacientes y mapear
  // -----------------------
  cargarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes) => pacientes.forEach(p => this.pacientesMap.set(p.id, p)),
      error: (error) => console.error('Error cargando pacientes', error)
    });
  }

  // -----------------------
  // Obtener historias
  // -----------------------
  obtenerHistorias() {
    this.historiaService.listarHistorias().subscribe({
      next: (data) => this.historias = data,
      error: (error) => console.error('Error al obtener historias', error)
    });
  }

  // -----------------------
  // Abrir modales
  // -----------------------
  abrirNuevoHistoria() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nueva Historia';
    this.titleBoton = 'Guardar';
    this.form.reset();
    this.historiaSelected = null;
  }

  abrirEditarHistoria(historia: Historia) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Historia';
    this.titleBoton = 'Actualizar';
    this.historiaSelected = historia;

    this.form.patchValue({
      id: historia.id,
      PacienteId: historia.PacienteId,
      fechaCreacion: historia.fechaCreacion
    });
  }

  // -----------------------
  // Guardar o actualizar historia
  // -----------------------
  guardarHistoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos: Historia = this.form.value;

    if (this.modoFormulario === 'N') {
      this.historiaService.crearHistoria(datos).subscribe(() => {
        this.obtenerHistorias();
        this.form.reset();
      });
    } else if (this.historiaSelected) {
      datos.id = this.historiaSelected.id;
      this.historiaService.actualizarHistoria(datos).subscribe(() => {
        this.obtenerHistorias();
        this.form.reset();
      });
    }
  }

  // -----------------------
  // Helper para mostrar nombre del paciente en la tabla
  // -----------------------
  getNombrePaciente(PacienteId: number): string {
    const paciente = this.pacientesMap.get(PacienteId);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : '';
  }

  // Acceso rápido a controles del formulario
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}

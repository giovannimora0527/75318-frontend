import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoriaService } from './service/historia.service';
import { Paciente } from '../paciente/models/paciente';
import { Historia } from './models/historia';
import { PacienteService } from '../paciente/service/paciente.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-historia',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent implements OnInit {

  historias: Historia[] = [];
  pacientes: Paciente[] = [];
  form!: FormGroup;
  loading = false;
  editando = false;

  rol: string = '';
  isAdminOrMedico: boolean = false;

  constructor(
    private servicioHistoria: HistoriaService,
    private servicioPaciente: PacienteService,
    private fb: FormBuilder
  ) {

    const user = JSON.parse(localStorage.getItem('usuario')!);
    this.rol = user?.rol ?? '';

    // ADMIN y MEDICO pueden crear / editar / borrar
    this.isAdminOrMedico = this.rol === 'ADMIN' || this.rol === 'MEDICO';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      paciente: [null, Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required]
    });

    this.cargarPacientes();
    this.cargarHistorias();
  }

  cargarPacientes(): void {
    this.servicioPaciente.listarPacientes().subscribe({
      next: (data) => this.pacientes = data
    });
  }

  cargarHistorias(): void {
    this.loading = true;
    this.servicioHistoria.listar().subscribe({
      next: (data) => {
        this.historias = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const body = {
      id: this.form.value.id,
      paciente: this.form.value.paciente.id,
      descripcion: this.form.value.descripcion,
      fecha: this.form.value.fecha
    };

    const peticion = this.editando
      ? this.servicioHistoria.actualizar(body)
      : this.servicioHistoria.guardar(body);

    peticion.subscribe(() => {
      this.form.reset();
      this.editando = false;
      this.cargarHistorias();
    });
  }

  editar(historia: Historia): void {
    if (!this.isAdminOrMedico) return;

    this.editando = true;

    this.form.patchValue({
      id: historia.id,
      paciente: historia.paciente,
      descripcion: historia.descripcion,
      fecha: historia.fecha
    });
  }

  eliminar(id: number): void {
    if (!this.isAdminOrMedico) return;

    if (!confirm("¿Eliminar historia?")) return;

    this.servicioHistoria.eliminar(id).subscribe(() => {
      this.cargarHistorias();
    });
  }
}

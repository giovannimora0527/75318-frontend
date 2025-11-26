import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cita } from './models/cita';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';
import { CitaService } from './service/cita.service';
import { Usuario } from '../usuario/models/usuario';
import { Especializacion } from '../medico/models/especializacion';
import { RespuestaRs } from '../usuario/models/respuesta-rs';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-cita',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {

  citas: Cita[] = [];
  loading = false;
  error = '';
  formCita!: FormGroup;
  editMode = false;

  pacientes: Paciente[] = [];
  medicos: Medico[] = [];

    rol: string = '';
    isAdminOrMedico: boolean = false;

  constructor(private citaService: CitaService, private fb: FormBuilder) {

    const user = JSON.parse(localStorage.getItem('usuario'));
    this.isAdminOrMedico = user?.rol === 'ADMIN','MEDICO';

  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCitas();
    this.cargarPacientes();
    this.cargarMedicos();
  }

  inicializarFormulario(): void {
    this.formCita = this.fb.group({
      id: [''],
      paciente: [null, Validators.required],
      medico: [null, Validators.required],
      fechaHora: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)]],
      estado: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarCitas(): void {
    this.loading = true;
    this.citaService.listarCitas().subscribe({
      next: (data: Cita[]) => {
        this.citas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las citas';
        this.loading = false;
      }
    });
  }

  cargarPacientes(): void {
    // Datos de ejemplo con Usuario y rol correcto
    const usuario1: Usuario = { id: 1, username: 'juanp', rol: 'PACIENTE', fechaCreacion: new Date(), activo: true, password: '123' };
    const usuario2: Usuario = { id: 2, username: 'anag', rol: 'PACIENTE', fechaCreacion: new Date(), activo: true, password: '123' };

    this.pacientes = [
      { id: 1, nombres: 'Juan', apellidos: 'Pérez', documento: '', tipoDocumento: '', telefono: '', direccion: '', genero: 'M', fechaNacimiento: new Date(), usuario: usuario1 },
      { id: 2, nombres: 'Ana', apellidos: 'Gómez', documento: '', tipoDocumento: '', telefono: '', direccion: '', genero: 'F', fechaNacimiento: new Date(), usuario: usuario2 }
    ];
  }

  cargarMedicos(): void {
    const esp1: Especializacion = { id: 1, nombre: 'Cardiología', descripcion: '', codigoEspecializacion: '' };
    const esp2: Especializacion = { id: 2, nombre: 'Pediatría', descripcion: '', codigoEspecializacion: '' };

    this.medicos = [
      { id: 1, nombres: 'Dr. Juan', apellidos: 'López', documento: '', tipoDocumento: '', telefono: '', registroProfesional: '', especializacion: esp1 },
      { id: 2, nombres: 'Dra. Ana', apellidos: 'Martínez', documento: '', tipoDocumento: '', telefono: '', registroProfesional: '', especializacion: esp2 }
    ];
  }

  guardarCita(): void {
    if (this.formCita.invalid) return;

    const cita: Cita = this.formCita.value;

    const request = this.editMode
      ? this.citaService.actualizarCita(cita)
      : this.citaService.guardarCita(cita);

    request.subscribe({
      next: (res: RespuestaRs) => {
        alert(res.mensaje);
        this.formCita.reset();
        this.editMode = false;
        this.cargarCitas();
      },
      error: () => alert('Error al guardar la cita')
    });
  }

  editarCita(cita: Cita): void {
    this.editMode = true;
    this.formCita.setValue({
      id: cita.id || '',
      paciente: cita.paciente,
      medico: cita.medico,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      motivo: cita.motivo
    });
  }

  eliminarCita(id?: number): void {
    if (!id) return;
    if (!confirm('¿Está seguro de eliminar esta cita?')) return;

    this.citaService.eliminarCita(id).subscribe({
      next: (res: RespuestaRs) => {
        alert(res.mensaje);
        this.cargarCitas();
      },
      error: () => alert('Error al eliminar la cita')
    });
  }
}

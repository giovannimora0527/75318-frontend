import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  pacientes: Paciente[] = [];
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nuevo Paciente';
  titleBoton = 'Guardar';

  modoFormulario = 'N';
  pacienteSelected: Paciente | null = null;

  constructor(
    private pacienteService: PacienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activo: [true]
    });

    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.pacienteService.listarPacientes().subscribe(resp => {
      // Mapeamos los datos de la API a nuestro modelo
      this.pacientes = resp.map(p => ({
        id: p.id,
        tipo_documento: p.tipoDocumento,
        numero_documento: p.numeroDocumento,
        nombres: p.nombres,
        apellidos: p.apellidos,
        fecha_nacimiento: p.fechaNacimiento,
        genero: p.genero,
        telefono: p.telefono,
        direccion: p.direccion,
        edad: p.edad
      }));
      console.log('Pacientes cargados:', this.pacientes);
    });
  }

  abrirNuevoPaciente() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar';
    this.form.reset();
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    this.pacienteSelected = paciente;

    this.form.patchValue({
      nombre: paciente.nombres,
      email: '', // Como en la BD no tienes email, puedes dejar vacío
      activo: true // O false según necesites
    });
  }

  guardarUsuario() {
    console.log('Guardando...', this.form.value);
  }
}

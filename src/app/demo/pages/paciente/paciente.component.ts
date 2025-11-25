import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService, NgxSpinnerModule } from "ngx-spinner";
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
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
  modalInstance: Modal | null = null;

  constructor(
    private pacienteService: PacienteService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo_documento: ['', Validators.required],
      numero_documento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      activo: [true]
    });

    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.spinner.show();
    this.pacienteService.listarPacientes().subscribe(resp => {
      // Mapear backend a nuestro modelo
      this.pacientes = resp.map((p: any) => ({
        id: p.id,
        tipo_documento: p.tipoDocumento ?? p.tipo_documento,
        numero_documento: p.numeroDocumento ?? p.numero_documento,
        nombres: p.nombres,
        apellidos: p.apellidos,
        fecha_nacimiento: p.fechaNacimiento ?? p.fecha_nacimiento,
        genero: p.genero,
        telefono: p.telefono,
        direccion: p.direccion,
        edad: p.edad,
        activo: p.activo
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  abrirNuevoPaciente() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar';
    this.pacienteSelected = null;

    this.form.reset({
      tipo_documento: '',
      numero_documento: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      genero: '',
      telefono: '',
      direccion: '',
      edad: '',
      activo: true
    });

    this.abrirModal();
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    this.pacienteSelected = paciente;

    this.form.patchValue({
      tipo_documento: paciente.tipo_documento,
      numero_documento: paciente.numero_documento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fecha_nacimiento: paciente.fecha_nacimiento,
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion,
      edad: paciente.edad,
    });

    this.abrirModal();
  }

  abrirModal() {
    const modalEl = document.getElementById('modalCrearPaciente');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarPaciente() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios'
      });
      return;
    }

    const paciente: Paciente = {
      ...this.form.value,
      id: this.modoFormulario === 'E' && this.pacienteSelected ? this.pacienteSelected.id : 0
    };

    if (this.modoFormulario === 'N') {
      this.pacienteService.guardarPaciente(paciente).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Paciente registrado',
          text: 'El paciente ha sido guardado exitosamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.obtenerPacientes();
        this.cerrarModal();
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el paciente'
        });
        console.error(err);
      });
    } else if (this.pacienteSelected) {
      this.pacienteService.actualizarPaciente(this.pacienteSelected.id, paciente).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Paciente actualizado',
          text: 'Los datos del paciente se actualizaron correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.obtenerPacientes();
        this.cerrarModal();
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el paciente'
        });
        console.error(err);
      });
    }
  }
}

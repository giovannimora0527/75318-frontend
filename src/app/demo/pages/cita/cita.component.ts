import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { CitaService } from './service/cita.service';
import { CitaRespDTO } from './models/cita';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {

  citas: CitaRespDTO[] = [];
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nueva Cita';
  titleBoton = 'Guardar';

  modoFormulario = 'N';
  citaSelected: CitaRespDTO | null = null;

  constructor(
    private citaService: CitaService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      motivo: ['', Validators.required],
      fechaHora: ['', Validators.required],
      estado: ['', Validators.required]
    });

    this.obtenerCitas();
  }

  obtenerCitas() {
    this.spinner.show();
    this.citaService.listarCitas().subscribe(resp => {
      this.citas = resp;
      this.spinner.hide();
    }, error => {
      console.error('Error al obtener citas', error);
      this.spinner.hide();
    });
  }

  abrirNuevaCita() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nueva Cita';
    this.titleBoton = 'Guardar';
    this.citaSelected = null;
    this.form.reset();
  }

  abrirEditarCita(cita: CitaRespDTO) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Cita';
    this.titleBoton = 'Actualizar';
    this.citaSelected = cita;

    this.form.patchValue({
      pacienteNombre: cita.pacienteNombre,
      medicoNombre: cita.medicoNombre,
      motivo: cita.motivo,
      fechaHora: cita.fechaHora,
      estado: cita.estado
    });
  }

  guardarCita() {
    if (this.form.invalid) return;

    const citaData: CitaRespDTO = {
      id: this.citaSelected?.id || 0,
      pacienteNombre: this.form.value.pacienteId,
      medicoNombre: this.form.value.medicoId,
      motivo: this.form.value.motivo,
      fechaHora: this.form.value.fechaHora,
      estado: this.form.value.estado
    };

    if (this.modoFormulario === 'N') {
      this.citaService.crearCita(citaData).subscribe({
        next: resp => {
          console.log('Cita creada:', resp);
          this.obtenerCitas();
          // cerrar modal con Bootstrap
          (document.getElementById('modalCrearCita') as any)?.classList.remove('show');
        },
        error: err => console.error('Error al crear cita', err)
      });
    } else {
      console.log('Actualizar cita no implementado todavía');
      // Aquí podrías llamar a actualizar si implementas endpoint PUT
    }
  }
}

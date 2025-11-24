import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HistoriaService } from './service/historia.service';
import { Historia } from './models/historia';

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
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nueva Historia';
  titleBoton = 'Guardar';
  modoFormulario = 'N';
  historiaSelected: Historia | null = null;

  constructor(private historiaService: HistoriaService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      PacienteId: ['', Validators.required],
      fechaCreacion: ['', Validators.required]
    });
    this.obtenerHistorias();
  }

  obtenerHistorias() {
    this.historiaService.listarHistorias().subscribe(resp => {
      this.historias = resp;
    });
  }

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

  guardarHistoria() {
    const datos: Historia = this.form.value;

    if (this.modoFormulario === 'N') {
      this.historiaService.crearHistoria(datos).subscribe(() => {
        this.obtenerHistorias();
      });
    } else if (this.historiaSelected) {
      datos.id = this.historiaSelected.id;
      this.historiaService.actualizarHistoria(datos).subscribe(() => {
        this.obtenerHistorias();
      });
    }

    this.form.reset();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent implements OnInit {
  especializaciones: Especializacion[] = [];
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nueva Especializacion';
  titleBoton = 'Guardar';
  modoFormulario = 'N';
  especializacionSelected: Especializacion | null = null;

  constructor(private especializacionService: EspecializacionService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigoEspecializacion: ['', Validators.required]
    });
    this.obtenerEspecializaciones();
  }

  obtenerEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe(resp => {
      this.especializaciones = resp;
    });
  }

  abrirNuevoEspecializacion() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nueva Especializacion';
    this.titleBoton = 'Guardar';
    this.form.reset();
    this.especializacionSelected = null;
  }

  abrirEditarEspecializacion(especializacion: Especializacion) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Especializacion';
    this.titleBoton = 'Actualizar';
    this.especializacionSelected = especializacion;

    this.form.patchValue({
      id: especializacion.id,
      nombre: especializacion.nombre,
      descripcion: especializacion.descripcion,
      codigoEspecializacion: especializacion.codigoEspecializacion
    });
  }

  guardarEspecializacion() {
    const datos: Especializacion = this.form.value;

    if (this.modoFormulario === 'N') {
      this.especializacionService.crearEspecializacion(datos).subscribe(() => {
        this.obtenerEspecializaciones();
      });
    } else if (this.especializacionSelected) {
      datos.id = this.especializacionSelected.id;
      this.especializacionService.actualizarEspecializacion(datos.id!, datos).subscribe(() => {
        this.obtenerEspecializaciones();
      });
    }

    this.form.reset();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especializacion } from '../medico/models/especializacion';
import { EspecializacionService } from './service/especializacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent implements OnInit {

  form!: FormGroup;
  especializaciones: Especializacion[] = [];
  loading = false;
  message = '';

  rol: string = '';

  constructor(
    private fb: FormBuilder,
    private especializacionService: EspecializacionService
  ) {}

  ngOnInit(): void {
    // Obtener rol
    this.rol = localStorage.getItem('rol') || '';

    this.form = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigoEspecializacion: ['', Validators.required]
    });

    this.cargarLista();
  }

  // ADMIN puede crear → los demás no
  puedeCrear(): boolean {
    return this.rol === 'ADMIN';
  }

  // ADMIN puede editar → los demás no
  puedeEditar(): boolean {
    return this.rol === 'ADMIN';
  }

  // ADMIN puede eliminar → los demás no
  puedeEliminar(): boolean {
    return this.rol === 'ADMIN';
  }

  cargarLista(): void {
    this.loading = true;

    this.especializacionService.listar().subscribe({
      next: (data) => {
        this.especializaciones = data;
        this.loading = false;
      },
      error: () => {
        this.message = 'Error al cargar especializaciones';
        this.loading = false;
      }
    });
  }

  guardar(): void {
    if (!this.puedeCrear() && !this.puedeEditar()) return;

    const esp = this.form.value;

    if (!esp.id) {
      // Crear
      this.especializacionService.guardar(esp).subscribe({
        next: (r) => {
          this.message = r.mensaje;
          this.cargarLista();
          this.form.reset();
        }
      });
    } else {
      // Actualizar
      this.especializacionService.actualizar(esp).subscribe({
        next: (r) => {
          this.message = r.mensaje;
          this.cargarLista();
          this.form.reset();
        }
      });
    }
  }

  editar(esp: Especializacion): void {
    if (!this.puedeEditar()) return;
    this.form.patchValue(esp);
  }

  eliminar(id: number | undefined): void {
    if (!id || !this.puedeEliminar()) return;

    this.especializacionService.eliminar(id).subscribe({
      next: (r) => {
        this.message = r.mensaje;
        this.cargarLista();
      }
    });
  }
}

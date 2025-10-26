import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormulaMedicaService, FormulaMedica } from './service/formula-medica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent implements OnInit {

  formulas: FormulaMedica[] = [];
  form!: FormGroup;
  cargando = false;
  editando = false;
  idEditando?: number;

  constructor(
    private fb: FormBuilder,
    private formulaService: FormulaMedicaService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarFormulas();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      fechaEmision: ['', Validators.required],
      medicoId: ['', Validators.required],
      pacienteId: ['', Validators.required],
    });
  }

  cargarFormulas(): void {
    this.cargando = true;
    this.formulaService.listar().subscribe({
      next: (data) => {
        this.formulas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', 'Error al cargar las fórmulas médicas', 'error');
        console.error(err);
      }
    });
  }

  guardarFormula(): void {
    if (this.form.invalid) {
      Swal.fire('Formulario inválido', 'Completa todos los campos correctamente.', 'warning');
      return;
    }

    const formula: FormulaMedica = this.form.value;

    this.cargando = true;

    // Si está editando
    if (this.editando && this.idEditando) {
      this.formulaService.actualizar(this.idEditando, formula).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La fórmula se actualizó correctamente.', 'success');
          this.cargarFormulas();
          this.form.reset();
          this.editando = false;
          this.cargando = false;
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar la fórmula.', 'error');
          this.cargando = false;
        }
      });
    } else {
      // Si es nuevo registro
      this.formulaService.guardar(formula).subscribe({
        next: () => {
          Swal.fire('Guardado', 'La fórmula se guardó correctamente.', 'success');
          this.cargarFormulas();
          this.form.reset();
          this.cargando = false;
        },
        error: () => {
          Swal.fire('Error', 'No se pudo guardar la fórmula.', 'error');
          this.cargando = false;
        }
      });
    }
  }

  editarFormula(f: FormulaMedica): void {
    this.editando = true;
    this.idEditando = f.id;
    this.form.patchValue({
      descripcion: f.descripcion,
      fechaEmision: f.fechaEmision,
      medicoId: f.medicoId,
      pacienteId: f.pacienteId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarFormula(id: number): void {
    Swal.fire({
      title: '¿Eliminar fórmula?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formulaService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La fórmula médica fue eliminada', 'success');
            this.cargarFormulas();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la fórmula', 'error');
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.form.reset();
    this.editando = false;
    this.idEditando = undefined;
  }
}

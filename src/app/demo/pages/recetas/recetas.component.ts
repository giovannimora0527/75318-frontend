import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetasService, RecetaRs, RecetaRq, Cita, Medicamento } from './service/recetas.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss']
})
export class RecetasComponent {
  recetasList: RecetaRs[] = [];
  citasList: Cita[] = [];
  medicamentosList: Medicamento[] = [];

  // Modal/UI
  titleModal = '';
  titleBoton = '';
  recetaSelected: RecetaRs | null = null;
  modalInstance: Modal | null = null;

  // Form
  form!: FormGroup;
  guardando = false;

  constructor(
    private readonly recetasService: RecetasService,
    private readonly fb: FormBuilder
  ) {
    this.crearFormularioVacio();
    this.listarRecetas();
    this.cargarCitas();
    this.cargarMedicamentos();
  }

  private crearFormularioVacio() {
    this.form = this.fb.group({
      citaId: [null, Validators.required],
      medicamentoId: [null, Validators.required],
      dosis: ['', Validators.required],
      indicaciones: ['']
    });
  }

  listarRecetas() {
    this.recetasService.listarRecetas().subscribe({
      next: (data) => this.recetasList = data,
      error: (error) => {
        console.error('Error fetching recetas list:', error);
        Swal.fire('Error', 'No se pudieron cargar las recetas.', 'error');
      }
    });
  }

  cargarCitas() {
    this.recetasService.listarCitas().subscribe({
      next: (data) => {
        // Mapea los datos del backend al formato esperado por el frontend
        this.citasList = data.map(cita => ({
          id: cita.id,
          fechaHora: cita.fechaHora,
          pacienteNombre: cita.nombreCompletoPaciente // Ajusta el campo
        })) as Cita[];
      },
      error: (error) => {
        console.error('Error fetching citas list:', error);
        Swal.fire('Error', 'No se pudieron cargar las citas.', 'error');
      }
    });
  }

 cargarMedicamentos() {
  this.recetasService.listarMedicamentos().subscribe({
    next: (data) => {
      console.log('Medicamentos cargados:', data); // Depuración
      this.medicamentosList = data;
    },
    error: (error) => {
      console.error('Error fetching medicamentos list:', error);
      Swal.fire('Error', 'No se pudieron cargar los medicamentos.', 'error');
    }
    });
  }

  abrirNuevaReceta() {
    this.titleModal = 'Crear Receta';
    this.titleBoton = 'Guardar Receta';
    this.recetaSelected = null;

    this.form.reset({
      citaId: null,
      medicamentoId: null,
      dosis: '',
      indicaciones: ''
    });

    this.form.get('citaId')?.enable();

    this.abrirModal();
  }

  editarModalReceta(receta: RecetaRs) {
    this.titleModal = 'Editar Receta';
    this.titleBoton = 'Actualizar Receta';
    this.recetaSelected = receta;

    this.form.reset({
      citaId: receta.citaId,
      medicamentoId: receta.medicamentoId,
      dosis: receta.dosis,
      indicaciones: receta.indicaciones || ''
    });
    this.form.get('citaId')?.disable();
    this.abrirModal();
  }

  abrirModal() {
    const el = document.getElementById('modalCrearReceta');
    if (!el) return;
    this.modalInstance ??= new Modal(el);
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  guardarReceta() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    this.guardando = true;

    const body: RecetaRq = {
      citaId: Number(this.form.getRawValue().citaId),
      medicamentoId: Number(this.form.getRawValue().medicamentoId),
      dosis: this.form.getRawValue().dosis.trim(),
      indicaciones: this.form.getRawValue().indicaciones?.trim() || undefined
    };

    this.recetasService.guardarReceta(body).subscribe({
      next: (r) => {
        Swal.fire('Éxito', r?.mensaje || 'La receta se ha guardado correctamente.', 'success');
        this.closeModal();
        this.listarRecetas(); // Actualiza la lista de recetas
      },
      error: (e) => {
        console.error(e);
        const msg = e?.error?.message || e?.error || 'Error guardando la receta.';
        Swal.fire('Error', msg, 'error');
      },
      complete: () => {
        this.guardando = false;
      }
    });
  }
}
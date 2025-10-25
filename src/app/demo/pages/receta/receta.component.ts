import { Component } from '@angular/core';
import { RecetaService } from './service/receta.service';
import { Receta, RecetaRq } from './models/receta';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receta',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class RecetaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  recetaSelected: Receta | null = null;
  recetaList: Receta[] = [];
  recetaListOriginal: Receta[] = [];
  loading: boolean = false;
  
  form: FormGroup;
  
  // Filtros
  filtros = {
    id: '',
    diagnostico: '',
    indicaciones: '',
    observaciones: '',
    fecha: '',
    paciente: '',
    medico: '',
    estado: ''
  };

  constructor(
    private readonly recetaService: RecetaService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarRecetas();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],
      indicaciones: ['', [Validators.required, Validators.minLength(10)]],
      medicoId: [1, [Validators.required, Validators.min(1)]],
      pacienteId: [1, [Validators.required, Validators.min(1)]],
      medicamentoIds: [[], [Validators.required]],
      observaciones: ['', [Validators.maxLength(500)]],
      citaId: [1, [Validators.required, Validators.min(1)]],
      dosis: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarRecetas() {
    this.loading = true;
    this.recetaService.listarRecetas().subscribe({
      next: (data) => {
        this.recetaList = data;
        this.recetaListOriginal = [...data];
        this.loading = false;
        console.log('Recetas médicas cargadas:', data);
      },
      error: (error) => {
        console.error('Error al obtener recetas médicas:', error);
        this.loading = false;
        Swal.fire('Error', 'Error al cargar las recetas médicas', 'error');
      }
    });
  }

  // Métodos de filtrado
  aplicarFiltros() {
    this.recetaList = this.recetaListOriginal.filter(receta => {
      return (
        this.filtrarPorCampo(receta.id?.toString(), this.filtros.id) &&
        this.filtrarPorCampo(receta.diagnostico, this.filtros.diagnostico) &&
        this.filtrarPorCampo(receta.indicaciones, this.filtros.indicaciones) &&
        this.filtrarPorCampo(receta.observaciones, this.filtros.observaciones) &&
        this.filtrarPorCampo(receta.fecha, this.filtros.fecha) &&
        this.filtrarPorCampo(`${receta.paciente?.nombres} ${receta.paciente?.apellidos}`, this.filtros.paciente) &&
        this.filtrarPorCampo(`${receta.medico?.nombres} ${receta.medico?.apellidos}`, this.filtros.medico) &&
        this.filtrarPorEstado(receta.activo, this.filtros.estado)
      );
    });
  }

  filtrarPorCampo(valor: string, filtro: string): boolean {
    if (!filtro) return true;
    return valor?.toLowerCase().includes(filtro.toLowerCase()) || false;
  }

  filtrarPorEstado(activo: boolean, estadoFiltro: string): boolean {
    if (!estadoFiltro) return true;
    if (estadoFiltro === 'activo') return activo;
    if (estadoFiltro === 'inactivo') return !activo;
    return true;
  }

  limpiarFiltros() {
    this.filtros = {
      id: '',
      diagnostico: '',
      indicaciones: '',
      observaciones: '',
      fecha: '',
      paciente: '',
      medico: '',
      estado: ''
    };
    this.recetaList = [...this.recetaListOriginal];
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Receta Médica' : 'Editar Receta Médica';
    this.titleBoton = modo === 'C' ? 'Guardar Receta' : 'Actualizar Receta';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearReceta');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaReceta() {
    this.recetaSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  editarReceta(receta: Receta) {
    this.recetaSelected = receta;
    this.cargarDatosEnFormulario(receta);
    this.openModal('E');
  }

  cargarDatosEnFormulario(receta: Receta) {
    this.form.patchValue({
      fecha: receta.fecha,
      diagnostico: receta.diagnostico,
      indicaciones: receta.indicaciones,
      medicoId: receta.medico?.id || 1,
      pacienteId: receta.paciente?.id || 1,
      medicamentoIds: receta.medicamentos?.map(m => m.id) || [],
      observaciones: receta.observaciones,
      citaId: receta.citaId || 1,
      dosis: receta.dosis || ''
    });
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.patchValue({
      medicoId: 1,
      pacienteId: 1,
      medicamentoIds: [],
      citaId: 1,
      dosis: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  guardarReceta() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const recetaData: RecetaRq = this.form.getRawValue();
    console.log('Datos de la receta a enviar:', recetaData);

    this.loading = true;

    if (this.modoFormulario === 'C') {
      this.recetaService.guardarReceta(recetaData).subscribe({
        next: (data) => {
          console.log('Receta médica creada:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Receta médica creada correctamente', 'success');
          this.closeModal();
          this.listarRecetas();
        },
        error: (error) => {
          console.error('Error al crear receta médica:', error);
          this.loading = false;
          Swal.fire('Error', `Error al crear la receta médica: ${error.error?.message || error.message}`, 'error');
        }
      });
    } else {
      this.recetaService.actualizarReceta(this.recetaSelected!.id, recetaData).subscribe({
        next: (data) => {
          console.log('Receta médica actualizada:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Receta médica actualizada correctamente', 'success');
          this.closeModal();
          this.listarRecetas();
        },
        error: (error) => {
          console.error('Error al actualizar receta médica:', error);
          this.loading = false;
          Swal.fire('Error', `Error al actualizar la receta médica: ${error.error?.message || error.message}`, 'error');
        }
      });
    }
  }

  eliminarReceta(receta: Receta) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la receta médica del paciente ${receta.paciente?.nombres} ${receta.paciente?.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.recetaService.eliminarReceta(receta.id).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire('Eliminado', 'La receta médica ha sido eliminada correctamente', 'success');
            this.listarRecetas();
          },
          error: (error) => {
            console.error('Error al eliminar receta médica:', error);
            this.loading = false;
            Swal.fire('Error', `Error al eliminar la receta médica: ${error.error?.message || error.message}`, 'error');
          }
        });
      }
    });
  }

  buscarPorCita() {
    const citaId = prompt('Ingrese el ID de la cita:');
    if (citaId && !isNaN(Number(citaId))) {
      this.loading = true;
      this.recetaService.listarRecetasPorCita(Number(citaId)).subscribe({
        next: (data) => {
          this.recetaList = data;
          this.loading = false;
          console.log('Recetas de la cita:', data);
          Swal.fire('Búsqueda completada', `Se encontraron ${data.length} recetas para la cita`, 'success');
        },
        error: (error) => {
          console.error('Error al buscar recetas por cita:', error);
          this.loading = false;
          Swal.fire('Error', 'No se encontraron recetas para esta cita', 'error');
        }
      });
    }
  }
}



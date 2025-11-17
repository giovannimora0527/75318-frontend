import { Component } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion, EspecializacionRq, EspecializacionCreate } from './models/especializacion';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion | null = null;
  especializacionList: Especializacion[] = [];
  especializacionListOriginal: Especializacion[] = [];
  loading: boolean = false;
  
  form: FormGroup;
  
  // Filtros
  filtros = {
    id: '',
    codigoEspecializacion: '',
    nombre: '',
    descripcion: ''
  };

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarEspecializaciones();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      codigoEspecializacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarEspecializaciones() {
    this.loading = true;
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data;
        this.especializacionListOriginal = [...data];
        this.loading = false;
        console.log('Especializaciones cargadas:', data);
      },
      error: (error) => {
        console.error('Error al obtener especializaciones:', error);
        this.loading = false;
        Swal.fire('Error', 'Error al cargar las especializaciones', 'error');
      }
    });
  }

  // Métodos de filtrado
  aplicarFiltros() {
    this.especializacionList = this.especializacionListOriginal.filter(especializacion => {
      return (
        this.filtrarPorCampo(especializacion.id?.toString(), this.filtros.id) &&
        this.filtrarPorCampo(especializacion.codigoEspecializacion, this.filtros.codigoEspecializacion) &&
        this.filtrarPorCampo(especializacion.nombre, this.filtros.nombre) &&
        this.filtrarPorCampo(especializacion.descripcion, this.filtros.descripcion)
      );
    });
  }

  filtrarPorCampo(valor: string, filtro: string): boolean {
    if (!filtro) return true;
    return valor?.toLowerCase().includes(filtro.toLowerCase()) || false;
  }


  limpiarFiltros() {
    this.filtros = {
      id: '',
      codigoEspecializacion: '',
      nombre: '',
      descripcion: ''
    };
    this.especializacionList = [...this.especializacionListOriginal];
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
    this.titleBoton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaEspecializacion() {
    this.especializacionSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  editarEspecializacion(especializacion: Especializacion) {
    this.especializacionSelected = especializacion;
    this.cargarDatosEnFormulario(especializacion);
    this.openModal('E');
  }

  cargarDatosEnFormulario(especializacion: Especializacion) {
    this.form.patchValue({
      codigoEspecializacion: especializacion.codigoEspecializacion,
      nombre: especializacion.nombre,
      descripcion: especializacion.descripcion
    });
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  guardarEspecializacion() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const especializacionData: EspecializacionCreate = this.form.getRawValue();
    console.log('Datos de la especialización a enviar:', especializacionData);
    console.log('Formulario válido:', this.form.valid);
    console.log('Errores del formulario:', this.form.errors);
    console.log('Valores del formulario:', this.form.value);

    this.loading = true;

    if (this.modoFormulario === 'C') {
      this.especializacionService.crearEspecializacion(especializacionData).subscribe({
        next: (data) => {
          console.log('Especialización creada:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Especialización creada correctamente', 'success');
          this.closeModal();
          this.listarEspecializaciones();
        },
        error: (error) => {
          console.error('Error al crear especialización:', error);
          this.loading = false;
          Swal.fire('Error', `Error al crear la especialización: ${error.error?.message || error.message}`, 'error');
        }
      });
    } else {
      this.especializacionService.actualizarEspecializacion(this.especializacionSelected!.id, especializacionData).subscribe({
        next: (data) => {
          console.log('Especialización actualizada:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Especialización actualizada correctamente', 'success');
          this.closeModal();
          this.listarEspecializaciones();
        },
        error: (error) => {
          console.error('Error al actualizar especialización:', error);
          this.loading = false;
          Swal.fire('Error', `Error al actualizar la especialización: ${error.error?.message || error.message}`, 'error');
        }
      });
    }
  }

  buscarPorCodigo() {
    const codigo = prompt('Ingrese el código de la especialización:');
    if (codigo && codigo.trim()) {
      this.loading = true;
      this.especializacionService.buscarPorCodigo(codigo.trim()).subscribe({
        next: (data) => {
          this.especializacionList = [data];
          this.loading = false;
          console.log('Especialización encontrada:', data);
          Swal.fire('Búsqueda completada', `Especialización encontrada: ${data.nombre}`, 'success');
        },
        error: (error) => {
          console.error('Error al buscar especialización:', error);
          this.loading = false;
          Swal.fire('Error', 'No se encontró la especialización con ese código', 'error');
        }
      });
    }
  }
}

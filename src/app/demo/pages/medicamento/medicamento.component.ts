import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento, MedicamentoRq } from './models/medicamento';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento | null = null;
  medicamentoList: Medicamento[] = [];
  medicamentoListOriginal: Medicamento[] = [];
  loading: boolean = false;
  
  form: FormGroup;
  
  // Filtros
  filtros = {
    id: '',
    nombre: '',
    descripcion: '',
    presentacion: ''
  };

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarMedicamentos();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      presentacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    this.loading = true;
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentoList = data;
        this.medicamentoListOriginal = [...data];
        this.loading = false;
        console.log('Medicamentos cargados:', data);
      },
      error: (error) => {
        console.error('Error al obtener medicamentos:', error);
        this.loading = false;
        Swal.fire('Error', 'Error al cargar los medicamentos', 'error');
      }
    });
  }

  // Métodos de filtrado
  aplicarFiltros() {
    this.medicamentoList = this.medicamentoListOriginal.filter(medicamento => {
      return (
        this.filtrarPorCampo(medicamento.id?.toString(), this.filtros.id) &&
        this.filtrarPorCampo(medicamento.nombre, this.filtros.nombre) &&
        this.filtrarPorCampo(medicamento.descripcion, this.filtros.descripcion) &&
        this.filtrarPorCampo(medicamento.presentacion, this.filtros.presentacion)
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
      nombre: '',
      descripcion: '',
      presentacion: ''
    };
    this.medicamentoList = [...this.medicamentoListOriginal];
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  editarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.cargarDatosEnFormulario(medicamento);
    this.openModal('E');
  }

  cargarDatosEnFormulario(medicamento: Medicamento) {
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion
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

  guardarMedicamento() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const medicamentoData: MedicamentoRq = this.form.getRawValue();
    
    // Si es edición, agregar el ID
    if (this.modoFormulario === 'E' && this.medicamentoSelected) {
      medicamentoData.id = this.medicamentoSelected.id;
    }

    console.log('Datos del medicamento a enviar:', medicamentoData);
    console.log('Formulario válido:', this.form.valid);
    console.log('Errores del formulario:', this.form.errors);
    console.log('Valores del formulario:', this.form.value);

    this.loading = true;

    if (this.modoFormulario === 'C') {
      this.medicamentoService.guardarMedicamento(medicamentoData).subscribe({
        next: (data) => {
          console.log('Medicamento creado:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Medicamento creado correctamente', 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al crear medicamento:', error);
          this.loading = false;
          Swal.fire('Error', `Error al crear el medicamento: ${error.error?.message || error.message}`, 'error');
        }
      });
    } else {
      this.medicamentoService.actualizarMedicamento(this.medicamentoSelected!.id, medicamentoData).subscribe({
        next: (data) => {
          console.log('Medicamento actualizado:', data);
          this.loading = false;
          Swal.fire('Éxito', 'Medicamento actualizado correctamente', 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          console.error('Error al actualizar medicamento:', error);
          this.loading = false;
          Swal.fire('Error', `Error al actualizar el medicamento: ${error.error?.message || error.message}`, 'error');
        }
      });
    }
  }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
import { RespuestaRs } from 'src/app/models/respuesta-rs';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent {
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  filtro = {
    nombre: '',
    descripcion: '',
    presentacion: ''
  };

  medicamentoSeleccionado: Medicamento | null = null;
  form: FormGroup;
  modalInstance: Modal | null = null;
  modoFormulario: 'C' | 'E' | '' = '';
  titleModal = '';
  titleBoton = '';
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly medicamentoService: MedicamentoService
  ) {
    this.inicializarFormulario();
    this.listarMedicamentos();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      presentacion: ['']
    });
  }

  listarMedicamentos(): void {
    this.cargando = true;
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data || [];
        this.medicamentosFiltrados = [...this.medicamentos];
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No fue posible listar los medicamentos', 'error');
        this.cargando = false;
      }
    });
  }

  filtrar(): void {
    this.medicamentosFiltrados = this.medicamentos.filter(m =>
      (!this.filtro.nombre || (m.nombre || '').toLowerCase().includes(this.filtro.nombre.toLowerCase())) &&
      (!this.filtro.descripcion || (m.descripcion || '').toLowerCase().includes(this.filtro.descripcion.toLowerCase())) &&
      (!this.filtro.presentacion || (m.presentacion || '').toLowerCase().includes(this.filtro.presentacion.toLowerCase()))
    );
  }

  abrirNuevoMedicamento(): void {
    this.medicamentoSeleccionado = null;
    this.titleModal = 'Registrar Medicamento';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'C';
    this.form.reset();
    this.openModal();
  }

  abrirEditarMedicamento(medicamento: Medicamento): void {
    this.medicamentoSeleccionado = medicamento;
    this.titleModal = 'Editar Medicamento';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    this.form.patchValue(medicamento);
    this.openModal();
  }

  openModal(): void {
    const modalElement = document.getElementById('modalMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarMedicamento(): void {
    if (this.form.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'error');
      return;
    }

    const payload: Medicamento = { ...this.form.value };

    const obs =
      this.modoFormulario === 'C'
        ? this.medicamentoService.guardarMedicamento(payload)
        : this.medicamentoService.actualizarMedicamento(payload);

    this.cargando = true;
    obs.subscribe({
      next: (res: RespuestaRs) => {
        Swal.fire('Éxito', res.mensaje, 'success');
        this.closeModal();
        this.listarMedicamentos();
        this.cargando = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el medicamento', 'error');
        this.cargando = false;
      }
    });
  }
}
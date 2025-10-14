import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
import { CommonModule } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule],
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

  constructor(private readonly medicamentoService: MedicamentoService) {
    this.listarMedicamentos();
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentoList = data;
      },
      error: (error) => {
        console.error('Error al obtener medicamentos:', error);
      }
    });
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
    this.openModal('C');
  }

  editarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.openModal('E');
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarMedicamento() {
    if (this.modoFormulario === 'C') {
      // Lógica para crear
      Swal.fire('Información', 'Funcionalidad de crear medicamento pendiente de implementar', 'info');
    } else {
      // Lógica para actualizar
      Swal.fire('Información', 'Funcionalidad de actualizar medicamento pendiente de implementar', 'info');
    }
  }
}

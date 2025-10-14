import { Component } from '@angular/core';
import { HistoriaMedicaService } from './service/historia-medica.service';
import { HistoriaMedica } from './models/historia-medica';
import { CommonModule } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-medica',
  imports: [CommonModule],
  templateUrl: './historia-medica.component.html',
  styleUrl: './historia-medica.component.scss'
})
export class HistoriaMedicaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  historiaSelected: HistoriaMedica | null = null;
  historiaList: HistoriaMedica[] = [];

  constructor(private readonly historiaMedicaService: HistoriaMedicaService) {
    this.listarHistorias();
  }

  listarHistorias() {
    this.historiaMedicaService.listarHistorias().subscribe({
      next: (data) => {
        this.historiaList = data;
      },
      error: (error) => {
        console.error('Error al obtener historias médicas:', error);
      }
    });
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Historia Médica' : 'Editar Historia Médica';
    this.titleBoton = modo === 'C' ? 'Guardar Historia' : 'Actualizar Historia';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearHistoria');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaHistoria() {
    this.historiaSelected = null;
    this.openModal('C');
  }

  editarHistoria(historia: HistoriaMedica) {
    this.historiaSelected = historia;
    this.openModal('E');
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarHistoria() {
    if (this.modoFormulario === 'C') {
      Swal.fire('Información', 'Funcionalidad de crear historia médica pendiente de implementar', 'info');
    } else {
      Swal.fire('Información', 'Funcionalidad de actualizar historia médica pendiente de implementar', 'info');
    }
  }
}


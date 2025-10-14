import { Component } from '@angular/core';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { CommonModule } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class CitaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  citaSelected: Cita | null = null;
  citaList: Cita[] = [];

  constructor(private readonly citaService: CitaService) {
    this.listarCitas();
  }

  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.citaList = data;
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Cita' : 'Editar Cita';
    this.titleBoton = modo === 'C' ? 'Guardar Cita' : 'Actualizar Cita';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearCita');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaCita() {
    this.citaSelected = null;
    this.openModal('C');
  }

  editarCita(cita: Cita) {
    this.citaSelected = cita;
    this.openModal('E');
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarCita() {
    if (this.modoFormulario === 'C') {
      Swal.fire('Información', 'Funcionalidad de crear cita pendiente de implementar', 'info');
    } else {
      Swal.fire('Información', 'Funcionalidad de actualizar cita pendiente de implementar', 'info');
    }
  }
}

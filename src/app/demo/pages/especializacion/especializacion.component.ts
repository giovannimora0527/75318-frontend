import { Component } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule],
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

  constructor(private readonly especializacionService: EspecializacionService) {
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data;
      },
      error: (error) => {
        console.error('Error al obtener especializaciones:', error);
      }
    });
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
    this.openModal('C');
  }

  editarEspecializacion(especializacion: Especializacion) {
    this.especializacionSelected = especializacion;
    this.openModal('E');
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarEspecializacion() {
    if (this.modoFormulario === 'C') {
      Swal.fire('Información', 'Funcionalidad de crear especialización pendiente de implementar', 'info');
    } else {
      Swal.fire('Información', 'Funcionalidad de actualizar especialización pendiente de implementar', 'info');
    }
  }
}

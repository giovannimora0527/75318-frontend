import { Component } from '@angular/core';
import { FormulaMedicaService } from './service/formula-medica.service';
import { FormulaMedica } from './models/formula-medica';
import { CommonModule } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula-medica',
  imports: [CommonModule],
  templateUrl: './formula-medica.component.html',
  styleUrl: './formula-medica.component.scss'
})
export class FormulaMedicaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: FormulaMedica | null = null;
  formulaList: FormulaMedica[] = [];

  constructor(private readonly formulaMedicaService: FormulaMedicaService) {
    this.listarFormulas();
  }

  listarFormulas() {
    this.formulaMedicaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulaList = data;
      },
      error: (error) => {
        console.error('Error al obtener fórmulas médicas:', error);
      }
    });
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Fórmula Médica' : 'Editar Fórmula Médica';
    this.titleBoton = modo === 'C' ? 'Guardar Fórmula' : 'Actualizar Fórmula';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaFormula() {
    this.formulaSelected = null;
    this.openModal('C');
  }

  editarFormula(formula: FormulaMedica) {
    this.formulaSelected = formula;
    this.openModal('E');
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarFormula() {
    if (this.modoFormulario === 'C') {
      Swal.fire('Información', 'Funcionalidad de crear fórmula médica pendiente de implementar', 'info');
    } else {
      Swal.fire('Información', 'Funcionalidad de actualizar fórmula médica pendiente de implementar', 'info');
    }
  }
}

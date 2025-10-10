import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';

// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-medico',
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  /**
   * Variables para el modal.
   */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;

  /**
   * Variables para la tabla de datos o datatable.
   */
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];

  constructor(private readonly medicoService: MedicoService,
    private readonly utilApiService: UtilApiService
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
  }

  listarEspecializaciones() {
    this.utilApiService.listarEspecializaciones().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.especializacionList = data;
        },
        error: (error) => {
          console.error('Error fetching especializaciones:', error);  
        }
      }
    );
  }

  listarMedicos() {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        this.medicoList = data;        
      },
      error: (error) => {
        console.error('Error fetching medico list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
    this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = null;
    this.openModal('C');
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    console.log(medico);
    this.openModal('E');
  }


  guardarMedico() {

  }
}

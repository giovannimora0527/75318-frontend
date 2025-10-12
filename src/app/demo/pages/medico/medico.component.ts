import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { Medico } from './models/medico';
import { CommonModule } from '@angular/common';

// Importa los objetos necesarios de Bootstrap
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  form: FormGroup;

  /**
   * Variables para la tabla de datos o datatable.
   */
  medicoList: Medico[] = [];
  especializacionList: Especializacion[] = [];

  constructor(private readonly medicoService: MedicoService,
    private readonly utilApiService: UtilApiService,
    private readonly formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
    this.listarMedicos();
    this.listarEspecializaciones();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      registroProfesional: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      especializacionId: ['', [Validators.required]]
    });
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
          Swal.fire('Error', 'No se pudieron cargar las especializaciones', 'error');
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
        Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
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
    this.limpiarFormulario();
    this.openModal('C');
  }

  editarModalMedico(medico: Medico) {
    this.medicoSelected = medico;
    console.log(medico);
    this.cargarDatosFormulario(medico);
    this.openModal('E');
  }

  cargarDatosFormulario(medico: Medico) {
    this.form.patchValue({
      tipoDocumento: medico.tipoDocumento,
      documento: medico.documento,
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      telefono: medico.telefono,
      registroProfesional: medico.registroProfesional,
      especializacionId: medico.especializacion?.id || ''
    });
  }

  guardarMedico() {
    // Validar formulario
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      this.form.markAllAsTouched();
      return;
    }

    const medicoData: Medico = {
      ...this.form.getRawValue(),
      id: this.medicoSelected?.id || 0
    };

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.medicoService.guardarMedico(medicoData).subscribe({
        next: (data) => {
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al guardar médico:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo guardar el médico', 'error');
        }
      });
    } else {
      // Modo Edición
      this.medicoService.actualizarMedico(medicoData).subscribe({
        next: (data) => {
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          console.error('Error al actualizar médico:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo actualizar el médico', 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      tipoDocumento: '',
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      registroProfesional: '',
      especializacionId: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

import { Component } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentosComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamentos: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento | null = null;
  titleSpinner: string = 'Cargando...';


  form: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: [''],
      presentacion: [''],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    }, {
      validators: this.validarFechas() // ← Validador personalizado a nivel de formulario
    });

    // Escuchar cambios en las fechas para revalidar
    this.form.get('fechaCompra')?.valueChanges.subscribe(() => {
      this.form.get('fechaVence')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    this.form.get('fechaVence')?.valueChanges.subscribe(() => {
      this.form.get('fechaCompra')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  /**
   * Validador personalizado para fechas
   */
  validarFechas() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fechaCompra = formGroup.get('fechaCompra')?.value;
      const fechaVence = formGroup.get('fechaVence')?.value;

      // Si alguna fecha está vacía, no validar (ya lo hace Validators.required)
      if (!fechaCompra || !fechaVence) {
        return null;
      }

      const compra = new Date(fechaCompra);
      const vencimiento = new Date(fechaVence);

      // Validar que fecha de compra sea anterior a fecha de vencimiento
      if (compra >= vencimiento) {
        return { fechasInvalidas: true };
      }

      return null;
    };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Verifica si hay error de fechas inválidas
   */
  get tieneFechasInvalidas(): boolean {
    return this.form.hasError('fechasInvalidas') &&
      (this.form.get('fechaCompra')?.touched || this.form.get('fechaVence')?.touched);
  }

  listarMedicamentos() {
    this.titleSpinner = 'Cargando datos...';
    this.spinner.show();
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;
        console.log('Medicamentos cargados:', this.medicamentos);
        this.spinner.hide();

      },
      error: (error) => {
        console.error('Error al listar medicamentos', error);
        this.spinner.hide();

        Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
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

  abrirEditarMedicamento(m: Medicamento) {
    this.medicamentoSelected = m;

    // Formatear fechas para input type="date"
    const formatDate = (d: string | Date | null | undefined) => {
      if (!d) return '';
      const date = new Date(d);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    this.form.patchValue({
      nombre: m.nombre || '',
      descripcion: m.descripcion || '',
      presentacion: m.presentacion || '',
      fechaCompra: formatDate(m.fechaCompra),
      fechaVence: formatDate(m.fechaVence)
    });

    this.openModal('E');
  }

  guardarMedicamento() {
    // Marcar todos los campos como tocados para mostrar errores
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form);

      // Mensaje específico para fechas inválidas
      if (this.form.hasError('fechasInvalidas')) {
        Swal.fire(
          'Error en fechas',
          'La fecha de compra debe ser anterior a la fecha de vencimiento.',
          'error'
        );
      } else {
        Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
      }
      return;
    }
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando fórmula...' : 'Actualizando fórmula...';
    this.spinner.show();
    // Mostrar loading
    Swal.fire({
      title: this.modoFormulario === 'C' ? 'Guardando medicamento...' : 'Actualizando medicamento...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.modoFormulario === 'C') {
      // Modo Creación
      this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();

          Swal.close();
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicamentos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();

          Swal.close();
          console.error('Error al guardar medicamento:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo guardar el medicamento', 'error');
        }
      });
    } else {
      // Modo Edición
      const medicamentoActualizado: Medicamento = {
        ...this.form.getRawValue(),
        id: this.medicamentoSelected!.id
      };

      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
        next: (data) => {
          this.spinner.hide();

          Swal.close();
          if (data.status === 200) {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarMedicamentos();
          } else {
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();

          Swal.close();
          console.error('Error al actualizar medicamento:', error);
          Swal.fire('Error', error.error?.message || 'No se pudo actualizar el medicamento', 'error');
        }
      });
    }
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCompra: '',
      fechaVence: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}

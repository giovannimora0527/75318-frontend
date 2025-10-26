import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { UtilApiService } from 'src/app/services/common/util-api.service';

import Swal from 'sweetalert2';

import Modal from 'bootstrap/js/dist/modal';

import { Medicamento } from './models/medicamento';

import { MedicamentoService } from './service/medicamento.service';

@Component({

  selector: 'app-medicamento',

  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],

  templateUrl: './medicamento.component.html',

  styleUrl: './medicamento.component.scss'

})

export class MedicamentoComponent {

  /**

   * Variables para el modal.

   */

  modalInstance: Modal | null = null;

  modoFormulario: string = '';

  titleModal: string = '';

  titleBoton: string = '';

  medicamentoSelected: Medicamento | null = null;

  titleSpinner: string = 'Cargando...';

  /**

   * Variables para la tabla de datos o datatable.

   */

  medicamentoList: Medicamento[] = [];

  filteredMedicamento: Medicamento[] = [];

  filtros: Record<string, string> = {};

  form: FormGroup;

  constructor(

    private readonly medicamentoService: MedicamentoService,

    private readonly formBuilder: FormBuilder,

    private readonly utilApiService: UtilApiService,

    private readonly spinner: NgxSpinnerService

  ) {

    this.listarMedicamentos();

    this.inicializarFormulario();

  }

  inicializarFormulario() {

    this.form = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.minLength(3)]],

      descripcion: ['', [Validators.required, Validators.minLength(4)]],

      presentacion: ['', [Validators.required, Validators.minLength(3)]],

      fechaCompra: ['', [Validators.required]],

      fechaVence: ['', [Validators.required]],

    });

  }

  get f(): { [key: string]: AbstractControl } {

    return this.form.controls;

  }

  listarMedicamentos() {

    this.medicamentoService.listarMedicamentos().subscribe({

      next: (data) => {

        this.medicamentoList = data;

        this.filteredMedicamento = data;

      },

      error: (error) => {

        console.error('Error fetching medicamento list:', error);

      }

    });

  }

  closeModal() {

    if (this.modalInstance) {

      this.modalInstance.hide();

    }

  }

  openModal(modo: string) {

    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';

    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';

    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearMedicamento');

    if (modalElement) {

      // Verificar si ya existe una instancia del modal

      this.modalInstance ??= new Modal(modalElement);

      this.modalInstance.show();

    }

  }

  abrirNuevoMedicamento() {

    this.medicamentoSelected = null;

    this.form.reset();

    this.openModal('C');

  }

  editarModalMedicamento(medicamento: Medicamento) {

    this.medicamentoSelected = medicamento;

    console.log(medicamento);

    this.form.patchValue(medicamento);

    this.openModal('E');

  }

  guardarMedicamento() {

    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando Medicamento...' : 'Actualizando Medicamento...';

    this.spinner.show();

    if (this.form.invalid) {

      // Manejar el formulario inválido

      this.spinner.hide();

      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');

      return;

    }

    if (this.modoFormulario === 'C') {

      // Crear

      this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({

        next: (data) => {

          if (data.status === 200) {

            this.spinner.hide();

            Swal.fire('Éxito', data.mensaje, 'success');

            this.closeModal();

            this.listarMedicamentos();

          } else {

            this.spinner.hide();

            Swal.fire('Error', data.mensaje, 'error');

          }

        },

        error: (error) => {

          this.spinner.hide();

          Swal.fire('Error', error.error.message, 'error');

        }

      });

    } else {

      // Actualizar

      if (!this.medicamentoSelected) {

        this.spinner.hide();

        Swal.fire('Error', 'No hay medicamento seleccionado', 'error');

        return;

      }

      const medicamentoActualizado: Medicamento = this.form.getRawValue();

      medicamentoActualizado.id = this.medicamentoSelected.id;

      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({

        next: (data) => {

          if (data.status === 200) {

            this.spinner.hide();

            Swal.fire('Éxito', data.mensaje, 'success');

            this.closeModal();

            this.listarMedicamentos();

          } else {

            this.spinner.hide();

            Swal.fire('Error', data.mensaje, 'error');

          }

        },

        error: (error) => {

          this.spinner.hide();

          Swal.fire('Error', error.error.message, 'error');

        }

      });

    }

  }

  filtrar(columna: string, valor: string) {

    this.filtros[columna] = valor.toLowerCase(); // guardar filtro

    this.filteredMedicamento = this.medicamentoList.filter((p) => {

      return Object.keys(this.filtros).every((key) => {

        const filtroValor = this.filtros[key];

        if (!filtroValor) return true; // si el campo está vacío, no filtra

        const campo = (p as Record<string, unknown>)[key]?.toString().toLowerCase() || '';

        return campo.includes(filtroValor);

      });

    });

  }

}


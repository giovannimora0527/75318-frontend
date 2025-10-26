import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { UtilApiService } from 'src/app/services/common/util-api.service';

import Swal from 'sweetalert2';

import Modal from 'bootstrap/js/dist/modal';

import { Especializacion } from './models/especializacion';

import { EspecializacionService } from './service/especializacion.service';

@Component({

  selector: 'app-especializacion',

  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],

  templateUrl: './especializacion.component.html',

  styleUrl: './especializacion.component.scss'

})

export class EspecializacionComponent {

  /**

   * Variables para el modal.

   */

  modalInstance: Modal | null = null;

  modoFormulario: string = '';

  titleModal: string = '';

  titleBoton: string = '';

  especializacionSelected: Especializacion | null = null;

  titleSpinner: string = 'Cargando...';

  /**

   * Variables para la tabla de datos o datatable.

   */

  especializacionList: Especializacion[] = [];

  filteredEspecializacion: Especializacion[] = [];

  filtros: Record<string, string> = {};


  form: FormGroup;

  constructor(

    private readonly especializacionService: EspecializacionService,

    private readonly formBuilder: FormBuilder,

    private readonly utilApiService: UtilApiService,

    private readonly spinner: NgxSpinnerService

  ) {

    this.listarEspecializacion();

    this.inicializarFormulario();

  }

  inicializarFormulario() {

    this.form = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.minLength(3)]],

      descripcion: ['', [Validators.required, Validators.minLength(4)]],

      codigoEspecializacion: ['', [Validators.required]],

    });

  }

  get f(): { [key: string]: AbstractControl } {

    return this.form.controls;

  }

  listarEspecializacion() {

    this.especializacionService.listarEspecializacion().subscribe({

      next: (data) => {

        this.especializacionList = data;

        this.filteredEspecializacion = data;

      },

      error: (error) => {

        console.error('Error fetching paciente list:', error);

      }

    });

  }

  closeModal() {

    if (this.modalInstance) {

      this.modalInstance.hide();

    }

  }

  openModal(modo: string) {

    this.titleModal = modo === 'C' ? 'Crear Especializacion' : 'Editar Especializacion';

    this.titleBoton = modo === 'C' ? 'Guardar Especializacion' : 'Actualizar Especializacion';

    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearEspecializacion');

    if (modalElement) {

      // Verificar si ya existe una instancia del modal

      this.modalInstance ??= new Modal(modalElement);

      this.modalInstance.show();

    }

  }

  abrirNuevoEspecializacion() {

    this.especializacionSelected = null;

    this.openModal('C');

  }

  editarModalEspecializacion(especializacion: Especializacion) {

    this.especializacionSelected = especializacion;

    console.log(especializacion);

    this.openModal('E');

  }

  guardarEspecializacion() {

    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando Especializacion...' : 'Actualizando Especializacion...';

    this.spinner.show();

    if (this.form.invalid) {

      // Manejar el formulario inválido

      this.spinner.hide();

      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');

      return;

    }

    if (this.modoFormulario === 'C') {

      // Crear

      this.especializacionService.guardarEspecializacion(this.form.getRawValue()).subscribe({

        next: (data) => {

          if (data.status === 200) {

            this.spinner.hide();

            Swal.fire('Éxito', data.mensaje, 'success');

            this.closeModal();

            this.listarEspecializacion();

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

      if (!this.especializacionSelected) {

        this.spinner.hide();

        Swal.fire('Error', 'No hay especialización seleccionada', 'error');

        return;

      }

      const usuarioActualizado: Especializacion = this.form.getRawValue();

      usuarioActualizado.id = this.especializacionSelected.id;

      this.especializacionService.actualizarEspecializacion(usuarioActualizado).subscribe({

        next: (data) => {

          if (data.status === 200) {

            this.spinner.hide();

            Swal.fire('Éxito', data.mensaje, 'success');

            this.closeModal();

            this.listarEspecializacion();

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

    this.filteredEspecializacion = this.especializacionList.filter((p) => {

      return Object.keys(this.filtros).every((key) => {

        const filtroValor = this.filtros[key];

        if (!filtroValor) return true; // si el campo está vacío, no filtra

        const campo = (p as Record<string, unknown>)[key]?.toString().toLowerCase() || '';

        return campo.includes(filtroValor);

      });

    });

  }

}

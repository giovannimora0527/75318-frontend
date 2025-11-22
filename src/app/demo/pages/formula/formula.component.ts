import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import Swal from 'sweetalert2';
import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';
import Modal from 'bootstrap/js/dist/modal';

import { CitaService } from '../cita/service/cita.service';
import { MedicamentoService } from '../medicamento/service/medicamento.service';


@Component({
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  /**
     * Variables para el modal.
     */
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';

  /**
   * Variables para la tabla de datos o datatable.
   */
  formulaList: Formula[] = [];
  filteredFormula: Formula[] = [];
  filtros: any = {};
  citasList: any[] = [];
  medicamentosList: any[] = [];


  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly citaService: CitaService,
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly utilApiService: UtilApiService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarReceta();
    this.listarCitas();
    this.listarMedicamentos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required, Validators.minLength(2)]],
      indicaciones: ['', [Validators.required, Validators.minLength(4)]],

    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarReceta() {
    this.formulaService.listarRecetas().subscribe({
      next: (data) => {
        this.formulaList = data;
        this.filteredFormula = data;
      },
      error: (error) => {
        console.error('Error fetching formula list:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula' : 'Editar Formula';
    this.titleBoton = modo === 'C' ? 'Guardar Formula' : 'Actualizar Formula';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoReceta() {
    this.formulaSelected = null;

    // 🔹 Resetear el formulario con valores por defecto
    this.form.reset({
      citaId: null,
      medicamentoId: null,
      dosis: '',
      indicaciones: '',

    });
    this.form.get('citaId')?.enable(); // ✅ Se puede elegir cita al crear
    this.openModal('C');
  }


  editarModalFormula(formula: Formula) {
    this.formulaSelected = formula;
    console.log('formula (al editar):', formula);

    // Buscar el objeto correspondiente en las listas (por ID)
    const citaSeleccionada = this.citasList.find(c => c.id === (formula.citaId?.id || formula.citaId));
    const medicamentoSeleccionado = this.medicamentosList.find(m => m.id === (formula.medicamentoId?.id || formula.medicamentoId));

    // 🧠 Cargamos los valores en el formulario
    this.form.patchValue({
      citaId: citaSeleccionada || formula.citaId,
      medicamentoId: medicamentoSeleccionado || formula.medicamentoId,
      dosis: formula.dosis,
      indicaciones: formula.indicaciones,
    });
    this.form.get('citaId')?.disable(); // 🚫 No se puede cambiar la cita
    this.openModal('E');
  }

  guardarFormula() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando formula...' : 'Actualizando formula...';
    this.spinner.show();
    if (this.form.invalid) {
      // Manejar el formulario inválido
      this.spinner.hide();
      Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear
      const payload = {
        id: 0, // 👈 se agrega este campo para evitar el error 400
        ...this.form.getRawValue(),
        citaId: this.form.value.citaId?.id,
        medicamentoId: this.form.value.medicamentoId?.id,

      };

      console.log('📦 Payload para guardar:', payload);

      this.formulaService.guardarReceta(payload).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarReceta();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error respuesta backend (guardar):', error);
          console.log('error.error:', error?.error);
          Swal.fire('Error', error?.error?.message || 'Error del servidor', 'error');
        }
      });
    }

    else {
      // Actualizar
      const formulaActualizado = {
        ...this.form.getRawValue(),
        id: this.formulaSelected.id,

        // 🔒 La cita NO se puede cambiar
        citaId: this.formulaSelected.citaId?.id,

        medicamentoId: this.form.value.medicamentoId?.id ?? this.formulaSelected.medicamentoId?.id,
        dosis: this.form.value.dosis,
        indicaciones: this.form.value.indicaciones,

        // 🟢 Campos requeridos por el backend para no romper
        fechaCreacionRegistro: this.formulaSelected.fechaCreacionRegistro,
        fechaActualizacionRegistro: null
      };
      
      console.log('Payload para actualizar:', formulaActualizado);

      this.formulaService.actualizarReceta(formulaActualizado).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.spinner.hide();
            Swal.fire('Éxito', data.mensaje, 'success');
            this.closeModal();
            this.listarReceta();
          } else {
            this.spinner.hide();
            Swal.fire('Error', data.mensaje, 'error');
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error backend:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }
  filtrar(columna: string, valor: string) {
    this.filtros[columna] = valor.toLowerCase();

    this.filteredFormula = this.formulaList.filter((p) => {
      return Object.keys(this.filtros).every((key) => {
        const filtroValor = this.filtros[key];
        if (!filtroValor) return true;

        let campo = '';

        //  Casos especiales para objetos anidados
        switch (key) {
          case 'citaId':
            campo = p.citaId?.id?.toString().toLowerCase() || '';
            break;
          case 'medicamentoId':
            // Puedes filtrar por nombre o ID
            campo =
              p.medicamentoId?.nombre?.toLowerCase() ||
              p.medicamentoId?.id?.toString().toLowerCase() ||
              '';
            break;
          default:
            campo = p[key]?.toString().toLowerCase() || '';
        }
        return campo.includes(filtroValor);
      });
    });
  }


  listarCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.citasList = data;
      },
      error: (error) => {
        console.error('Error fetching cita list:', error);
      }
    });
  }

  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentosList = data;
      },
      error: (error) => {
        console.error('Error al listar medicamentos:', error);
      }
    });
  }

}

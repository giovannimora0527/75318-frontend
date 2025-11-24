import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent implements OnInit {

  medicamentos: Medicamento[] = [];
  form!: FormGroup;

  titleSpinner = 'Cargando...';
  titleModal = 'Nuevo Medicamento';
  titleBoton = 'Guardar';

  modoFormulario = 'N';
  medicamentoSelected: Medicamento | null = null;

  constructor(
    private medicamentoService: MedicamentoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      presentacion: [''],
      fechaCompra: [''],
      fechaVence: ['']
    });

    this.obtenerMedicamentos();
  }

  obtenerMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe(resp => {
      this.medicamentos = resp;
      console.log('Medicamentos cargados:', resp);
    });
  }

  abrirNuevoMedicamento() {
    this.modoFormulario = 'N';
    this.titleModal = 'Nuevo Medicamento';
    this.titleBoton = 'Guardar';
    this.form.reset();
    this.medicamentoSelected = null;
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Medicamento';
    this.titleBoton = 'Actualizar';
    this.medicamentoSelected = medicamento;

    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: medicamento.fechaCompra,
      fechaVence: medicamento.fechaVence
    });
  }

guardarMedicamento() {
  const datos = this.form.value;
  if (this.modoFormulario === 'N') {
    this.medicamentoService.guardarMedicamento(datos).subscribe(resp => {
      console.log('Medicamento guardado', resp);
      this.obtenerMedicamentos();
    });
  } else {
    const id = this.medicamentoSelected?.id!;
    this.medicamentoService.actualizarMedicamento(id, datos).subscribe(resp => {
      console.log('Medicamento actualizado', resp);
      this.obtenerMedicamentos();
    });
  }
  }
    }

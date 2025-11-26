import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormulaService } from './service/formula.service';
import { Formula } from './model/formula';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent implements OnInit {

  formulaForm!: FormGroup;
  formulas: Formula[] = [];
  loading = false;

  citas: any[] = [];
  medicamentos: any[] = [];

  rol: string = '';
  isAdminOrMedico: boolean = false;   // PERMISOS

  constructor(
    private fb: FormBuilder,
    private formulaService: FormulaService
  ) {
    // Aquí SI EXISTE "rol" en localStorage
    this.rol = localStorage.getItem('rol') || '';

    // Administrador o Médico pueden crear, editar y eliminar
    this.isAdminOrMedico = this.rol === 'ADMIN' || this.rol === 'MEDICO';
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarCitas();
    this.cargarMedicamentos();
    this.listar();
  }

  crearFormulario(): void {
    this.formulaForm = this.fb.group({
      id: [null],
      cita: ['', Validators.required],
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required],
      indicaciones: ['', Validators.required]
    });
  }

  cargarCitas(): void {
    this.citas = [
      { id: 1, descripcion: 'Cita 1' },
      { id: 2, descripcion: 'Cita 2' }
    ];
  }

  cargarMedicamentos(): void {
    this.medicamentos = [
      { id: 1, nombre: 'Acetaminofén' },
      { id: 2, nombre: 'Ibuprofeno' }
    ];
  }

  listar(): void {
    this.loading = true;
    this.formulaService.listar().subscribe({
      next: (data) => {
        this.formulas = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  guardar(): void {
    if (!this.isAdminOrMedico) return;  // seguridad en frontend

    if (this.formulaForm.invalid) return;

    const formula: Formula = this.formulaForm.value;
    const method = formula.id ? 'actualizar' : 'guardar';

    this.formulaService[method](formula).subscribe(() => {
      this.listar();
      this.formulaForm.reset();
    });
  }

  editar(item: Formula): void {
    if (!this.isAdminOrMedico) return;
    this.formulaForm.patchValue(item);
  }

  eliminar(id: number): void {
    if (!this.isAdminOrMedico) return;
    this.formulaService.eliminar(id).subscribe(() => {
      this.listar();
    });
  }
}

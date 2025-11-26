import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicamentoService } from './service/medicamento.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent implements OnInit {

  medicamentoForm!: FormGroup;
  medicamentos: any[] = [];
  editando = false;

  rol: string = '';
  isAdminOrMedico: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicamentoService: MedicamentoService
  ) {
    this.rol = localStorage.getItem('rol') || '';
    this.isAdminOrMedico = ['ADMIN', 'MEDICO'].includes(this.rol);
  }

  ngOnInit(): void {
    this.medicamentoForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presentacion: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      fechaVence: ['', Validators.required]
    });

    this.listar();
  }

  listar(): void {
    this.medicamentoService.listar().subscribe(res => {
      this.medicamentos = res;
    });
  }

  guardar(): void {
    if (!this.isAdminOrMedico) return;

    const data = this.medicamentoForm.value;

    if (!this.editando) {
      this.medicamentoService.guardar(data).subscribe(res => {
        alert(res.mensaje);
        this.listar();
        this.medicamentoForm.reset();
      });
    } else {
      this.medicamentoService.actualizar(data).subscribe(res => {
        alert(res.mensaje);
        this.listar();
        this.medicamentoForm.reset();
        this.editando = false;
      });
    }
  }

  editar(item: any): void {
    if (!this.isAdminOrMedico) return;

    this.editando = true;
    this.medicamentoForm.patchValue(item);
  }

  eliminar(id: number): void {
    if (!this.isAdminOrMedico) return;

    if (confirm('¿Seguro que deseas eliminar este medicamento?')) {
      this.medicamentoService.eliminar(id).subscribe(res => {
        alert(res.mensaje);
        this.listar();
      });
    }
  }
}

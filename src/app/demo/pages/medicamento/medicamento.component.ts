import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentoService, Medicamento } from './service/medicamento.service';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent implements OnInit {
  medicamentos: Medicamento[] = [];

  constructor(private medicamentoService: MedicamentoService) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {
    this.medicamentoService.listar().subscribe({
      next: (data) => {
        this.medicamentos = data;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos', err);
      }
    });
  }
}

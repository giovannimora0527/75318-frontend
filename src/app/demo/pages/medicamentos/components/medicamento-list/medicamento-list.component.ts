import { Component, OnInit } from '@angular/core';
import { MedicamentoService } from '../../medicamento.service';
import { Medicamento } from '../../medicamento.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicamento-list',
  templateUrl: './medicamento-list.component.html',
  styleUrls: ['./medicamento-list.component.scss']
})
export class MedicamentoListComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  loading = true;

  constructor(private medicamentoService: MedicamentoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos() {
    this.loading = true;
    this.medicamentoService.listarMedicamentos().subscribe({
      next: data => {
        this.medicamentos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
      }
    });
  }

  nuevoMedicamento() {
    this.router.navigate(['/medicamentos/nuevo']);
  }

  editarMedicamento(id: number) {
    this.router.navigate(['/medicamentos/editar', id]);
  }
}

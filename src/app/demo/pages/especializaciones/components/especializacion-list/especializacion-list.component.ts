import { Component, OnInit } from '@angular/core';
import { Especializacion } from '../../models/especializacion.model';
import { EspecializacionService } from '../../services/especializacion.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-especializacion-list',
  templateUrl: './especializacion-list.component.html',
  styleUrls: ['./especializacion-list.component.scss']
})
export class EspecializacionListComponent implements OnInit {
  especializaciones: Especializacion[] = [];
  loading = true;
  filtro = '';

  constructor(private servicio: EspecializacionService, private router: Router) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.servicio.listar().subscribe({
      next: data => { this.especializaciones = data; this.loading = false; },
      error: err => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las especializaciones', 'error');
      }
    });
  }

  buscarPorCodigo() {
    if (!this.filtro) {
      this.cargar();
      return;
    }
    this.loading = true;
    this.servicio.buscarPorCodigo(this.filtro).subscribe({
      next: data => {
        this.especializaciones = [data];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        Swal.fire('No encontrado', 'No existe una especialización con ese código', 'info');
      }
    });
  }

  editar(espec: Especializacion) {
    this.router.navigate(['/especializaciones/editar', espec.id]);
  }
}

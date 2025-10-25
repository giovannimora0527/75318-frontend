import { Component, OnInit } from '@angular/core';
import { Receta } from '../../models/receta.model';
import { RecetaService } from '../../services/receta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receta-list',
  templateUrl: './receta-list.component.html',
  styleUrls: ['./receta-list.component.scss']
})
export class RecetaListComponent implements OnInit {
  recetas: Receta[] = [];
  loading = true;

  constructor(private recetaService: RecetaService) {}

  ngOnInit(): void {
    this.cargarRecetas();
  }

  cargarRecetas() {
    this.loading = true;
    this.recetaService.listarRecetas().subscribe({
      next: data => { 
        this.recetas = data; 
        this.loading = false; 
      },
      error: err => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar las recetas', 'error');
      }
    });
  }
}

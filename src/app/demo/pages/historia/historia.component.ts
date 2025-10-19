import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HistoriaService, Historia } from './service/historia.service';

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [HistoriaService],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss']
})
export class HistoriaComponent implements OnInit {

  historias: Historia[] = [];

  constructor(private historiaService: HistoriaService) {}

  ngOnInit(): void {
    this.cargarHistorias();
  }

  cargarHistorias(): void {
    this.historiaService.listar().subscribe({
      next: (data) => {
        this.historias = data;
        console.log('Historias cargadas:', this.historias);
      },
      error: (err) => console.error('Error al cargar historias', err)
    });
  }
}

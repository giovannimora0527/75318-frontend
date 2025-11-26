import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { AuditoriaService } from './service/auditoria.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, DatePipe],   // 👈 OBLIGATORIO
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {

  loading = false;
  error = '';
  registros: any[] = [];

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.loading = true;
    this.auditoriaService.listarTodos().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando auditoría';
        this.loading = false;
      }
    });
  }
}

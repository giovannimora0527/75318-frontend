import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from './service/auditoria.service';
import { AuditoriaLog } from './models/auditoria-log';
import { AuditoriaFiltro } from './models/auditoria-filtro';
import { PageResponse } from './models/page-response';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit {

  auditoriaList: AuditoriaLog[] = [];
  pageResponse: PageResponse<AuditoriaLog> | null = null;

  filtro: AuditoriaFiltro = {
    username: '',
    tipoEvento: '',
    fechaInicio: '',
    fechaFin: '',
    pagina: 0,
    tamanoPagina: 10
  };

  tiposEvento: string[] = [
    'LOGIN_EXITOSO',
    'LOGIN_FALLIDO',
    'RECUPERACION_PASSWORD',
    'BLOQUEO_USUARIO',
    'DESBLOQUEO_USUARIO'
  ];

  cargando: boolean = false;

  constructor(private readonly auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;

    const filtroLimpio: any = {
      pagina: this.filtro.pagina,
      tamanoPagina: this.filtro.tamanoPagina
    };

    if (this.filtro.username && this.filtro.username.trim()) {
      filtroLimpio.username = this.filtro.username.trim();
    }
    if (this.filtro.tipoEvento && this.filtro.tipoEvento.trim()) {
      filtroLimpio.tipoEvento = this.filtro.tipoEvento.trim();
    }
    if (this.filtro.fechaInicio && this.filtro.fechaInicio.trim()) {
      filtroLimpio.fechaInicio = this.filtro.fechaInicio.trim();
    }
    if (this.filtro.fechaFin && this.filtro.fechaFin.trim()) {
      filtroLimpio.fechaFin = this.filtro.fechaFin.trim();
    }

    this.auditoriaService.buscarConFiltros(filtroLimpio).subscribe({
      next: (response) => {
        this.pageResponse = response;
        
        this.auditoriaList = response.content || []; 
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar logs de auditoría:', error);
        this.auditoriaList = []; 
        this.cargando = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtro = {
      username: '',
      tipoEvento: '',
      fechaInicio: '',
      fechaFin: '',
      pagina: 0,
      tamanoPagina: 10
    };
    this.buscar();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && this.pageResponse && nuevaPagina < this.pageResponse.totalPages) {
      this.filtro.pagina = nuevaPagina;
      this.buscar();
    }
  }

  cambiarTamanoPagina(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtro.tamanoPagina = parseInt(select.value);
    this.filtro.pagina = 0;
    this.buscar();
  }

  get paginaActual(): number {
    return this.pageResponse ? this.pageResponse.pageNumber + 1 : 1;
  }



  get totalPaginas(): number {
    return this.pageResponse ? this.pageResponse.totalPages : 1;
  }

  get totalElementos(): number {
    return this.pageResponse ? this.pageResponse.totalElements : 0;
  }

  get rangoInicio(): number {
    if (!this.pageResponse) return 0;
    return this.pageResponse.pageNumber * this.filtro.tamanoPagina + 1;
  }

  get rangoFin(): number {
    if (!this.pageResponse) return 0;
    const fin = (this.pageResponse.pageNumber + 1) * this.filtro.tamanoPagina;
    return Math.min(fin, this.pageResponse.totalElements);
  }

  getColorEvento(tipoEvento: string): string {
    switch(tipoEvento) {
      case 'LOGIN_EXITOSO': return 'badge bg-success';
      case 'LOGIN_FALLIDO': return 'badge bg-danger';
      case 'RECUPERACION_PASSWORD': return 'badge bg-warning';
      case 'BLOQUEO_USUARIO': return 'badge bg-dark';
      case 'DESBLOQUEO_USUARIO': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }
}
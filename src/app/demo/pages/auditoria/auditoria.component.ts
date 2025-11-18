import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuditoriaService } from './service/auditoria.service';
import { Auditoria } from './models/auditoria';

@Component({
  selector: 'app-auditoria',
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit {
  auditorias: Auditoria[] = [];
  auditoriasFiltradas: Auditoria[] = [];
  titleSpinner: string = "Cargando...";
  filtroTipoEvento: string = '';

  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.listarAuditorias();
  }

  listarAuditorias() {
    this.spinner.show();
    this.auditoriaService.listarAuditorias().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.auditoriasFiltradas = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al listar auditorías', error);
        this.spinner.hide();
      }
    });
  }

  filtrarPorTipo() {
    if (!this.filtroTipoEvento || this.filtroTipoEvento === '') {
      this.auditoriasFiltradas = this.auditorias;
    } else {
      this.spinner.show();
      this.auditoriaService.listarAuditorias(this.filtroTipoEvento).subscribe({
        next: (data) => {
          this.auditoriasFiltradas = data;
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error al filtrar auditorías', error);
          this.spinner.hide();
        }
      });
    }
  }

  limpiarFiltro() {
    this.filtroTipoEvento = '';
    this.auditoriasFiltradas = this.auditorias;
  }

  obtenerBadgeClass(tipoEvento: string): string {
    if (tipoEvento.includes('EXITO')) {
      return 'badge bg-success';
    } else if (tipoEvento.includes('ERROR')) {
      return 'badge bg-danger';
    } else if (tipoEvento.includes('CREAR')) {
      return 'badge bg-primary';
    } else if (tipoEvento.includes('ACTUALIZAR')) {
      return 'badge bg-warning text-dark';
    } else if (tipoEvento.includes('ELIMINAR')) {
      return 'badge bg-danger';
    } else if (tipoEvento.includes('CONSULTAR')) {
      return 'badge bg-info text-dark';
    }
    return 'badge bg-secondary';
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}


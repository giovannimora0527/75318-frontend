// src/app/modules/auditoria/auditoria.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← IMPORTA ESTO
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuditoriaLog } from './models/auditoria-log';
import { AuditoriaService } from './service/auditoria.service';

@Component({
  selector: 'app-auditoria',
  imports: [
    CommonModule,
    FormsModule,        // ← AÑADE ESTO
    NgxSpinnerModule
  ],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  logs: AuditoriaLog[] = [];
  logsFiltrados: AuditoriaLog[] = [];
  
  // Filtros
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';
  filtroUsuario: string = '';
  filtroEvento: string = '';

  titleSpinner: string = 'Cargando logs de auditoría...';

  // Lista de eventos para el select
  eventosDisponibles: string[] = [
    'LOGIN_EXITOSO',
    'INTENTO_LOGIN_FALLIDO',
    'USUARIO_BLOQUEADO',
    'INTENTO_LOGIN_BLOQUEADO',
    'RECUPERAR_CONTRASENA'
  ];

  constructor(
    private auditoriaService: AuditoriaService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs() {
    this.spinner.show();
    this.auditoriaService.listarLogs(
      this.filtroFechaDesde || undefined,
      this.filtroFechaHasta || undefined,
      this.filtroUsuario || undefined,
      this.filtroEvento || undefined
    ).subscribe({
      next: (data) => {
        this.logs = data;
        this.logsFiltrados = this.logs;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al cargar logs:', error);
        Swal.fire('Error', 'No se pudieron cargar los registros de auditoría', 'error');
      }
    });
  }

  aplicarFiltros() {
    this.cargarLogs();
  }

  limpiarFiltros() {
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroUsuario = '';
    this.filtroEvento = '';
    this.cargarLogs();
  }

  formatearFecha(fechaIso: string): string {
    const date = new Date(fechaIso);
    return date.toLocaleString('es-CO');
  }

  getIconoExito(exitoso: boolean): string {
    return exitoso ? '✅' : '❌';
  }
}

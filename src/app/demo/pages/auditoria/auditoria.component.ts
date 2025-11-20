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
  tiposEventosDisponibles: string[] = [];

  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.cargarTiposEventos();
    this.listarAuditorias();
  }

  cargarTiposEventos() {
    console.log('Cargando tipos de eventos...');
    this.auditoriaService.listarTiposEventos().subscribe({
      next: (data) => {
        console.log('Tipos de eventos cargados:', data);
        this.tiposEventosDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de eventos', error);
        // Si falla, usar lista vacía para evitar errores
        this.tiposEventosDisponibles = [];
      }
    });
  }

  listarAuditorias() {
    this.spinner.show();
    this.auditoriaService.listarAuditorias().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.auditoriasFiltradas = data;
        // Si no se cargaron los tipos de eventos, extraerlos de las auditorías
        if (this.tiposEventosDisponibles.length === 0 && data.length > 0) {
          this.tiposEventosDisponibles = [...new Set(data.map(a => a.tipoEvento))].sort();
          console.log('Tipos de eventos extraídos de auditorías:', this.tiposEventosDisponibles);
        }
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
    this.listarAuditorias(); // Recargar desde el backend
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

  obtenerEtiquetaTipoEvento(tipoEvento: string): string {
    const etiquetas: { [key: string]: string } = {
      'LOGIN_EXITOSO': 'Login Exitoso',
      'LOGIN_FALLIDO': 'Login Fallido',
      'BLOQUEO_USUARIO': 'Bloqueo de Usuario',
      'RECUPERACION_CONTRASENA_EXITO': 'Recuperación de Contraseña Exitosa',
      'RECUPERACION_CONTRASENA_ERROR': 'Recuperación de Contraseña Error',
      'CREAR_USUARIO': 'Crear Usuario',
      'ACTUALIZAR_USUARIO': 'Actualizar Usuario',
      'ELIMINAR_USUARIO': 'Eliminar Usuario',
      'CREAR_MEDICO': 'Crear Médico',
      'ACTUALIZAR_MEDICO': 'Actualizar Médico',
      'ELIMINAR_MEDICO': 'Eliminar Médico',
      'CREAR_PACIENTE': 'Crear Paciente',
      'ACTUALIZAR_PACIENTE': 'Actualizar Paciente',
      'ELIMINAR_PACIENTE': 'Eliminar Paciente',
      'CREAR_MEDICAMENTO': 'Crear Medicamento',
      'ACTUALIZAR_MEDICAMENTO': 'Actualizar Medicamento',
      'ELIMINAR_MEDICAMENTO': 'Eliminar Medicamento',
      'CREAR_CITA': 'Crear Cita',
      'ACTUALIZAR_CITA': 'Actualizar Cita',
      'ELIMINAR_CITA': 'Eliminar Cita',
      'CREAR_RECETA': 'Crear Receta',
      'ACTUALIZAR_RECETA': 'Actualizar Receta',
      'ELIMINAR_RECETA': 'Eliminar Receta',
      'CREAR_ESPECIALIZACION': 'Crear Especialización',
      'ACTUALIZAR_ESPECIALIZACION': 'Actualizar Especialización',
      'ELIMINAR_ESPECIALIZACION': 'Eliminar Especialización',
      'SISTEMA_INICIALIZADO': 'Sistema Inicializado'
    };
    return etiquetas[tipoEvento] || tipoEvento;
  }
}


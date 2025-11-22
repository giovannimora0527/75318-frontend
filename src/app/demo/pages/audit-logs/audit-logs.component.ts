import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UtilApiService } from 'src/app/services/common/util-api.service';
import Swal from 'sweetalert2';
import { AuditLog } from './models/AuditLog';
import { AuditLogsService } from './service/audit-logs.service';

@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'] // corregido
})
export class AuditLogsComponent {

  filtroForm: FormGroup;
  logs: AuditLog[] = [];
  totalRegistros = 0;
  page = 0;
  size = 20;

  titleSpinner = 'Cargando auditoría...';

  eventTypes = [
    'RECOVERY',
    'LOGIN_FAIL',
    'LOGIN_SUCCESS',
    'LOCK',
    'UNLOCK'
  ];

  constructor(
    private readonly auditService: AuditLogsService,
    private readonly utilApiService: UtilApiService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.filtroForm = this.formBuilder.group({
      username: [''],
      eventType: [''],
      start: [''],
      end: ['']
    });

    this.cargarAuditoria();
  }

  /** Método que aplica los filtros (llama a cargarAuditoria desde page 0) */
  aplicarFiltros() {
    this.cargarAuditoria(0);
  }

  /** Limpia los filtros y recarga la auditoría */
  limpiarFiltros() {
    this.filtroForm.reset({
      username: '',
      eventType: '',
      start: '',
      end: ''
    });
    this.cargarAuditoria(0);
  }

  /** Cambia de página */
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina * this.size >= this.totalRegistros) {
      return; // evita páginas inválidas
    }
    this.cargarAuditoria(nuevaPagina);
  }

  cargarAuditoria(page: number = 0) {
    this.page = page;

    const raw = this.filtroForm.value;

    const filtros: any = {
      page: this.page,
      size: this.size
    };

    if (raw.username && raw.username.trim() !== '') {
      filtros.username = raw.username.trim();
    }

    if (raw.eventType && raw.eventType.trim() !== '') {
      filtros.eventType = raw.eventType.trim();
    }

    if (raw.start) {
      filtros.start = this.toSpringDate(raw.start);
    }

    if (raw.end) {
      filtros.end = this.toSpringDate(raw.end);
    }

    this.spinner.show(undefined, { fullScreen: false });

    this.auditService.listarAuditoria(filtros).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.logs = data.content;
        this.totalRegistros = data.totalElements;
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        Swal.fire('Error', 'No fue posible cargar logs de auditoría', 'error');
      }
    });
  }

  /** Convierte datetime-local a formato compatible con LocalDateTime */
  private toSpringDate(dateStr: string): string {
    if (dateStr.length === 16) {
      return dateStr + ':00';
    }
    return dateStr;
  }
}

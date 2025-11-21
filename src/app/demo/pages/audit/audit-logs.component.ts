import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, AuditLog } from './service/audit.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  // filtros simples
  filtroUsuario = '';
  filtroEvento = '';

  constructor(private readonly audit: AuditService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.audit.getLogs().subscribe({
      next: (page) => {
        this.logs = page.items || [];
      },
      error: (err) => {
        console.error('Error cargando logs:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    // Para el ejemplo actual usamos el endpoint sin filtros.
    // En el futuro enviar params a audit.getLogs({username, event, from, to})
    this.loadLogs();
  }
}

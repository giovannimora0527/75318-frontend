import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';

export interface AuditLog {
  id: number;
  timestamp: string;
  username?: string;
  ip?: string;
  event: string;
  description?: string;
}

export interface AuditPage {
  items: AuditLog[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly apiBase = 'http://localhost:8000/clinica/v1';
  constructor(private readonly backend: BackendService) {}

  /**
   * Consulta paginada de logs de auditoría.
   * Params: page, size, from, to, username, event
   */
  getLogs(params?: any): Observable<AuditPage> {
    // Endpoint sugerido: /audit/logs
    // Construir HttpParams en el BackendService.get si se necesita.
    return this.backend.get<AuditPage>(this.apiBase, 'audit', 'logs');
  }
}

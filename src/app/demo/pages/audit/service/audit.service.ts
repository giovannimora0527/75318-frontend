import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { environment } from '../../../../../src/environments/environment';
import { AuditServiceMock } from './audit.mock';

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
  private readonly apiBase = environment.apiUrl;
  private mock: AuditServiceMock | null = null;
  constructor(private readonly backend: BackendService) {
    if (environment.useMocks) {
      this.mock = new AuditServiceMock();
    }
  }

  /**
   * Consulta paginada de logs de auditoría.
   * Params: page, size, from, to, username, event
   */
  getLogs(params?: any): Observable<AuditPage> {
    if (this.mock) {
      return this.mock.getLogs(params) as Observable<AuditPage>;
    }
    return this.backend.get<AuditPage>(this.apiBase, 'audit', 'logs');
  }
}

import { Observable, of } from 'rxjs';
import { AuditLog } from './audit.service';

const MOCK_LOGS: AuditLog[] = [
  { id: 1, timestamp: new Date().toISOString(), username: 'jdoe', ip: '127.0.0.1', event: 'LOGIN_FAILED', description: 'Password incorrecta' },
  { id: 2, timestamp: new Date().toISOString(), username: 'asmith', ip: '127.0.0.1', event: 'PASSWORD_RECOVERY_INVALID_USER', description: 'Usuario no encontrado' },
  { id: 3, timestamp: new Date().toISOString(), username: 'jdoe', ip: '127.0.0.1', event: 'USER_LOCKED', description: 'Bloqueo por intentos fallidos' }
];

export class AuditServiceMock {
  getLogs(params?: any): Observable<{ items: AuditLog[]; total: number }> {
    console.log('[Mock] getLogs called with', params);
    return of({ items: MOCK_LOGS, total: MOCK_LOGS.length });
  }
}

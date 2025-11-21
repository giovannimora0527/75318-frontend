import { Observable, of } from 'rxjs';
import { PasswordRecoveryRq, GenericRs } from './auth.service';

/** Mock implementation of AuthService for local UI testing. */
export class AuthServiceMock {
  requestPasswordRecovery(body: PasswordRecoveryRq): Observable<GenericRs> {
    console.log('[Mock] password recovery requested for', body.username);
    // Simulate audit log would be created on backend; return generic response
    return of({ mensaje: 'Si la cuenta existe, se ha enviado un correo con instrucciones.', status: 200 });
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';

export interface PasswordRecoveryRq {
  username: string;
}

export interface GenericRs {
  mensaje: string;
  status: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = 'http://localhost:8000/clinica/v1';
  constructor(private readonly backend: BackendService) {}

  /**
   * Solicita la recuperación de contraseña para un nombre de usuario.
   * Nota: por motivos de seguridad la respuesta al cliente debe ser genérica.
   */
  requestPasswordRecovery(body: PasswordRecoveryRq): Observable<GenericRs> {
    // Usamos backend.post para delegar cabeceras y auth si aplica.
    // Endpoint sugerido: /auth/password-recovery
    return this.backend.post<GenericRs>(this.apiBase, 'auth', 'password-recovery', body);
  }
}

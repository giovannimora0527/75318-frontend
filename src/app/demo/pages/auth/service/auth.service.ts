import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { environment } from '../../../../../src/environments/environment';
import { AuthServiceMock } from './auth.mock';

export interface PasswordRecoveryRq {
  username: string;
}

export interface GenericRs {
  mensaje: string;
  status: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = environment.apiUrl; 
  private mock: AuthServiceMock | null = null;
  constructor(private readonly backend: BackendService) {
    if (environment.useMocks) {
      this.mock = new AuthServiceMock();
    }
  }

  requestPasswordRecovery(body: PasswordRecoveryRq): Observable<GenericRs> {
    if (this.mock) {
      return this.mock.requestPasswordRecovery(body) as Observable<GenericRs>;
    }
    return this.backend.post<GenericRs>(this.apiBase, 'auth', 'password-recovery', body);
  }
}

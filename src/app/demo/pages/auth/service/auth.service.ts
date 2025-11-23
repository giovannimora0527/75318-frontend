// src/app/demo/pages/auth/service/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RecuperacionRequest } from '../models/recuperacion-request';
import { RecuperacionResponse } from '../models/recuperacion-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auth';

  constructor(private readonly backendService: BackendService) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', request);
  }

  recuperarPassword(request: RecuperacionRequest): Observable<RecuperacionResponse> {
    return this.backendService.post(this.urlBase, this.endpoint, 'recuperar-password', request);
  }
}
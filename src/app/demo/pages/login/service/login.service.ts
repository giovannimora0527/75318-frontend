import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRs } from '../models/login-rs';
import { LoginRq } from '../models/login-rq';
import { RecuperarPasswordRq } from '../models/recuperar-password-rq'; // ← nuevo
import { RecuperarPasswordRs } from '../models/recuperar-password-rs'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auth';

  constructor(private readonly backendService: BackendService) { }

  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', loginForm);
  }

  recuperarPassword(request: RecuperarPasswordRq): Observable<RecuperarPasswordRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'recuperar-password', request);
  }
}

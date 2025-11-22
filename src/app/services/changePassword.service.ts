import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private apiUrl = environment.apiUrl;  // ej: http://localhost:8000
  private endpoint = 'auth';            // corresponde a AuthController

  constructor(private backendService: BackendService) {}

  changePassword(data: { passwordActual: string, passwordNueva: string }): Observable<any> {
    return this.backendService.postWithToken(this.apiUrl, this.endpoint, 'cambiar-password', data);
  }
}

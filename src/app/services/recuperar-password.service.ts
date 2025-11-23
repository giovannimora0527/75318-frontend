
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecuperarPasswordService {
  private apiUrl = environment.apiUrl + '/auth/recuperar-contrasena';

  constructor(private http: HttpClient) {}

  recuperarPassword(username: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username });
  }
}

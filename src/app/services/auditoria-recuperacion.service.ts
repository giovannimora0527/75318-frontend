import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditoriaRecuperacionService {
  private base = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  search(params: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params.username) httpParams = httpParams.set('username', params.username);
    if (params.descripcion) httpParams = httpParams.set('descripcion', params.descripcion);
    if (params.start) httpParams = httpParams.set('start', params.start);
    if (params.end) httpParams = httpParams.set('end', params.end);
    httpParams = httpParams.set('page', params.page ?? 0);
    httpParams = httpParams.set('size', params.size ?? 20);
    return this.http.get<any>(this.base + '/auditoria-recuperacion', { params: httpParams });
  }
}

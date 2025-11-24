import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio para interactuar con el backend mediante peticiones HTTP.
 * Utiliza la URL base fija y agrega automáticamente el token desde localStorage.
 */
export class BackendService {
  private readonly BASE_URL = 'http://localhost:8000/clinica/v1';

  constructor(private http: HttpClient) {}

  private construirHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
    return headers;
  }

  /**
   * GET genérico
   */
  get<T>(
    endpoint: string,
    service: string,
    routerParams?: HttpParams
  ): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}/${endpoint}/${service}`, {
      params: routerParams,
      headers: this.construirHeaders(),
      withCredentials: true,
    });
  }

  /**
   * POST genérico
   */
  post<T>(endpoint: string, service: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}/${endpoint}/${service}`, data, {
      headers: this.construirHeaders(),
      withCredentials: true,
    });
  }

  /**
   * PUT genérico
   */
  put<T>(endpoint: string, service: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}/${endpoint}/${service}`, data, {
      headers: this.construirHeaders(),
    });
  }

  /**
   * POST para subir archivos
   */
  postFile<T>(endpoint: string, service: string, data: any): Observable<T> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.post<T>(`${this.BASE_URL}/${endpoint}/${service}`, data, {
      headers,
      withCredentials: true,
    });
  }
}

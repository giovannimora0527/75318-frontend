import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio para interactuar con el backend mediante peticiones HTTP.
 * Proporciona métodos genéricos para realizar operaciones GET, POST, PUT, DELETE y envío de archivos.
 *
 * @remarks
 * Este servicio utiliza el token almacenado en localStorage para autenticar las peticiones.
 */
export class BackendService {
  constructor(private http: HttpClient) {}

  /** Construye los encabezados con o sin token */
  construirHeader() {
    const tokenRecuperado = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      ...(tokenRecuperado ? { Authorization: 'Bearer ' + tokenRecuperado } : {}),
    });
    return headers;
  }

  /** Método GET genérico */
  get<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    routerParams?: HttpParams
  ): Observable<T> {
    return this.http.get<T>(`${urlApi}/${endpoint}/${service}`, {
      params: routerParams,
      headers: this.construirHeader(),
      withCredentials: true,
    });
  }

  /** Método POST genérico */
  post<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    data: unknown
  ): Observable<T> {
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: this.construirHeader(),
      withCredentials: true,
    });
  }

  /** Método PUT genérico */
  put<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    data: unknown
  ): Observable<T> {
    return this.http.put<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: this.construirHeader(),
    });
  }

  /** 🆕 Método DELETE genérico */
  delete<T>(
    urlApi: string,
    endpoint: string,
    service: string
  ): Observable<T> {
    return this.http.delete<T>(`${urlApi}/${endpoint}/${service}`, {
      headers: this.construirHeader(),
      withCredentials: true,
    });
  }

  /** Método POST para archivos */
  postFile<T>(
    urlApi: string,
    endpoint: string,
    service: string,
    data: unknown
  ): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      mimeType: 'multipart/form-data',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.post<T>(`${urlApi}/${endpoint}/${service}`, data, {
      headers: headers,
      withCredentials: true,
    });
  }
}

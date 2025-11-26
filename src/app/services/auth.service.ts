import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/auth/login';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  // TOKEN
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ROL (CORREGIDO)
  setRol(rol: string): void {
    localStorage.setItem('rol', rol);
  }

  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  // LOGGED
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}

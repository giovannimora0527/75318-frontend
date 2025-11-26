import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ✅ URL BASE correcta
  private apiUrl = 'http://localhost:8000/clinica/v1/api/auth';

  constructor(private http: HttpClient) {}

  // ✅ LOGIN
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.rol) {
          localStorage.setItem('rol', res.rol);
        }
      })
    );
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  // ✅ VALIDA SI ESTÁ LOGUEADO
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ OBTENER ROLE
  getRole(): string {
    return localStorage.getItem('rol') || '';
  }
}

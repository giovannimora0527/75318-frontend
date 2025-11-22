import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8000/api/auth'; // Cambia según tu endpoint backend
  private roleSubject = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((res: any) => {
          // Guardamos token y rol en localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          this.roleSubject.next(res.rol);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.roleSubject.next(null);
  }

  getRole(): string {
    return localStorage.getItem('rol');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
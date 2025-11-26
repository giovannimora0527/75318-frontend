import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  rol: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = 'http://localhost:8000/clinica/v1/api/auth/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, { username, password });
  }
}

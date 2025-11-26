import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // opcional
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Usuario y contraseña son obligatorios';
      return;
    }

    // Reemplaza la URL con tu endpoint real de login
    const url = 'http://localhost:8000/clinica/v1/api/auth/login';

    this.http.post<any>(url, { username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          // Guardar token y rol en localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);

          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.message || 'Usuario o contraseña incorrectos';
        }
      });
  }

}

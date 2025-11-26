import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = null;
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        // Respuesta del backend
        const rol = res.rol;

        // --- Redirecciones por rol ---
        switch (rol) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;

          case 'USER':
            this.router.navigate(['/inicio']);
            break;

          default:
            this.router.navigate(['/inicio']);
            break;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Usuario o contraseña incorrecta';
      }
    });
  }
}

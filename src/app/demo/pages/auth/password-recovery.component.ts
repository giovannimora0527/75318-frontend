import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]]
  });
  submitting = false;

  constructor(private readonly fb: FormBuilder, private readonly auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const username = this.form.value.username.trim();
    // Por seguridad mostrar siempre mensaje genérico
    this.auth.requestPasswordRecovery({ username }).subscribe({
      next: () => {
        Swal.fire('Si el usuario existe', 'Si la cuenta existe, se ha enviado un correo con instrucciones.', 'info');
        this.form.reset();
      },
      error: (err) => {
        // No mostrar error técnico al usuario; log en consola para diagnóstico local
        console.error('Password recovery error (logged for admin):', err);
        Swal.fire('Si el usuario existe', 'Si la cuenta existe, se ha enviado un correo con instrucciones.', 'info');
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}

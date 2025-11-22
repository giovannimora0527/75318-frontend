import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChangePasswordService } from 'src/app/services/changePassword.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  isLoading = false;
  mostrarPassword = false; // ✅ variable para mostrar/ocultar

  constructor(
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private router: Router
  ) {
    this.changeForm = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(6)]],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]]
    }, { validator: this.passwordMatch });
  }

  passwordMatch(group: FormGroup) {
    const nueva = group.get('passwordNueva')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return nueva === confirm ? null : { mismatch: true };
  }

  get f() { return this.changeForm.controls; }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    console.log(this.changeForm.errors);
    console.log(this.changeForm.controls);

    if (this.changeForm.invalid) {
      Swal.fire('Error', 'Corrige los errores en el formulario', 'error');
      this.changeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data = {
      passwordActual: this.f['passwordActual'].value,
      passwordNueva: this.f['passwordNueva'].value
    };

    this.changePasswordService.changePassword(data).subscribe({
      next: (resp) => {
        this.isLoading = false;
        Swal.fire('Éxito', 'Contraseña cambiada correctamente', 'success')
          .then(() => this.router.navigate(['/inicio']));
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err?.error?.message || 'No se pudo cambiar la contraseña', 'error');
      }
    });
  }
}

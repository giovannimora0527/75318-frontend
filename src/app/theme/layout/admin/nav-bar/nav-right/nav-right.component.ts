// angular import
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  // public props

  // constructor
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  /**
   * Obtiene el nombre del usuario actual
   */
  getNombreUsuario(): string {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      return usuario.username || 'Usuario';
    }
    return 'Usuario';
  }

  /**
   * Cierra la sesión del usuario
   */
  cerrarSesion(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Está seguro que desea cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Ha cerrado sesión correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}

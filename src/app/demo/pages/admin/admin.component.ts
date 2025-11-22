import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from './service/admin.service';

// Import correcto según tu estructura de carpetas
import { Usuario } from '../usuario/models/usuario';
import { Paciente } from '../paciente/models/paciente';
import { Medico } from '../medico/models/medico';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  rol: string;
  secciones = ['usuario','medico','paciente','cita','medicamento','formula','historia','especializacion','auditoria'];

  usuarios: Usuario[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];

  constructor(private authService: AuthService, private adminService: AdminService) {}

  ngOnInit(): void {
    this.rol = this.authService.getRole();
    this.cargarDatos();
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  cargarDatos(): void {
    if (this.puedeVer('usuario')) {
      this.adminService.listarUsuarios().subscribe({
        next: res => this.usuarios = res,
        error: err => console.error('Error al listar usuarios', err)
      });
    }
    if (this.puedeVer('paciente')) {
      this.adminService.listarPacientes().subscribe({
        next: res => this.pacientes = res,
        error: err => console.error('Error al listar pacientes', err)
      });
    }
    if (this.puedeVer('medico')) {
      this.adminService.listarMedicos().subscribe({
        next: res => this.medicos = res,
        error: err => console.error('Error al listar médicos', err)
      });
    }
  }

  // Control de visibilidad por roles
  puedeVer(seccion: string): boolean {
    const rol = this.rol;
    switch(seccion) {
      case 'usuario': return rol === 'ADMIN';
      case 'medico': return rol === 'ADMIN' || rol === 'MEDICO' || rol === 'PACIENTE';
      case 'paciente': return true; // todos pueden ver pacientes
      case 'cita':
      case 'medicamento':
      case 'formula':
      case 'historia':
        return rol === 'ADMIN' || rol === 'MEDICO';
      case 'especializacion':
      case 'auditoria':
        return rol === 'ADMIN';
      default: return true;
    }
  }

  canCreate(seccion: string): boolean {
    const rol = this.rol;
    switch(seccion) {
      case 'usuario':
      case 'especializacion':
      case 'auditoria': return rol === 'ADMIN';
      case 'medico':
      case 'cita':
      case 'medicamento':
      case 'formula':
      case 'historia': return rol === 'ADMIN' || rol === 'MEDICO';
      default: return false;
    }
  }

  canEdit(seccion: string): boolean {
    return this.canCreate(seccion); // mismos permisos que crear
  }

  canDelete(seccion: string): boolean {
    return this.canCreate(seccion); // mismos permisos que crear
  }

  crear(seccion: string): void {
    alert(`Crear ${seccion}`);
  }

  editar(seccion: string): void {
    alert(`Editar ${seccion}`);
  }

  eliminar(seccion: string): void {
    alert(`Eliminar ${seccion}`);
  }
}


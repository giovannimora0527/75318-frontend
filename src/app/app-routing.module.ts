import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes standalone
import { LoginComponent } from './demo/pages/login/login.component';
import { AdminComponent } from './theme/layout/admin/admin.component';

// Rutas de secciones
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitaComponent } from './demo/pages/cita/cita.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulaComponent } from './demo/pages/formula/formula.component';
import { HistoriaComponent } from './demo/pages/historia/historia.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { AuditoriaComponent } from './demo/pages/auditoria/auditoria.component';

// Guard
import { AuthGuard } from './demo/pages/guards/auth.guard';

export const routes: Routes = [

  // Login
  { path: 'login', component: LoginComponent },

  // Redirección por defecto
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Zona protegida
  {
    path: 'inicio',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'MEDICO', 'PACIENTE'] },

    children: [
      { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard], data: { title: 'Usuario', roles: ['ADMIN'] }},
      { path: 'medico', component: MedicoComponent, canActivate: [AuthGuard], data: { title: 'Medico', roles: ['ADMIN','MEDICO','PACIENTE'] }},
      { path: 'paciente', component: PacienteComponent, canActivate: [AuthGuard], data: { title: 'Paciente', roles: ['ADMIN','MEDICO','PACIENTE'] }},
      { path: 'cita', component: CitaComponent, canActivate: [AuthGuard], data: { title: 'Cita', roles: ['ADMIN','MEDICO'] }},
      { path: 'medicamento', component: MedicamentoComponent, canActivate: [AuthGuard], data: { title: 'Medicamento', roles: ['ADMIN','MEDICO'] }},
      { path: 'formula-medica', component: FormulaComponent, canActivate: [AuthGuard], data: { title: 'Formula', roles: ['ADMIN','MEDICO'] }},
      { path: 'historia-clinica', component: HistoriaComponent, canActivate: [AuthGuard], data: { title: 'Historia', roles: ['ADMIN','MEDICO'] }},
      { path: 'especializacion', component: EspecializacionComponent, canActivate: [AuthGuard], data: { title: 'Especialización', roles: ['ADMIN'] }},
      { path: 'auditoria', component: AuditoriaComponent, canActivate: [AuthGuard], data: { title: 'Auditoría', roles: ['ADMIN'] }},
    ]
  },

  // Cualquier ruta desconocida → inicio
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

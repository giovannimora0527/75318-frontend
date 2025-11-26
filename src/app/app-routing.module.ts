import { Routes } from '@angular/router';

// Componentes
import { LoginComponent } from './demo/pages/login/login.component';
import { DashboardComponent } from './demo/pages/dashboard/dashboard.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitaComponent } from './demo/pages/cita/cita.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulaComponent } from './demo/pages/formula/formula.component';
import { HistoriaComponent } from './demo/pages/historia/historia.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { AuditoriaComponent } from './demo/pages/auditoria/auditoria.component';

// Guards
import { AuthGuard } from './demo/pages/guards/auth.guard';
import { RoleGuard } from './demo/pages/guards/role.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'usuario', component: UsuarioComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: 'medico', component: MedicoComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'paciente', component: PacienteComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'cita', component: CitaComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'medicamento', component: MedicamentoComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'formula-medica', component: FormulaComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'historia-clinica', component: HistoriaComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
      { path: 'auditoria', component: AuditoriaComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: 'especializacion', component: EspecializacionComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN','MEDICO','PACIENTE'] } },
    ]
  },

  { path: '**', redirectTo: 'login' }
];

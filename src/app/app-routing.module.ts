import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';
import { CitasComponent } from './pages/citas/citas.component';
import { FormulasMedicasComponent } from './pages/formulas-medicas/formulas-medicas.component';
import { HistoriasMedicasComponent } from './pages/historias-medicas/historias-medicas.component';
import { EspecializacionComponent } from './demo/especializacion/especializacion.component';
import { AuditoriaComponent } from './demo/pages/auditoria/auditoria.component';
import { LoginComponent } from './demo/pages/auth/login/login.component';
import { RecuperarPasswordComponent } from './demo/pages/auth/recuperar-password/recuperar-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordComponent,
    data: { title: 'Recuperar Contraseña' }
  },
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Gestión de Usuarios' } },
      { path: 'medico', component: MedicoComponent, data: { title: 'Gestión de Médicos' } },
      { path: 'paciente', component: PacienteComponent, data: { title: 'Gestión de Pacientes' } },
      { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' } },
      { path: 'citas', component: CitasComponent, data: { title: 'Citas' } },
      { path: 'formulas-medicas', component: FormulasMedicasComponent, data: { title: 'Fórmulas Médicas' } },
      { path: 'historias-medicas', component: HistoriasMedicasComponent, data: { title: 'Historias Médicas' } },
      { path: 'gestion-especializaciones', component: EspecializacionComponent, data: { title: 'Gestión de Especializaciones' } },
      { path: 'auditoria', component: AuditoriaComponent, data: { title: 'Logs de Auditoría' } }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
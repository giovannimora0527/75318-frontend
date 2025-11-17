import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { CitaComponent } from './demo/pages/cita/cita.component';
import { RecetaComponent } from './demo/pages/receta/receta.component';
import { HistoriaMedicaComponent } from './demo/pages/historia-medica/historia-medica.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { LoginComponent } from './demo/pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },  
  {
    path: 'login',
    data: { title: 'Login' },
    component: LoginComponent,
  },
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }},
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
       { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Medicamento' }},
       { path: 'cita', component: CitaComponent, data: { title: 'Cita' }},
       { path: 'receta', component: RecetaComponent, data: { title: 'Receta' }},
       { path: 'historia-medica', component: HistoriaMedicaComponent, data: { title: 'Historia Medica' }},
       { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Especializacion' }}
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

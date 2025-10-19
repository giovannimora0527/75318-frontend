import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [
      // Rutas tradicionales
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' } },
      { path: 'medico', component: MedicoComponent, data: { title: 'Médico' } },
      { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' } },
      { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Medicamento' } },

      // Rutas standalone
      { 
        path: 'citas', 
        loadComponent: () => import('./demo/pages/citas/citas.component').then(m => m.CitasComponent),
        data: { title: 'Citas' } 
      },
      { 
        path: 'formulas', 
        loadComponent: () => import('./demo/pages/formulas/formulas.component').then(m => m.FormulasComponent),
        data: { title: 'Fórmulas' } 
      },
      { 
        path: 'historia', 
        loadComponent: () => import('./demo/pages/historia/historia.component').then(m => m.HistoriaComponent),
        data: { title: 'Historia Clínica' } 
      },
      { 
        path: 'especializacion', 
        loadComponent: () => import('./demo/pages/especializacion/especializacion.component')
                             .then(m => m.EspecializacionComponent),
        data: { title: 'Especializaciones' } 
      }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

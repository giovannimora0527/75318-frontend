import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { CitasComponent } from './demo/pages/citas/citas.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulasMedicasComponent } from './demo/pages/formulas-medicas/formulas-medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historias-medicas/historias-medicas.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';

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
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }},
      { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
      { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
      { path: 'citas', component: CitasComponent, data: { title: 'Citas' }},
      { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Especializacion' }},
      { path: 'formulas-medicas', component: FormulasMedicasComponent, data: { title: 'Formulas Médicas' }},
      { path: 'historias-medicas', component: HistoriasMedicasComponent, data: { title: 'Historias Médicas' }},
      { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' }}
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}





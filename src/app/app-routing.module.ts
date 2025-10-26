import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
import { CitasComponent } from './demo/pages/cita/citas.component';
import { FormulasMedicasComponent } from './demo/pages/formulas-medicas/formulas-medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historias-medicas/historias-medicas.component';
import { GestionEspecializacionComponent } from './demo/pages/gestion-especializacion/gestion-especializacion.component';
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: AdminComponent,
    children: [
      { path: 'usuario', component: UsuarioComponent },
      { path: 'medico', component: MedicoComponent },
      { path: 'paciente', component: PacienteComponent },
      { path: 'medicamentos', component: MedicamentosComponent },
      { path: 'citas', component: CitasComponent },
      { path: 'formulas-medicas', component: FormulasMedicasComponent },
      { path: 'historias-medicas', component: HistoriasMedicasComponent },
      { path: 'especializaciones', component: GestionEspecializacionComponent }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

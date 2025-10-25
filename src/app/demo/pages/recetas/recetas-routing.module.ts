import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecetaListComponent } from './components/receta-list/receta-list.component';
import { RecetaFormComponent } from './components/receta-form/receta-form.component';

const routes: Routes = [
  { path: '', component: RecetaListComponent },
  { path: 'nuevo', component: RecetaFormComponent },
  // { path: 'editar/:id', component: RecetaFormComponent } // si implementas editar
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecetasRoutingModule {}

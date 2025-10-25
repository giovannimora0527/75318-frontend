import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecetasRoutingModule } from './recetas-routing.module';
import { RecetaListComponent } from './components/receta-list/receta-list.component';
import { RecetaFormComponent } from './components/receta-form/receta-form.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    RecetaListComponent,
    RecetaFormComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecetasRoutingModule
  ]
})
export class RecetasModule {}

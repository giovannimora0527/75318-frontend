import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EspecializacionesRoutingModule } from './especializaciones-routing.module';
import { EspecializacionListComponent } from './components/especializacion-list/especializacion-list.component';
import { EspecializacionFormComponent } from './components/especializacion-form/especializacion-form.component';

@NgModule({
  declarations: [
    EspecializacionListComponent,
    EspecializacionFormComponent
  ],

import { FormsModule } from '@angular/forms';

  imports: [
    CommonModule,
    ReactiveFormsModule,
    EspecializacionesRoutingModule
  ]
})
export class EspecializacionesModule {}

// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaPulseSetupRoutingModule } from './exela-pulse-setup-routing.module';
import { ExelaPulseSetupComponent } from './exela-pulse-setup.component';
import { AddEditExelaPulseSetupComponent } from './add-edit-exela-pulse-setup/add-edit-exela-pulse-setup.component';

// Components

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaPulseSetupRoutingModule
  ],
  declarations: [
    ExelaPulseSetupComponent,
    AddEditExelaPulseSetupComponent
  ],
  exports: [
    ExelaPulseSetupComponent,
    AddEditExelaPulseSetupComponent
  ],
  entryComponents: [
    AddEditExelaPulseSetupComponent
  ],
  providers: [

  ]
})
export class ExelaPulseSetupModule { }

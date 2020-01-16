// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { RoleSetupRoutingModule } from './role-setup-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { RoleSetupComponent } from './role-setup.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RoleSetupRoutingModule
  ],
  declarations: [
    RoleSetupComponent
  ],
  exports: [
    RoleSetupComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class RoleSetupModule { }

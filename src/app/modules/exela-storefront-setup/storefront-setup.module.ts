// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { StoreFrontSetupRoutingModule } from './storefront-setup-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { StoreFrontSetupComponent } from './storefront-setup.component';
import { AddEditThemeComponent } from './add-edit-theme/add-edit-theme.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    StoreFrontSetupRoutingModule
  ],
  declarations: [
    StoreFrontSetupComponent,
    AddEditThemeComponent
  ],
  exports: [
    StoreFrontSetupComponent,
    AddEditThemeComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class StoreFrontSetupModule { }

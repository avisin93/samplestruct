// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ExelaCustomerSetupRoutingModule } from './exela-customer-setup-routing.module';
import { ExelaCustomerSetupComponent } from './exela-customer-setup.component';
import { ExelaCreateCustomerSetupComponent } from './exela-customer-create-setup/exela-create-customer-setup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaCustomerSetupRoutingModule
  ],
  declarations: [
    ExelaCustomerSetupComponent,
    ExelaCreateCustomerSetupComponent
  ],
  exports: [],
  entryComponents: [],
  providers: [ ]

})
export class ExelaCustomerSetupModule { }

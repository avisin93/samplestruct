// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { ClientSetupRoutingModule } from './client-setup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ClientVendorSetupTabsModule } from '../client-vendor-setup-tabs/client-vendor-setup-tabs.module';
import { FacilitiesModule } from '../facilities/facilities.module';

// Components
import { ClientSetupComponent } from './client-setup.component';
import { AddEditClientSetupComponent } from './add-edit-client-setup/add-edit-client-setup.component';
import { ClientInformationComponent } from './add-edit-client-setup/client-information/client-information.component';
import { ModuleLicenseModule } from '../module-license/module-license.module';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ClientSetupRoutingModule,
    ClientVendorSetupTabsModule,
    FacilitiesModule,
    ModuleLicenseModule
  ],
  declarations: [
    ClientSetupComponent,
    AddEditClientSetupComponent,
    ClientInformationComponent
  ],
  exports: [
    ClientSetupComponent,
    AddEditClientSetupComponent,
    ClientInformationComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class ClientSetupModule { }

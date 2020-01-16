// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { GroupsModule } from '../groups/groups.module';
import { AddEditModuleLicenseComponent } from './add-edit-module-license/add-edit-module-license.component';
import { ModuleLicenseComponent } from './module-license.component';
import { MaterialModule } from '../material.module';

// Components

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GroupsModule
  ],
  declarations: [
    ModuleLicenseComponent,
    AddEditModuleLicenseComponent
  ],
  exports: [
    ModuleLicenseComponent,
    AddEditModuleLicenseComponent
  ],
  entryComponents: [
    AddEditModuleLicenseComponent
  ],
  providers: [

  ]
})
export class ModuleLicenseModule { }

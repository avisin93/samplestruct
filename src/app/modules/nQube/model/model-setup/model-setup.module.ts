// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';

// Modules
import { SharedModule } from '../../../shared/shared.module';
import { CommonComponentsModule } from '../../../common-components/common-components.module';
import { ModelSetupRoutingModule } from './model-setup-routing.module';

// Components
import { ModelSetupComponent } from './model-setup.component';
import { AddEditModelSetupComponent } from './add-edit-model-setup/add-edit-model-setup.component';
import { ModelSetupService } from './model-setup.service';
import { ExecuteFileComponent } from '../model-assignment/add-edit-model/execute.file.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    ModelSetupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  declarations: [
    ModelSetupComponent,
    AddEditModelSetupComponent
  ],
  exports: [
    ModelSetupComponent
  ],
  entryComponents: [
    AddEditModelSetupComponent,
    ExecuteFileComponent
  ],
  providers: [
    ModelSetupService
  ]
})
export class ModelSetupModule { }

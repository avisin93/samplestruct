import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModelRoutingModule } from './model-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ModelAssignmentComponent } from './model.assignment.component';
import { AddEditModelComponent } from './add-edit-model/add-edit-model.component';
import { ExecuteFileComponent } from './add-edit-model/execute.file.component';
import { MaterialModule } from 'src/app/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ModelRoutingModule,
    SharedModule
  ],
  declarations: [
    ModelAssignmentComponent,
    AddEditModelComponent
  ],
  providers: [],
  exports: [
    ModelAssignmentComponent,
    AddEditModelComponent
  ],
  entryComponents: [ AddEditModelComponent, ExecuteFileComponent ]
})
export class ModelAssignmentModule { }

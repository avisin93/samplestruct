// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { FacilitiesModule } from '../facilities/facilities.module';
import { ExelaProjectSetupRoutingModule } from './exela-project-setup-routing.module';
import { ExelaProjectSetupComponent } from './exela-project-setup.component';
import { AddEditExelaProjectSetupComponent } from './add-edit-exela-project-setup/add-edit-exela-project-setup.component';
import { ExelaProjectInformationComponent } from './add-edit-exela-project-setup/exela-project-information/exela-project-information.component';
import { AddEditQueueSetupComponent } from './add-edit-exela-project-setup/exela-project-queue-setup/add-edit-queue-setup/add-edit-queue-setup.component';
import { QueueSetupComponent } from './add-edit-exela-project-setup/exela-project-queue-setup/queue-setup.component';
import { AddEditProjectDocTypeSetupComponent } from './add-edit-exela-project-setup/exela-project-doctype-setup/add-edit-project-doctype-setup/add-edit-project-doctype-setup.component';
import { ProjectDocTypeSetupComponent } from './add-edit-exela-project-setup/exela-project-doctype-setup/project-doctype-setup.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaProjectSetupRoutingModule
  ],
  declarations: [
    ExelaProjectSetupComponent,
    AddEditExelaProjectSetupComponent,
    ExelaProjectInformationComponent,
    QueueSetupComponent,
    AddEditQueueSetupComponent,
    AddEditProjectDocTypeSetupComponent,
    ProjectDocTypeSetupComponent
  ],
  exports: [
    ExelaProjectSetupComponent,
    AddEditExelaProjectSetupComponent,
    ExelaProjectInformationComponent
  ],
  entryComponents: [
    AddEditQueueSetupComponent,
    AddEditProjectDocTypeSetupComponent
  ],
  providers: [

  ]
})
export class ExelaProjectSetupModule { }

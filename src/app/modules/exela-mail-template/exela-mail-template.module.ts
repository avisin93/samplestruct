// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaMailTemplateRoutingModule } from './exela-mail-template-routing.module';

// Components
import { ExelaMailTemplateComponent } from './exela-mail-template.component';
import { AddEditExelaMailTemplateComponent } from './add-edit-exela-mail-template/add-edit-exela-mail-template.component';
import { ExelaMailTemplateInformationComponent } from './add-edit-exela-mail-template/exela-mail-template-information/exela-mail-template-information.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaMailTemplateRoutingModule
  ],
  declarations: [
    ExelaMailTemplateComponent,
    AddEditExelaMailTemplateComponent,
    ExelaMailTemplateInformationComponent

  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ExelaMailTemplateModule { }

// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaLandingPageRoutingModule } from './exela-landing-page-routing.module';
import { ExelaLandingPageComponent } from './exela-landing-page.component';
import { AddEditExelaLandingPageComponent } from './add-edit-exela-landing-page/add-edit-exela-landing-page.component';
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
    ExelaLandingPageRoutingModule
  ],
  declarations: [
    ExelaLandingPageComponent,
    AddEditExelaLandingPageComponent
  ],
  exports: [
    ExelaLandingPageComponent,
    AddEditExelaLandingPageComponent
  ],
  entryComponents: [
    AddEditExelaLandingPageComponent
  ],
  providers: [
  ]
})
export class ExelaLandingPageModule { }

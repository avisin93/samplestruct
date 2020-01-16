// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ExelaPoiSetupRoutingModule } from './exela-poi-setup-routing.module';
import { ExelaPoiSetupComponent } from './exela-poi-setup.component';
import { ExelaCreatePoiSetupComponent } from './exela-create-poi-setup/exela-create-poi-setup.component';
import { UploadListComponent } from './upload-list/upload-list-poi.component';
import { ExelaCustomerSetupModule } from '../exela-customer-group-setup/exela-customer-setup.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ExelaPoiSetupRoutingModule,
    ExelaCustomerSetupModule,
    TextMaskModule
  ],
  declarations: [
    ExelaPoiSetupComponent,
    ExelaCreatePoiSetupComponent,
    UploadListComponent
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ExelaPoiSetupModule { }

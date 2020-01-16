// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaReachoutSetupRoutingModule } from './exela-reachout-setup-routing.module';
import { ExelaReachoutSetupComponent } from './exela-reachout-setup.component';
import { ExelaEventNotificationSetupModule } from './exela-event-notification-setup/exela-event-notification-setup.module';

// import {NgxMaskModule} from 'ngx-mask'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaReachoutSetupRoutingModule,
    ExelaEventNotificationSetupModule
    // NgxMaskModule

  ],
  declarations: [

    ExelaReachoutSetupComponent
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ExelaReachoutSetupModule { }

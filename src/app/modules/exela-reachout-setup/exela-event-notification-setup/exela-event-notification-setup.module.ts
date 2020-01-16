// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ExelaEventNotificationSetupRoutingModule } from './exela-event-notification-setup-routing.module';
import { ExelaAddEventNotificationSetupComponent } from './exela-add-event-notification-setup/exela-add-event-notification-setup.component';
import { ExelaEventNotificationSetupComponent } from './exela-event-notification-setup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaEventNotificationSetupRoutingModule
  ],
  declarations: [
    ExelaEventNotificationSetupComponent,
    ExelaAddEventNotificationSetupComponent
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ExelaEventNotificationSetupModule { }

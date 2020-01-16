// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaEventNotificationSetupComponent } from './exela-event-notification-setup.component';
import { ExelaAddEventNotificationSetupComponent } from './exela-add-event-notification-setup/exela-add-event-notification-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaEventNotificationSetupComponent
  },
  {
    path: 'ro-event-notification/add-event-notification',
    component: ExelaAddEventNotificationSetupComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class ExelaEventNotificationSetupRoutingModule { }

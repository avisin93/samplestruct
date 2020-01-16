// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaEscalationMethodsSetupComponent } from './exela-escalation-methods-setup.component';
import { ExelaAddEscalationMethodSetupComponent } from './exela-add-escalation-methods-setup/exela-add-escalation-methods-setup.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ExelaEscalationMethodsSetupComponent
  },
  {
    path: 'ro-esc-method/add-escalation-method',
    component: ExelaAddEscalationMethodSetupComponent
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
export class ExelaEscalationMethodsSetupRoutingModule { }

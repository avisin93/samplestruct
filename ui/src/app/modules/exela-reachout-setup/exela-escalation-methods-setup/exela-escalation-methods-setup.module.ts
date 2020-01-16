// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../shared/shared.module';
import { ExelaEscalationMethodsSetupRoutingModule } from './exela-escalation-methods-setup-routing.module';
import { ExelaEscalationMethodsSetupComponent } from './exela-escalation-methods-setup.component';
import { ExelaAddEscalationMethodSetupComponent } from './exela-add-escalation-methods-setup/exela-add-escalation-methods-setup.component';
// import { PerfectScrollbarModule,PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: false
// };

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaEscalationMethodsSetupRoutingModule
  ],
  declarations: [
    ExelaEscalationMethodsSetupComponent,
    ExelaAddEscalationMethodSetupComponent
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [

  ]

})
export class ExelaEscalationMethodsSetupModule { }

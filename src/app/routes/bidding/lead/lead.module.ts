import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadComponent } from './lead.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { leadRoutes } from './lead.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(leadRoutes),
    SharedModule
  ],
  declarations: [LeadComponent],
  exports: [
    RouterModule
  ]
})
export class LeadModule { }

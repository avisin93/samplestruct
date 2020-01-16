import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { AgencyComponent } from './agency.component';
import { agencysRoutes } from './agency.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(agencysRoutes),
    SharedModule
  ],
  declarations: [AgencyComponent],
  exports: [
    RouterModule
  ]
})
export class AgencyModule { }

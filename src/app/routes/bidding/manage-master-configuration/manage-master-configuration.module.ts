import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ManageMasterConfigurationComponent } from './manage-master-configuration.component';
import { masterConfigBiddingRoutes } from './manage-master-configuration.routes';
import { ManageRateChartComponent } from './manage-rate-chart/manage-rate-chart.component';
import { ManageMasterConfigService } from './manage-master-configuration.services';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(masterConfigBiddingRoutes)
  ],
  declarations: [ManageMasterConfigurationComponent],
  providers: [ManageMasterConfigService],
  exports: [
    RouterModule
  ]
})
export class ManageMasterConfigurationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ManageRateChartComponent } from './manage-rate-chart.component';
const routes: Routes = [
  { path: '', component: ManageRateChartComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManageRateChartComponent],
  exports: [
    RouterModule
  ]
})
export class ManageRateChartModule { }

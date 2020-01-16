import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ManageBaseChartComponent } from './manage-base-chart.component';
const routes: Routes = [
  { path: '', component: ManageBaseChartComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManageBaseChartComponent],
  exports: [
    RouterModule
  ]
})
export class ManageBaseChartModule { }

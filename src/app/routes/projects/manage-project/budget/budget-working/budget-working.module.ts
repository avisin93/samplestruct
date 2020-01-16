import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BudgetWorkingComponent } from './budget-working.component';
import { ListWorkingService } from './budget-working.service';
import { BudgetDetailsService } from '../budget.services';
import { ShowTwoDecimalPipe } from '@app/shared/pipes';
const routes: Routes = [
    { path: '', component: BudgetWorkingComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [BudgetWorkingComponent],
  providers: [ListWorkingService, BudgetDetailsService, ShowTwoDecimalPipe],
  exports: [
    RouterModule
  ]
})
export class BudgetWorkingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetReportComponent } from './budget-report.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { budgetReportRoutes } from './budget-report.routes';
import { BudgetTableComponent } from './budget-table/budget-table.component';
import { TabDirective } from 'ngx-bootstrap/tabs/tab.directive';
import { BudgetTableService } from './budget-table/budget-table.services';
import { BudgetDetailsService } from '../budget.services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(budgetReportRoutes),
    SharedModule
  ],
  declarations: [BudgetReportComponent, BudgetTableComponent],
  providers: [ BudgetTableService, BudgetDetailsService ],
  exports: [
    RouterModule,
    BudgetTableComponent
  ]
})
export class BudgetReportModule { }

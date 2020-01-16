import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageBudgetComponent } from './manage-budget.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { manageBudgetRoutes } from './manage-budget.routes';
import { ManageBudgetService } from './manage-budget.services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(manageBudgetRoutes),
    SharedModule
  ],
  declarations: [ManageBudgetComponent],
  providers: [ ManageBudgetService],
  exports: [
    RouterModule
  ]
})
export class ManageBudgetModule { }

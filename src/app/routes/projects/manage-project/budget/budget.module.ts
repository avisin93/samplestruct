import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BudgetRoutes } from './budget.routes';
import { BudgetComponent } from './budget.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BudgetRoutes),
    SharedModule
  ],
  declarations: [BudgetComponent],
  exports: [
    RouterModule
  ]
})
export class BudgetModule { }

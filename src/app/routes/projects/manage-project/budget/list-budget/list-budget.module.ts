import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBudgetComponent } from './list-budget.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { listBudgetRoutes } from './list-budget.routes';
import { ListBudgetService } from './list-budget.services';
import { AddBudgetComponent } from '../add-budget/add-budget.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(listBudgetRoutes),
    SharedModule
  ],
  declarations: [ListBudgetComponent, AddBudgetComponent],
  entryComponents: [AddBudgetComponent],
  providers: [ ListBudgetService],
  exports: [
    RouterModule
  ]
})
export class ListBudgetModule { }

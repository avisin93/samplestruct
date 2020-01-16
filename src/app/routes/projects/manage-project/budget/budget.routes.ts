

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { BudgetComponent } from './budget.component';
import { RoleGuard } from '@app/common';
export const BudgetRoutes: Routes = [
  {
    path: '',
    component: BudgetComponent,
    children: [
      {
        path: '',
        loadChildren: './list-budget/list-budget.module#ListBudgetModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budget
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage/:id',
        loadChildren: './manage-budget/manage-budget.module#ManageBudgetModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budget
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'budget-report/:id',
        loadChildren: './budget-report/budget-report.module#BudgetReportModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budget
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-budget-working/:id',
        loadChildren: './budget-working/budget-working.module#BudgetWorkingModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.budget
        },
        canActivate: [RoleGuard]
      }
    ]
  },
];

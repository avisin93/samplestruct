

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { ManageBudgetComponent } from './manage-budget.component';
import { RoleGuard } from '@app/common';
export const manageBudgetRoutes: Routes = [
  {
    path: '',
    component: ManageBudgetComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'settings',
        loadChildren: '../../settings/settings.module#SettingsModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetSettings
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'details',
        loadChildren: '../../project-details/project-details.module#ProjectDetailsModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetDetails
        },
        canActivate: [RoleGuard]
      },
    ]
  },
];

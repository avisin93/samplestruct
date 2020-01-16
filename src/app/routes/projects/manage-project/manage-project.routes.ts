/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { ManageProjectComponent } from './manage-project.component';
import { ProjectAssignmentComponent } from '../manage-project/project-details/project-assignment/project-assignment.component';
import { RoleGuard } from '@app/common';
export const manageProjectRoutes: Routes = [
  {
    path: '',
    component: ManageProjectComponent,
    children: [
      {
        path:'',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'budget-sheets',
        loadChildren: './budget/budget.module#BudgetModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budget
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'details',
        loadChildren: './project/project.module#ProjectModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.projects
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'assignment',
        component: ProjectAssignmentComponent,
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.pal
        },
        canActivate: [RoleGuard]
      },
    ]
  },
];

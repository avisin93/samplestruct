/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadChildren: './list-projects/list-projects.module#ListProjectsModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.projects
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'add',
    loadChildren: './add-project/add-project.module#AddProjectModule',
    data: {
      type: ACTION_TYPES.ADD,
      moduleID: MODULE_ID.projects
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'manage/:id',
    loadChildren: './manage-project/manage-project.module#ManageProjectModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.projects
    },
    canActivate: [RoleGuard]
  },
];

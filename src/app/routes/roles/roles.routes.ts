import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
export const rolesRoutes: Routes = [
  {
    path: '',
    component: RolesComponent,
    children: [
      {
        path: '',
        loadChildren: './list-roles/list-roles.module#RolesListingModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.roles
        },
        canActivate: [RoleGuard]

      },
      {
        path: 'manage',
        loadChildren: './manage-roles/manage-roles.module#ManageRolesModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.roles
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage/:roleId',
        loadChildren: './manage-roles/manage-roles.module#ManageRolesModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.roles
        },
        canActivate: [RoleGuard]
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

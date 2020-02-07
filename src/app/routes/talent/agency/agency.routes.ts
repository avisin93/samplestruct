/**
* Component     : Routing
 
* Creation Date : 9th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../../config'
import { AgencyComponent } from './agency.component';
import { RoleGuard } from '@app/common';

export const agencysRoutes: Routes = [
    {
        path: '',
        component: AgencyComponent,
        children: [
        {
            path: '',
            loadChildren: './list-agency/list-agency.module#ListAgencyModule',
            data: {
                type: ACTION_TYPES.VIEW,
                moduleID: MODULE_ID.agency
            },
            canActivate: [RoleGuard]
        },
        {
            path: 'manage',
            loadChildren: './manage-agency/manage-agency.module#ManageAgencyModule',
            data: {
                type: ACTION_TYPES.ADD,
                moduleID: MODULE_ID.agency
            },
            canActivate: [RoleGuard]
        },
        {
            path: 'manage/:agencyId',
            loadChildren: './manage-agency/manage-agency.module#ManageAgencyModule',
            data: {
                type: ACTION_TYPES.EDIT,
                moduleID: MODULE_ID.agency
            },
            canActivate: [RoleGuard]
        },
        { path: '**', redirectTo: '' }
    ]
    }

];

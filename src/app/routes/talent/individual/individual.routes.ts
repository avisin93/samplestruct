/**
* Component     : Routing
 
* Creation Date : 9th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../../config';
import { IndividualComponent } from './individual.component';
import { RoleGuard } from '@app/common';

export const individualRoutes: Routes = [
    {
        path: '',
        component: IndividualComponent,
        children: [
            {
                path: '',
                loadChildren: './list-individual/list-individual.module#ListIndividualModule',
                data: {
                    type: ACTION_TYPES.VIEW,
                    moduleID: MODULE_ID.individual
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'manage',
                loadChildren: './manage-individual/manage-individual.module#ManageIndividualModule',
                data: {
                    type: ACTION_TYPES.ADD,
                    moduleID: MODULE_ID.individual
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'manage/:id',
                loadChildren: './manage-individual/manage-individual.module#ManageIndividualModule',
                data: {
                    type: ACTION_TYPES.EDIT,
                    moduleID: MODULE_ID.individual
                },
                canActivate: [RoleGuard]
            },
            { path: '**', redirectTo: '' }
        ]
    }
];

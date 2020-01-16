

import { Routes } from '@angular/router';
import { LeadComponent } from './lead.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const leadRoutes: Routes = [
  {
    path: '',
    component: LeadComponent,
    children: [
      {
        path: '',
        loadChildren: './lead-listing/lead-listing.module#LeadListingModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.leads
        },
      },
      {
        path: 'manage/:id',
        loadChildren: './manage-lead/manage-lead.module#ManageLeadModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.leads
        },
      },
      {
        path: 'manage',
        loadChildren: './manage-lead/manage-lead.module#ManageLeadModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.leads
        },
      },
      { path: '**', redirectTo: '' }
    ]
  }
];

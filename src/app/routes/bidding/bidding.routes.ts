

import { Routes } from '@angular/router';
import { BiddingComponent } from './bidding.component';
import { RoleGuard } from '@app/common';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const biddingRoutes: Routes = [
  {
    path: '',
    component: BiddingComponent,
    children: [
      {
        path: 'deals',
        loadChildren: './bid/bid.module#BidModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.bids
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'leads',
        loadChildren: './lead/lead.module#LeadModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.leads
        },
        canActivate: [RoleGuard]
      },
      {
        path: '',
        redirectTo: 'deals',
        pathMatch: 'Full'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

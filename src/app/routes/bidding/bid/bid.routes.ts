

import { Routes } from '@angular/router';
import { BidComponent } from './bid.component';
import { RoleGuard } from '@app/common';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const bidRoutes: Routes = [
  {
    path: '',
    component: BidComponent,
    children: [
      {
        path: '',
        loadChildren: '../bid-listing/bid-listing.module#BidListingModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.bidding
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage/:id',
        loadChildren: '../manage-bid/manage-bid.module#ManageBidModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidding
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'master-configuration',
        loadChildren: '../manage-master-configuration/manage-master-configuration.module#ManageMasterConfigurationModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.dealMasterConfiguration,
          isBiddingList: true
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'approval-hierarchy',
        loadChildren: '../bid-approval-hierarchy/bid-approval-hierarchy.module#BidApprovalHierarchyModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.dealApprovalHierarchy,
          isBiddingList: true
        },
        canActivate: [RoleGuard]
      },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const masterPurchasrOrderRoutes: Routes = [
  {
    path: '',
    loadChildren: './purchase-order-listing/purchase-order-listing.module#PurchaseOrderListingModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.masterPurchaseOrder
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

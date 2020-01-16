import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
export const masterInvoiceRoutes: Routes = [
  {
    path: '',
    loadChildren: './master-invoice-listing/master-invoice-listing.module#InvoiceListingModule',
    data: {
      type: ACTION_TYPES.VIEW,
      moduleID: MODULE_ID.masterPaymentOrders
    },
    canActivate: [RoleGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

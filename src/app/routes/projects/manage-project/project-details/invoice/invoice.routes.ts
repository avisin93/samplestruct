

/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { RoleGuard } from '@app/common';
import { MODULE_ID, ACTION_TYPES } from '@app/config';
export const invoiceRoutes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    children: [
      {
        path: '',
        loadChildren: './invoice-listing/invoice-listing.module#InvoiceListingModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.paymentOrder
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage',
        loadChildren: './manage-invoice/manage-invoice.module#ManageInvoiceModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.paymentOrder
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage/:id',
        loadChildren: './manage-invoice/manage-invoice.module#ManageInvoiceModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.paymentOrder
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'view-payment-order-details/:id',
        loadChildren: './view-invoice-details/view-invoice-details.module#ViewInvoiceDetailsModule'
      }
      // {
      //   path: 'view/:id',
      //   loadChildren: './view-invoice/view-invoice.module#ManageInvoiceModule',
      // }
    ]
  }
];

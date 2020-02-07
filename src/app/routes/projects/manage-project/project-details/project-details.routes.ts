

/**
* Component     : Routing
 
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { RoleGuard } from '@app/common';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { ProjectDetailsComponent } from './project-details.component';

export const projectDetailsRoutes: Routes = [
  {
    path: '',
    component: ProjectDetailsComponent,
    children: [
      {
        path: '',
        redirectTo: 'po',
        pathMatch: 'full'
      },
      {
        path: 'po',
        loadChildren: './purchase-order/purchase-order.module#PurchaseOrderModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.purchaseOrder
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'advances',
        loadChildren : './advances/advances.module#AdvancesModule',
      },
      {
        path: 'settlement',
        loadChildren : './settlement/settlement.module#SettlementModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.settlement
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'payment-order',
        loadChildren: './invoice/invoice.module#InvoiceModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.paymentOrder
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'payment',
        loadChildren: './payment/payment.module#PaymentModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.payments
        },
        canActivate: [RoleGuard]
      }
    ]
  }
];

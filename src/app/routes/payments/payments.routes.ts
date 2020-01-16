

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { PaymentsComponent } from './payments.component';
import { RoleGuard } from '@app/common';
export const paymentsRoutes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      {
        path: '',
        loadChildren: './payments-listing/payments-listing.module#PaymentsListingModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.payments
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage-payment/:id',
        loadChildren: './manage-payment/manage-payment.module#ManagePaymentModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.payments
        },
        canActivate: [RoleGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

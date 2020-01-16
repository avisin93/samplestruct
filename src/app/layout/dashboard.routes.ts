

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
import { LayoutComponent } from './layout.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      loadChildren: '../routes/home/home.module#HomeModule'
    },
    {
      path: 'dashboard',
      loadChildren: '../routes/dashboard/dashboard.module#DashboardModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.dashboard
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'users',
      loadChildren: '../routes/users/users.module#UsersModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.users
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'profile',
      loadChildren: '../routes/profile/profile.module#ProfileModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.profile
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'locations',
      loadChildren: '../routes/locations/locations.module#LocationsModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.locations
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'projects',
      loadChildren: '../routes/projects/projects.module#ProjectsModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.projects
      },
      canActivate: [RoleGuard]
    },
    {

      path: 'purchase-order',
      loadChildren: '../routes/master-purchase-order/master-purchase-order.module#MasterPurchaseOrderModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.masterPurchaseOrder
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'talent',
      loadChildren: '../routes/talent/talent.module#TalentModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.talent
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'payment-order',
      loadChildren: '../routes/master-invoice/master-invoice.module#MasterInvoiceModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.masterPaymentOrders
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'payments',
      loadChildren: '../routes/payments/payments.module#PaymentsModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.payments
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'bidding',
      loadChildren: '../routes/bidding/bidding.module#BiddingModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.bidding
      },
      canActivate: [RoleGuard]
    },
    {
      path: 'roles',
      loadChildren: '../routes/roles/roles.module#RolesModule',
      data: {
        type: ACTION_TYPES.VIEW,
        moduleID: MODULE_ID.roles
      },
      canActivate: [RoleGuard]
    },
    {
      path: '403',
      loadChildren: '../routes/pages/error403/error403.module#Error403Module'
    },
    { path: '**', redirectTo: 'home' }
    ]
  }
];

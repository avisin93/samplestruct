

import { Routes } from '@angular/router';
import { ManageMasterConfigurationComponent } from './manage-master-configuration.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const masterConfigBiddingRoutes: Routes = [
  {
    path: '',
    component: ManageMasterConfigurationComponent,
    children: [
      {
        path: '',
        redirectTo: 'manage-base-rate',
        pathMatch: 'full'
      },
      {
        path: 'manage-base-rate',
        loadChildren: './manage-base-chart/manage-base-chart.module#ManageBaseChartModule',
        data: {
          isBiddingList: false
        }
      },
      {
        path: 'manage-rate-chart',
        loadChildren: './manage-rate-chart/manage-rate-chart.module#ManageRateChartModule',
        data: {
          isBiddingList: false
        }
      },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '' }
];

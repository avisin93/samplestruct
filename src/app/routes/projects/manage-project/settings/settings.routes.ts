

/**
* Component     : Routing
* Author        : Boston Byte LLC
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { RoleGuard } from '@app/common';
// import { ConfigurationComponent } from './configuration/configuration.component'
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { ApprovalHirerachyComponent } from './approval-hirerachy/approval-hirerachy.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'configuration',
        pathMatch: 'full'
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetSettingsConfiguration
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'payment-terms',
        component: PaymentTermsComponent,
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetSettingsPaymentTerms
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'approval-hierarchy',
        component: ApprovalHirerachyComponent,
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetSettingsApprovalHierarchy
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'currencies',
        component: CurrenciesComponent,
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.budgetSettingsCurrencies
        },
        canActivate: [RoleGuard]
      }
    ]
  }
];

import { Routes } from '@angular/router';
import { SettlementComponent } from './settlement.component';
import { RoleGuard } from '@app/common';
import { MODULE_ID, ACTION_TYPES } from '@app/config';
export const settlementRoutes: Routes = [
  {
    path: '',
    component: SettlementComponent,
    children: [
      {
        path: '',
         loadChildren: './list-settlement/list-settlement.module#ListSettlementModule',
         data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.settlement
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage',
        loadChildren: './manage-settlement/manage-settlement.module#ManageSettlementModule',
        data: {
          type: ACTION_TYPES.ADD,
          moduleID: MODULE_ID.settlement
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'manage/:id',
        loadChildren: './manage-settlement/manage-settlement.module#ManageSettlementModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.settlement
        },
        canActivate: [RoleGuard]
      },


    ]
  }
];

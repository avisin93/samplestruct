import { TalentComponent } from './talent.component';
import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../config';
import { RoleGuard } from '@app/common';

export const talentRoutes: Routes = [
  {
    path: '',
    component: TalentComponent,
    children: [
      {
        path: 'agency',
        loadChildren: './agency/agency.module#AgencyModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.agency
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'individual',
        loadChildren: './individual/individual.module#IndividualModule',
        data: {
          type: ACTION_TYPES.VIEW,
          moduleID: MODULE_ID.individual
        },
        canActivate: [RoleGuard]
      },
      { path: '**', redirectTo: 'individual' }
    ]
  }
];

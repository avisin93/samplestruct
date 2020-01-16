import { Routes } from '@angular/router';
import { AdvancesComponent } from './advances.component';
import { ListAdvancesComponent } from './list-advances/list-advances.component';
import { ManageFreelancerComponent } from './manage-freelancer/manage-freelancer.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { ManageVendorComponent } from './manage-vendor/manage-vendor.component';
import { ManageSettlementComponent } from './settlement/manage-settlement/manage-settlement.component';
import { ManageTalentComponent } from './manage-talent/manage-talent.component';
import { ListSettlementComponent} from './settlement/list-settlement/list-settlement.component';
export const advancesRoutes: Routes = [
  {
    path: '',
    component: AdvancesComponent,
    children: [
      {
        path: '',
        component: ListAdvancesComponent
      },
      {
        path: 'settlement',
        component: ListSettlementComponent
      },
      {
        path: 'manage-freelancer',
        component: ManageFreelancerComponent
      },
      {
        path: 'manage-freelancer/:id',
        component: ManageFreelancerComponent
      },
      {
        path: 'manage-location',
        component: ManageLocationComponent
      },
      {
        path: 'manage-vendor',
        component: ManageVendorComponent
      },
      {
        path: 'manage-vendor/:id',
        component: ManageVendorComponent
      },
      {
        path: 'manage-talent',
        component: ManageTalentComponent
      },
      {
        path: 'manage-settlement',
        component: ManageSettlementComponent
      },
      {
        path: 'manage-settlement/:id',
        component: ManageSettlementComponent
      },


    ]
  }
];

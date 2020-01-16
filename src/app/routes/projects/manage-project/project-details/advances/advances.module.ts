import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../../shared/shared.module';
import { advancesRoutes } from './advances.routes';
import { AdvancesComponent } from './advances.component';
import { ManageTalentComponent } from './manage-talent/manage-talent.component';
import { ListAdvancesComponent } from './list-advances/list-advances.component';
import { ManageFreelancerComponent } from './manage-freelancer/manage-freelancer.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { ManageVendorComponent } from './manage-vendor/manage-vendor.component';
//import { SettlementComponent } from './settlement/settlement.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ListSettlementComponent } from './settlement/list-settlement/list-settlement.component';
import { SettlementComponent } from './settlement/settlement.component';
import { ManageSettlementComponent } from './settlement/manage-settlement/manage-settlement.component';
import { SettlementListService } from './settlement/list-settlement/list-settlement.service';
import { AdvancesService } from './list-advances/list-advances.services';
import { ManageFreelancerAdvancesService } from './manage-freelancer/manage-freelancer.service';
import { ManageVendorAdvancesService } from './manage-vendor/manage-vendor.service';
import { ManageSettlementService } from './settlement/manage-settlement/manage-settlement.service';

@NgModule({
  imports: [
    RouterModule.forChild(advancesRoutes),
    SharedModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [AdvancesComponent, ManageTalentComponent, ListAdvancesComponent, ManageFreelancerComponent, ManageLocationComponent, ManageVendorComponent, ListSettlementComponent, SettlementComponent, ManageSettlementComponent],
  providers:[AdvancesService, SettlementListService,ManageFreelancerAdvancesService,ManageVendorAdvancesService,ManageSettlementService],
  exports: [
    RouterModule
  ]
})
export class AdvancesModule { }

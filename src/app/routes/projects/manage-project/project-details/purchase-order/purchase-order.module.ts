import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { poRoutes } from './purchase-order.routes';
import { SharedModule } from '../../../../../shared/shared.module';
import { AddPoFreelancerComponent } from './add-po-freelancer/add-po-freelancer.component';
// import { AddPoLocationComponent } from './add-po-location/add-po-location.component';
// import { AddPoVendorComponent } from './add-po-vendor/add-po-vendor.component';
import { PoListingComponent } from './po-listing/po-listing.component';
import { PurchaseOrderComponent } from './purchase-order.component';
import { ListPOService } from './po-listing/po-listing.service';
import { AddPOService } from './add-po-vendor/add-po-vendor.service';
import { AddFreelancerPOService } from './add-po-freelancer/add-po-freelancer.service';
import { AddPoVendorComponent } from './add-po-vendor/add-po-vendor.component';
import { AddPoLocationComponent } from './manage-location/add-po-location/add-po-location.component';
// import { AddPoTalentComponent } from './add-po-talent/add-po-talent.component';
import { AddLocationPOService } from './manage-location/add-po-location/add-po-location.service';
import { ManagePoAdvanceComponent } from './manage-po-advance/manage-po-advance.component';
import { AdvancePOService } from './manage-po-advance/manage-po-advance.service';
import { ManageTalentPoComponent } from './manage-talent-po/manage-talent-po.component';
import { ManageTalentPoService } from './manage-talent-po/manage-talent-po.service';
import { CommonApprovalHierarchyComponent } from '@app/routes/feature/common-approval-hierarchy/common-approval-hierarchy.component';
import { CommonApprovalHierarchyModule } from '@app/routes/feature/common-approval-hierarchy/common-approval-hierarchy.module';

@NgModule({
  imports: [
    RouterModule.forChild(poRoutes),
    SharedModule,
    AngularMultiSelectModule,
    CommonApprovalHierarchyModule
  ],
  // declarations: [PurchaseOrderComponent,AddPoFreelancerComponent, AddPoLocationComponent, AddPoVendorComponent,PoListingComponent, AddPoTalentComponent],

  declarations: [
    PurchaseOrderComponent,
    PoListingComponent,
    AddPoVendorComponent,
    AddPoFreelancerComponent,
    ManagePoAdvanceComponent,
    ManageTalentPoComponent
  ],
  providers: [ListPOService, AddPOService, AddFreelancerPOService, AddLocationPOService, AdvancePOService, ManageTalentPoService],
  exports: [
    RouterModule
  ]
})
export class PurchaseOrderModule { }

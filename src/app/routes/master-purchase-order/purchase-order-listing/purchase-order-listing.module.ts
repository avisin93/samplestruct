import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { PurchaseOrderListingComponent } from './purchase-order-listing.component';
import { MasterPOService } from './purchase-order-listing.service';
import { WindowOpenService } from '@app/common';
import { CommonApprovalHierarchyModule } from '@app/routes/feature/common-approval-hierarchy/common-approval-hierarchy.module';
const routes: Routes = [
  { path: '', component: PurchaseOrderListingComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CommonApprovalHierarchyModule
  ],
  declarations: [PurchaseOrderListingComponent],
  exports: [
    RouterModule
  ],
  providers: [MasterPOService, WindowOpenService]
})
export class PurchaseOrderListingModule { }

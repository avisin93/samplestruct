import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { MasterInvoiceListingComponent } from './master-invoice-listing.component';
import { MasterInvoiceListingService } from './master-invoice-listing.service';
import { CommonApprovalHierarchyModule } from '@app/routes/feature/common-approval-hierarchy/common-approval-hierarchy.module';

const routes: Routes = [
  { path: '', component: MasterInvoiceListingComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    CommonApprovalHierarchyModule
  ],
  declarations: [MasterInvoiceListingComponent],
  exports: [
    RouterModule
  ],
  providers: [MasterInvoiceListingService]
})
export class InvoiceListingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../../shared/shared.module';
import { InvoiceListingComponent } from './invoice-listing.component';
import { CommonApprovalHierarchyModule } from '@app/routes/feature/common-approval-hierarchy/common-approval-hierarchy.module';
const routes: Routes = [
  { path: '', component: InvoiceListingComponent }]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CommonApprovalHierarchyModule
  ],
  declarations: [InvoiceListingComponent],
  exports: [
    RouterModule
],

})
export class InvoiceListingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { BidApprovalHierarchyComponent } from './bid-approval-hierarchy.component';
import { BiddingApprovalHierarchyService } from './bid-approval-hierarchy.service';
import { ApprovalHierarchyService } from '../../projects/manage-project/settings/approval-hirerachy/approval-hierarchy.service';
const routes: Routes = [
  { path: '', component: BidApprovalHierarchyComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BidApprovalHierarchyComponent],
  providers: [BiddingApprovalHierarchyService, ApprovalHierarchyService],
  exports: [
    RouterModule
  ]
})
export class BidApprovalHierarchyModule { }

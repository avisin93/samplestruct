import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { CommonApprovalHierarchyComponent } from './common-approval-hierarchy.component';
import { CommonApprovalHierarchyService } from './common-approval-hierachy.service';


@NgModule({
  imports: [
    SharedModule
  ],
  providers: [CommonApprovalHierarchyService],
  declarations: [CommonApprovalHierarchyComponent],
  exports: [
    RouterModule,
    CommonApprovalHierarchyComponent
  ]
})
export class CommonApprovalHierarchyModule { }

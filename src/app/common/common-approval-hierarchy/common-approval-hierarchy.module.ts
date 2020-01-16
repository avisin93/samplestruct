import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { CommonApprovalHierarchyComponent } from './common-approval-hierarchy.component';


@NgModule({
  imports: [
    SharedModule
  ],
  providers: [],
  declarations: [CommonApprovalHierarchyComponent],
  exports: [
    RouterModule
  ]
})
export class CommonApprovalHierarchyModule { }

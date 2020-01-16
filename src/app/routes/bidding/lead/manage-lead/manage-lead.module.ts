import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLeadComponent } from './manage-lead.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ManageLeadService } from './manage-lead.service';
const routes: Routes = [
  { path: '', component: ManageLeadComponent }]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManageLeadComponent],
  exports: [
    RouterModule
  ],
  providers:[ManageLeadService]
})
export class ManageLeadModule { }

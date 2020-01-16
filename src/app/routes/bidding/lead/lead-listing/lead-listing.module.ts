import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadListingComponent } from './lead-listing.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { LeadListService } from './lead-listing.service';
const routes: Routes = [
  { path: '', component: LeadListingComponent }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeadListingComponent],
  exports: [
    RouterModule
  ],
  providers:[LeadListService]
})
export class LeadListingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { BidListingComponent } from './bid-listing.component';
import { ListBiddingService } from './/bidding-list.service';
const routes: Routes = [
  { path: '', component: BidListingComponent }]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BidListingComponent],
  providers: [ListBiddingService],
  exports: [
    RouterModule
  ]
})
export class BidListingModule { }

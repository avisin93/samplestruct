import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BiddingComponent } from "./bidding.component";
import { biddingRoutes } from "./bidding.routes";
import { PreBidHttpRequest } from './pre-bid-http-request';
import { BiddingService } from './bidding.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(biddingRoutes),
    SharedModule
  ],
  declarations: [BiddingComponent],
  exports: [
    RouterModule
  ],
  providers:[PreBidHttpRequest,BiddingService]
})
export class BiddingModule { }

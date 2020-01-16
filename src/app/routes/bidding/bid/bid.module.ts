import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BidComponent } from "./bid.component";
import { bidRoutes } from "./bid.routes";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(bidRoutes),
    SharedModule
  ],
  declarations: [BidComponent],
  exports: [
    RouterModule
  ],
  providers:[]
})
export class BidModule { }

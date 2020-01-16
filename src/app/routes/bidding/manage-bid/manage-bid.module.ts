import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageBidComponent } from './manage-bid.component';
import { manageBidRoutes } from './manage-bid.routes';
import { SharedModule } from '@app/shared/shared.module';
import { ManageBidService } from './manage-bid.service';
import { ManageBidData } from './manage-bid.data';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(manageBidRoutes),
    SharedModule
  ],
  declarations: [ManageBidComponent],
  exports: [
    RouterModule
  ],
  providers: [ManageBidData,ManageBidService]
})
export class ManageBidModule { }

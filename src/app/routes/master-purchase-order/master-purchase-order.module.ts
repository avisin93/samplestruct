import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { MasterPurchaseOrderComponent } from './master-purchase-order.component';
import { masterPurchasrOrderRoutes } from './master-purchase-order.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(masterPurchasrOrderRoutes),
    SharedModule
  ],
  declarations: [MasterPurchaseOrderComponent],
  exports: [
    RouterModule
  ]
})
export class MasterPurchaseOrderModule { }

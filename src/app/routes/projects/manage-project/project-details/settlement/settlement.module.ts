import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { settlementRoutes } from './settlement.routes';
import { SharedModule } from '../../../../../shared/shared.module';
import { SettlementComponent } from './settlement.component';

@NgModule({
  imports: [
    RouterModule.forChild(settlementRoutes),
    SharedModule
  ],
  declarations: [SettlementComponent],
  providers: [],
  exports: [
    RouterModule
  ]
})
export class SettlementModule { }

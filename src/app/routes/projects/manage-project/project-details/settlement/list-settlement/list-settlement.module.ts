import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '../../../../../../shared/shared.module';
import { ListSettlementComponent } from './list-settlement.component';
import { ListSettlementService } from './list-settlement.service';

const routes: Routes = [
  { path: '', component: ListSettlementComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ListSettlementComponent],
  exports: [
    RouterModule
  ],
  providers: [ListSettlementService]
})
export class ListSettlementModule { }

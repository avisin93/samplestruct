import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '../../../../../../shared/shared.module';
import { ManageSettlementComponent } from './manage-settlement.component';
import { ManageSettlementService } from './manage-settlement.service';

const routes: Routes = [
  { path: '', component: ManageSettlementComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ManageSettlementComponent],
  exports: [
    RouterModule
  ],
  providers: [ManageSettlementService]
})
export class ManageSettlementModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ManagePaymentComponent } from './manage-payment.component';
import { ManagePaymentService } from './manage-payment.services';
import { ShowTwoDecimalPipe } from '@app/shared/pipes';
const routes: Routes = [
  { path: '', component: ManagePaymentComponent }]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManagePaymentComponent],
  providers:[ManagePaymentService,ShowTwoDecimalPipe],
  exports: [
    RouterModule
  ]
})
export class ManagePaymentModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { paymentsRoutes } from './payments.routes';
import { PaymentsComponent } from './payments.component';

@NgModule({
  imports: [
    RouterModule.forChild(paymentsRoutes),
    SharedModule
  ],
  declarations: [PaymentsComponent],
  exports: [
    RouterModule
  ]
})
export class PaymentsModule { }

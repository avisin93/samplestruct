import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { PaymentComponent } from './payment.component';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { RoleGuard } from '@app/common';
const paymentRoutes: Routes = [
    {
        path: 'manage/:id',
        loadChildren: '../../../../payments/manage-payment/manage-payment.module#ManagePaymentModule',
        data: {
            type: ACTION_TYPES.ADD,
            moduleID: MODULE_ID.payments
          },
          canActivate: [RoleGuard]
    }]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(paymentRoutes),
        SharedModule
    ],
    declarations: [PaymentComponent],
    exports: [RouterModule]
})
export class PaymentModule { }

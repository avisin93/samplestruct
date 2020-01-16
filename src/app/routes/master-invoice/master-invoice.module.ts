import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { MasterInvoiceComponent } from './master-invoice.component';
import { masterInvoiceRoutes } from './master-invoice.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(masterInvoiceRoutes),
    SharedModule
  ],
  declarations: [MasterInvoiceComponent],
  exports: [
    RouterModule
  ]
})
export class MasterInvoiceModule { }

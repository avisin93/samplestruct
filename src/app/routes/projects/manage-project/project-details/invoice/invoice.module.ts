import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../../shared/shared.module';
import { invoiceRoutes } from './invoice.routes';
import { InvoiceComponent } from './invoice.component';
import { InvoiceListService } from './invoice-listing/invoice-listing.service';

@NgModule({
  imports: [
    RouterModule.forChild(invoiceRoutes),
    SharedModule
  ],
  declarations: [InvoiceComponent],
  exports: [ RouterModule ],
  providers: [ InvoiceListService ]
})
export class InvoiceModule { }

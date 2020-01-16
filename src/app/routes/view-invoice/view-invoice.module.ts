import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewInvoiceComponent } from './view-invoice.component';
import { ViewInvoicesService } from './view-invoice.service';
import { ShowTwoDecimalPipe } from '../../shared/pipes';
import { SharedModule } from '../../shared/shared.module';
const routes: Routes = [
  { path: '', component: ViewInvoiceComponent }];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [ViewInvoicesService, ShowTwoDecimalPipe],
  declarations: [ViewInvoiceComponent],
  exports: [
    RouterModule
  ]
})
export class ViewInvoiceModule { }

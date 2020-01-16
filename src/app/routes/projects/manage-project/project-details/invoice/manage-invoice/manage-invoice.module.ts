import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ManageInvoiceComponent } from './manage-invoice.component';
import { ManageInvoicesService } from './manage-invoice.service';
import { ShowTwoDecimalPipe } from '../../../../../../shared/pipes';
const routes: Routes = [
  { path: '', component: ManageInvoiceComponent }]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers:[ManageInvoicesService,ShowTwoDecimalPipe],
  declarations: [ManageInvoiceComponent],
  exports: [
    RouterModule
  ]
})
export class ManageInvoiceModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ViewInvoiceDetailsComponent } from './view-invoice-details.component';
import { ViewInvoiceDetailsService } from './view-invoice-details.service';
import { ShowTwoDecimalPipe } from '../../../../../../shared/pipes';
const routes: Routes = [
    { path: '', component: ViewInvoiceDetailsComponent }];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [ViewInvoiceDetailsService, ShowTwoDecimalPipe],
    declarations: [ViewInvoiceDetailsComponent],
    exports: [
        RouterModule
    ]
})
export class ViewInvoiceDetailsModule { }

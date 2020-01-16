import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { PaymentsListingComponent } from './payments-listing.component';
import { PaymentsListingService } from "./payments-listing.service";
const routes: Routes = [
  { path: '', component: PaymentsListingComponent }]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentsListingComponent],
  exports: [
    RouterModule
  ],
  providers: [PaymentsListingService]
})
export class PaymentsListingModule { }

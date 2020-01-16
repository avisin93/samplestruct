import { BuisnessTermsComponent } from './business-terms.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { manageBidRoutes } from '../manage-bid.routes';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { BusinessTermsService } from './business-terms.service';
import { BusinessTerms } from './business-terms';



const routes: Routes = [
  { path: '', component: BuisnessTermsComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuisnessTermsComponent],
  exports: [
    RouterModule
  ],
  providers: [BusinessTermsService, BusinessTerms]
})
export class BuisnessTermsModule { }

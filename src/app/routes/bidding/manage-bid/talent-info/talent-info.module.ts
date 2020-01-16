import { TalentInfoComponent } from './talent-info.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { manageBidRoutes } from '../manage-bid.routes';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TalentInfoService } from './talent-info.service';
import { TalentInfo } from './talent-info';



const routes: Routes = [
  { path: '', component: TalentInfoComponent }];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TalentInfoComponent],
  exports: [
    RouterModule
  ],
  providers: [TalentInfoService, TalentInfo]
})
export class TalentInfoModule { }

import { BasicInfoComponent} from './basic-info.component';
import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { manageBidRoutes } from '../manage-bid.routes';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { BasicInfoService } from './basic-info.service';
import { BasicInfo } from './basic-info';



const routes: Routes = [
    { path: '', component: BasicInfoComponent }]
  
  @NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(routes)
    ],
    declarations: [BasicInfoComponent],
    exports: [
      RouterModule
    ],
    providers:[BasicInfoService,BasicInfo]
  })
  export class BasicInfoModule { }
  
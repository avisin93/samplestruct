import { NgModule } from '@angular/core';
// import { AddSubPoLocationComponent } from '../add-sub-po-location/add-sub-po-location.component';
import { AddPoLocationComponent } from './add-po-location/add-po-location.component';
import { RouterModule } from '@angular/router';
import { manageLocationRoutes } from './manage-location.routes';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ManageLocationComponent } from './manage-location.component';
import { AddSubPoLocationComponent } from './add-sub-po-location/add-sub-po-location.component'

@NgModule({
  imports: [
    RouterModule.forChild(manageLocationRoutes),
    SharedModule
  ],
  declarations: [ManageLocationComponent,AddPoLocationComponent, AddSubPoLocationComponent],
  exports: [
    RouterModule
  ]
})
export class POManageLocationModule { }

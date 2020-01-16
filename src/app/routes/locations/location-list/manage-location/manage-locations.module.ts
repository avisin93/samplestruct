import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageLocationComponent } from './manage-location.component';
import { SharedModule } from '@app/shared/shared.module';
import {ManageLocationService} from './manage-location.service';
import { LocationCommonComponentsModule } from '../../common/location-common-components.module';
import { NgxGalleryModule } from 'ngx-gallery';
const routes: Routes = [
  { path: '', component: ManageLocationComponent }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    LocationCommonComponentsModule,
    NgxGalleryModule
  ],
  declarations: [ManageLocationComponent],
  exports: [
    RouterModule
  ],
  providers: [ManageLocationService]
})
export class ManageLocationsModule { }

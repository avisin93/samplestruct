//import { HeaderComponent } from './../header/header.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '../../../shared/core-common.module';
import { CommonComponentsModule } from '../common/common-components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageCropperModule } from 'ng2-img-cropper';
import { MyDatePickerModule } from 'mydatepicker';
import { FileUploadModule } from 'ng2-file-upload';
import { FreelancerActivationComponent } from './freelancer-activation.component';
import { FreelancerActivationService } from './freelancer-activation.service';
import { SharedService } from '../../../shared/shared.service';
import { RolePermission } from '../../../shared/role-permission';

const routes: Routes = [
  { path: '', component: FreelancerActivationComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule,
    ModalModule,
    ImageCropperModule,
    MyDatePickerModule,
    FileUploadModule,
    CommonComponentsModule
  ],
  declarations: [
    FreelancerActivationComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    FreelancerActivationService,
    SharedService
  ]
})
export class FreelancerActivationModule { }
 
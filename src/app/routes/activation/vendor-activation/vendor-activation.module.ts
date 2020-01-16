//import { HeaderComponent } from './../header/header.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '../../../shared/core-common.module';
import { CommonComponentsModule } from '../common/common-components.module';
import { ModalModule } from 'ngx-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { FileUploadModule } from 'ng2-file-upload';
import { VendorActivationComponent } from './vendor-activation.component';
import { VendorActivationService } from './vendor-activation.service';
import { SharedService } from '../../../shared/shared.service';
import { RolePermission } from '../../../shared/role-permission';

const routes: Routes = [
  { path: '', component: VendorActivationComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule,
    ModalModule,
    ImageCropperModule,
    FileUploadModule,
    CommonComponentsModule
  ],
  providers:[
    VendorActivationService,
    SharedService
  ],
  declarations: [
    VendorActivationComponent
  ],
  exports: [
    RouterModule
  ]
})
export class VendorActivationModule { }

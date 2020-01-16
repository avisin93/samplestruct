// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaClientUserSetupRoutingModule } from './exela-client-user-setup-routing.module';
import { ExelaClientUserSetupComponent } from './exela-client-user-setup.component';
import { AddEditExelaClientUserComponent } from './add-edit-exela-client-user/add-edit-exela-client-user.component';
import { ExelaClientUserInformationComponent } from './add-edit-exela-client-user/exela-client-user-information/exela-client-user-information.component';
import { ExelaClientUserRoleComponent } from './add-edit-exela-client-user/exela-client-user-role/exela-client-user-role-setup.component';
import { ExelaClientUserResetPasswordComponent } from './add-edit-exela-client-user/exela-client-user-reset-password/exela-client-user-reset-password.component';
import { UploadListComponent } from './add-edit-exela-client-user/upload-list/upload-list.component';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../material.module';
// Components

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaClientUserSetupRoutingModule,
    PerfectScrollbarModule
  ],
  declarations: [
    ExelaClientUserSetupComponent,
    AddEditExelaClientUserComponent,
    ExelaClientUserInformationComponent,
    ExelaClientUserRoleComponent,
    ExelaClientUserResetPasswordComponent,
    UploadListComponent
  ],
  exports: [
    ExelaClientUserSetupComponent
  ],
  entryComponents: [
    UploadListComponent
  ],
  providers: [

  ]
})
export class ExelaClientUserSetupModule { }

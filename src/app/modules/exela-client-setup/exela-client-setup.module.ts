// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AutoCompleteModule } from 'primeng/primeng';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaClientSetupRoutingModule } from './exela-client-setup-routing.module';

// Components
import { ExelaClientSetupComponent } from './exela-client-setup.component';
import { AddEditExelaClientSetupComponent } from './add-edit-exela-client/add-edit-exela-client.component';
import { ExelaClientProductTabComponent } from './add-edit-exela-client/exela-client-product-setup-tab/exela-client-product-setup.component';
import { ExelaClientActionTabComponent } from './add-edit-exela-client/exela-client-action-setup-tab/exela-client-action-setup.component';
import { ExelaClientMenuTabComponent } from './add-edit-exela-client/exela-client-menu-setup-tab/exela-client-menu-setup.component';
import { ExelaClientInformationTabComponent } from './add-edit-exela-client/exela-client-information-tab/exela-client-information.component';
import { AssignStoreFrontComponent } from './add-edit-exela-client/assign-store-front/assign-store-front.component';
import { BrandingComponent } from './add-edit-exela-client/assign-store-front/branding/branding.component';
import { PromotionalBannerComponent } from './add-edit-exela-client/assign-store-front/promotional-banner/promotional-banner.component';
import { SelectThemeComponent } from './add-edit-exela-client/assign-store-front/select-theme/select-theme.component';
import { NonRegisteredClientUsersSetupComponent } from './add-edit-exela-client/non-registered-users-setup-tab/non-registered-users-setup-tab.component';
import { UploadListNonRegUsersComponent } from './add-edit-exela-client/non-registered-users-setup-tab/upload-list/upload-list-non-registered-users.component';
import { AddEditNonRegisteredUsersComponent } from './add-edit-exela-client/non-registered-users-setup-tab/add-edit-non-registered-users/add-edit-non-registered-users.component';
import { ClientSharedMailboxTabComponent } from './add-edit-exela-client/exela-client-shared-mailbox-tab/exela-client-shared-mailbox.component';
import { AddEditSharedMailboxTabComponent } from './add-edit-exela-client/exela-client-shared-mailbox-tab/add-edit-shared-mailbox/add-edit-shared-mailbox.component';
import { ClientFormElementGroupTabComponent } from './add-edit-exela-client/exela-client-form-element-group-tab/exela-client-form-element-group.component';
import { AddEditFormElementGroupTabComponent } from './add-edit-exela-client/exela-client-form-element-group-tab/add-edit-form-element-group/add-edit-form-element-group.component';

import { SelfRegisteredClientUsersSetupComponent } from './add-edit-exela-client/self-registered-users-setup-tab/self-registered-users-setup-tab.component';
import { UploadListSelfRegUsersComponent } from './add-edit-exela-client/self-registered-users-setup-tab/upload-list/upload-list-self-registered-users.component';
import { AddEditSelfRegisteredUsersComponent } from './add-edit-exela-client/self-registered-users-setup-tab/add-edit-self-registered-users/add-edit-self-registered-users.component';
import { ConfigurablePasswordSetupTabComponent } from './add-edit-exela-client/configurable-password-setup-tab/configurable-password-setup-tab.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaClientSetupRoutingModule,
    PerfectScrollbarModule,
    AutoCompleteModule
  ],
  declarations: [
    ExelaClientSetupComponent,
    AddEditExelaClientSetupComponent,
    ExelaClientInformationTabComponent,
    ExelaClientProductTabComponent,
    ExelaClientActionTabComponent,
    ExelaClientMenuTabComponent,
    AssignStoreFrontComponent,
    BrandingComponent,
    PromotionalBannerComponent,
    SelectThemeComponent,
    NonRegisteredClientUsersSetupComponent,
    UploadListNonRegUsersComponent,
    AddEditNonRegisteredUsersComponent,
    SelfRegisteredClientUsersSetupComponent,
    UploadListSelfRegUsersComponent,
    AddEditSelfRegisteredUsersComponent,
    ClientSharedMailboxTabComponent,
    AddEditSharedMailboxTabComponent,
    ClientFormElementGroupTabComponent,
    AddEditFormElementGroupTabComponent,
    ConfigurablePasswordSetupTabComponent
  ],
  exports: [
  ],
  entryComponents: [
    UploadListNonRegUsersComponent,
    AddEditNonRegisteredUsersComponent,
    UploadListSelfRegUsersComponent,
    AddEditSelfRegisteredUsersComponent,
    AddEditSharedMailboxTabComponent,
    AddEditFormElementGroupTabComponent
  ],
  providers: [
  ]
})
export class ExelaClientSetupModule { }

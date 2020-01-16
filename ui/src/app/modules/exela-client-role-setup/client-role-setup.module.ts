// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ClientRoleSetupRoutingModule } from './client-role-setup-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ClientRoleSetupTabComponent } from './client-role-setup.component';
import { AddEditClientRoleSetupComponent } from './add-edit-client-role-setup/add-edit-client-role-setup.component';
import { ClientRoleMenuAssignmentTabComponent } from './add-edit-client-role-setup/client-role-menu-assignment/client-role-menu-assignment.component';
import { ClientRoleInformationTabComponent } from './add-edit-client-role-setup/client-role-information-tab/client-role-information.component';
import { ClientRoleProjectAssignmentTabComponent } from './add-edit-client-role-setup/client-role-project-assignment/client-role-project-assignment.component';
import { ClientRoleFormtypeAccessTabComponent } from './add-edit-client-role-setup/client-role-formtype-access-tab/client-role-formtype-access.component';
import { AddEditFormTypeAccessComponent } from './add-edit-client-role-setup/client-role-formtype-access-tab/add-edit-formtype-access/add-edit-formtype-access.component';
import { ClientSharedMailboxAssignmentTabComponent } from './add-edit-client-role-setup/client-role-shared-mailbox-assignment/client-role-shared-mailbox-assignment.component';
import { ClientRoleListHeaderTabComponent } from './add-edit-client-role-setup/client-role-list-header/client-role-list-header.component';
import { DragDropModule } from 'primeng/components/dragdrop/dragdrop';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    ClientRoleSetupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    DragDropModule
  ],
  declarations: [
    ClientRoleSetupTabComponent,
    AddEditClientRoleSetupComponent,
    ClientRoleInformationTabComponent,
    ClientRoleMenuAssignmentTabComponent,
    ClientRoleProjectAssignmentTabComponent,
    ClientRoleFormtypeAccessTabComponent,
    AddEditFormTypeAccessComponent,
    ClientSharedMailboxAssignmentTabComponent,
    ClientRoleListHeaderTabComponent
  ],
  exports: [
  ],
  entryComponents: [
    AddEditFormTypeAccessComponent
  ],
  providers: [
  ]
})
export class ExelaClientRoleSetupModule { }

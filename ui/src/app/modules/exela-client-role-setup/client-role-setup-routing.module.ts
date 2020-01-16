// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditClientRoleSetupComponent } from './add-edit-client-role-setup/add-edit-client-role-setup.component';
import { ClientRoleSetupTabComponent } from './client-role-setup.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ClientRoleSetupTabComponent
  },
  {
    path: 'add/:organizationId',
    component: AddEditClientRoleSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id/:organizationId',
    component: AddEditClientRoleSetupComponent,
    data: {
      mode: 'edit'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class ClientRoleSetupRoutingModule { }

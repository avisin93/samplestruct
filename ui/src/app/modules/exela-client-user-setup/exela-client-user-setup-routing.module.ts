// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaClientUserSetupComponent } from './exela-client-user-setup.component';
import { AddEditExelaClientUserComponent } from './add-edit-exela-client-user/add-edit-exela-client-user.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ExelaClientUserSetupComponent
  },
  {
    path: 'add/:organizationId',
    component: AddEditExelaClientUserComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id/:organizationId',
    component: AddEditExelaClientUserComponent,
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
export class ExelaClientUserSetupRoutingModule { }

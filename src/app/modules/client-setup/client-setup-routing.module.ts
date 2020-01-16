// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ClientSetupComponent } from './client-setup.component';
import { AddEditClientSetupComponent } from './add-edit-client-setup/add-edit-client-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ClientSetupComponent
  },
  {
    path: 'add',
    component: AddEditClientSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditClientSetupComponent,
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
export class ClientSetupRoutingModule { }

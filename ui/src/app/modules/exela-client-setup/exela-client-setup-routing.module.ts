// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaClientSetupComponent } from './exela-client-setup.component';
import { AddEditExelaClientSetupComponent } from './add-edit-exela-client/add-edit-exela-client.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaClientSetupComponent
  },
  {
    path: 'add',
    component: AddEditExelaClientSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditExelaClientSetupComponent,
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
export class ExelaClientSetupRoutingModule { }

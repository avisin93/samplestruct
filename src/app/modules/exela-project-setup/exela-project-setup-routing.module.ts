// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaProjectSetupComponent } from './exela-project-setup.component';
import { AddEditExelaProjectSetupComponent } from './add-edit-exela-project-setup/add-edit-exela-project-setup.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ExelaProjectSetupComponent
  },
  {
    path: 'add/:organizationId',
    component: AddEditExelaProjectSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditExelaProjectSetupComponent,
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
export class ExelaProjectSetupRoutingModule { }

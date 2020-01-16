// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelSetupComponent } from './model-setup.component';
import { AddEditModelSetupComponent } from './add-edit-model-setup/add-edit-model-setup.component';
// import { ModelSetupService } from "./model-setup.service";

// Components

const routes: Routes = [
  {
    path: '',
    component: ModelSetupComponent
  } ,
  {
    path: 'add',
    component: AddEditModelSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditModelSetupComponent,
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
   // ModelSetupService
  ]
})
export class ModelSetupRoutingModule { }

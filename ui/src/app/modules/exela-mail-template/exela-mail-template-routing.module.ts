// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaMailTemplateComponent } from './exela-mail-template.component';
import { AddEditExelaMailTemplateComponent } from './add-edit-exela-mail-template/add-edit-exela-mail-template.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaMailTemplateComponent
  },
  {
    path: 'add/:id',
    component: AddEditExelaMailTemplateComponent
  },
  {
    path: 'edit/:id/:organizationId',
    component: AddEditExelaMailTemplateComponent ,
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
  providers: []
})
export class ExelaMailTemplateRoutingModule { }

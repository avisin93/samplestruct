// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaProductSetupComponent } from './exela-product-setup.component';
import { AddEditExelaProductComponent } from './add-edit-exela-product/add-edit-exela-product.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ExelaProductSetupComponent
  },
  {
    path: 'add',
    component: AddEditExelaProductComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditExelaProductComponent,
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
export class ExelaProductSetupRoutingModule { }

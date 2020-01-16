// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { StoreFrontSetupComponent } from './storefront-setup.component';
import { AddEditThemeComponent } from './add-edit-theme/add-edit-theme.component';

const routes: Routes = [
  {
    path: '',
    component: StoreFrontSetupComponent
  },
  {
    path: 'add',
    component: AddEditThemeComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditThemeComponent,
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
export class StoreFrontSetupRoutingModule { }

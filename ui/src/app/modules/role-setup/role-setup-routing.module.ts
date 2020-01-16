// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { RoleSetupComponent } from './role-setup.component';

const routes: Routes = [
  {
    path: '',
    component: RoleSetupComponent
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
export class RoleSetupRoutingModule { }

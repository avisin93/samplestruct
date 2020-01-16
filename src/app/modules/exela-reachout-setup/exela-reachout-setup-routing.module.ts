// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaReachoutSetupComponent } from './exela-reachout-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaReachoutSetupComponent
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
export class ExelaReachoutSetupRoutingModule { }

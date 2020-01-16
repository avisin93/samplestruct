// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaPulseSetupComponent } from './exela-pulse-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaPulseSetupComponent
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
export class ExelaPulseSetupRoutingModule { }

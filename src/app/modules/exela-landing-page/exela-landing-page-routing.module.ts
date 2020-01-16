// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaLandingPageComponent } from './exela-landing-page.component';

// Components

const routes: Routes = [
  {
    path: '',
    component: ExelaLandingPageComponent
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
export class ExelaLandingPageRoutingModule { }

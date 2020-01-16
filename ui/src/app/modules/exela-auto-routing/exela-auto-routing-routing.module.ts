// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AutoRoutingComponent } from './auto-routing/auto-routing.component';
import { ExelaAutoRoutingComponent } from './exela-auto-routing.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaAutoRoutingComponent
  },
  {
    path: 'add/:organizationId',
    component: AutoRoutingComponent
  },
  {
    path: 'edit/:id/:organizationId',
    component: AutoRoutingComponent,
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
export class ExelaAutoRoutingRoutingModule { }

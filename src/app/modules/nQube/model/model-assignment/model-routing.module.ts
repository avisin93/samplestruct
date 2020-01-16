import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModelAssignmentComponent } from './model.assignment.component';

export const routes: Routes = [
  {
    path: '',
    component: ModelAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ModelRoutingModule { }

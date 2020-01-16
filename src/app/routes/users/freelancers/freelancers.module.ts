import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { ACTION_TYPES, MODULE_ID } from '../../../config'
import { FreelancersComponent } from './freelancers.component'
import { freelancersRoutes } from './freelancers.routes'

@NgModule({
  imports: [
    RouterModule.forChild(freelancersRoutes),
  ],
  declarations: [FreelancersComponent],
  exports: [
    RouterModule
  ]
})
export class FreelancersModule { }

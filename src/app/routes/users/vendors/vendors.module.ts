import { NgModule } from '@angular/core';
import { VendorsComponent } from './vendors.component';
import { vendorsRoutes } from './vendors.routes'
import { Routes, RouterModule } from '@angular/router'
@NgModule({
  imports: [
    RouterModule.forChild(vendorsRoutes)
  ],
  declarations: [VendorsComponent],
  exports: [
    RouterModule
  ]
})
export class VendorsModule { }

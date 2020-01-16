import { NgModule } from '@angular/core';
import { LocationsComponent } from './locations.component';
import { Routes, RouterModule } from '@angular/router';
import { locationRoutes } from './locations.routes';

@NgModule({
  imports: [
    RouterModule.forChild(locationRoutes)
  ],
  declarations: [LocationsComponent],
  exports: [
    RouterModule
  ]
})
export class LocationsModule { }

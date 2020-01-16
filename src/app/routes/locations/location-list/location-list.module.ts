import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationListComponent } from './location-list.component';
import {locationListRoutes} from './location-list.routes';
@NgModule({
  imports: [
    RouterModule.forChild(locationListRoutes),
  ],
  declarations: [LocationListComponent],
  exports: [
    RouterModule
  ]
})
export class LocationListModule {}

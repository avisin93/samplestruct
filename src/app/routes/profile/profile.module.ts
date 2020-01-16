import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { profileRoutes} from './profile.routes';

@NgModule({
  imports: [
    RouterModule.forChild(profileRoutes)
  ],
  declarations: [ProfileComponent],
  exports: [
    RouterModule
  ]
})
export class ProfileModule { }

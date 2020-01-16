import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { Routes, RouterModule } from '@angular/router'
import { usersRoutes } from './users.routes';

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  declarations: [UsersComponent],
  exports: [
    RouterModule
  ]
})
export class UsersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { rolesRoutes } from './roles.routes';
import { RolesComponent } from './roles.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(rolesRoutes),
    SharedModule
  ],
  declarations: [RolesComponent],
  exports: [
    RouterModule
  ]
})

export class RolesModule { }

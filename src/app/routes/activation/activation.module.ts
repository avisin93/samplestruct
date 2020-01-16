import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivationComponent } from './activation.component';
import { Routes, RouterModule } from '@angular/router';
import { activationRoutes } from './activation.routes';

@NgModule({
  imports: [
    RouterModule.forChild(activationRoutes),
    SharedModule
  ],
  declarations: [
    ActivationComponent
  ],
  exports: [
    RouterModule
  ]
})
export class ActivationModule { }

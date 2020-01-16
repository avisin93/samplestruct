import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { IndividualComponent } from './individual.component';
import { individualRoutes } from './individual.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(individualRoutes),
    SharedModule
  ],
  declarations: [IndividualComponent],
  exports: [
    RouterModule
  ]
})
export class IndividualModule { }

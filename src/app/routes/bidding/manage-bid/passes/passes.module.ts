import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { PassesComponent } from './passes.component';
import { PassesService } from './passes.service';

const routes: Routes = [
  {
    path: '', component: PassesComponent
  }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [PassesService ],
  declarations: [PassesComponent],
  exports: [
    RouterModule
  ]
})
export class PassesModule { }

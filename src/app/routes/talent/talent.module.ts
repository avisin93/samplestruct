import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { TalentComponent } from './talent.component';
import { talentRoutes } from './talent.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(talentRoutes),
    SharedModule
  ],
  declarations: [TalentComponent],
  exports: [
    RouterModule
  ]
})
export class TalentModule { }

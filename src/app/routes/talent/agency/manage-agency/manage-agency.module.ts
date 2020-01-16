import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAgencyComponent } from './manage-agency.component';
import { SharedModule } from '@app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ManageAgencyService } from './manage-agency.service';

const routes: Routes = [
  { path: '', component: ManageAgencyComponent },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ManageAgencyComponent],
  providers: [ManageAgencyService],
  exports: [
    RouterModule
  ]
})
export class ManageAgencyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAgencyComponent } from './list-agency.component';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module';
import { AgencyListService } from './list-agency.service';

const routes: Routes = [
  { path: '', component: ListAgencyComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ListAgencyComponent],
  providers: [AgencyListService],
  exports: [
    RouterModule
  ]
})
export class ListAgencyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'
import { ListIndividualComponent } from './list-individual.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ListIndividualService } from './list-individual.service';

const routes: Routes = [
  { path: '', component: ListIndividualComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ListIndividualComponent],
  providers: [ListIndividualService],
  exports: [
    RouterModule
  ]
})
export class ListIndividualModule { }

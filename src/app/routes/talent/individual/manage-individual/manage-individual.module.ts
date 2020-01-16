import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageIndividualComponent } from './manage-individual.component';
import { SharedModule } from '../../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ManageIndividualService } from './manage-individual.service';

const routes: Routes = [
  { path: '', component: ManageIndividualComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ManageIndividualComponent],
  providers: [ManageIndividualService],
  exports: [
    RouterModule
  ]
})
export class ManageIndividualModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { ListFreelancersComponent } from './list-freelancers.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FreelancersListService } from './list-freelancers.service';
const routes: Routes = [
  { path: '', component: ListFreelancersComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ListFreelancersComponent],
  exports: [
    RouterModule
  ],
  providers: [FreelancersListService]
})
export class ListFreelancersModule { }

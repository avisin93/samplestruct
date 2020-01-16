import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { AddFreelancerComponent } from './add-freelancer.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AddFreelancerService } from './add-freelancer.service';
const routes: Routes = [
  { path: '', component: AddFreelancerComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AddFreelancerComponent],
  exports: [
    RouterModule
  ],
  providers: [AddFreelancerService]
})
export class AddFreelancerModule { }

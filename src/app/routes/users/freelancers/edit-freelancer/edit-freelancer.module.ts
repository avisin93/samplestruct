import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { EditFreelancerComponent } from './edit-freelancer.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EditFreelancerService } from './edit-freelancer.service';

const routes: Routes = [
  { path: '', component: EditFreelancerComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [EditFreelancerComponent],
  exports: [
    RouterModule
  ],
  providers: [EditFreelancerService]
})
export class EditFreelancerModule { }

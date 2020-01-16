import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectComponent } from './add-project.component';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module';
import { AddProjectService } from './add-project.service';

const routes: Routes = [
  { path: '', component: AddProjectComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AddProjectComponent],
  exports: [
    RouterModule
  ],
  providers: [AddProjectService]
})
export class AddProjectModule { }

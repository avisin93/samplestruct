import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageProjectComponent } from './manage-project.component';
import { manageProjectRoutes } from './manage-project.routes';
import { SharedModule } from '@app/shared/shared.module';
import { ManageProjectService } from './manage-project.service';

import { ProjectAssignmentComponent } from '../manage-project/project-details//project-assignment/project-assignment.component';
import { ProjectAssignmentService } from '../manage-project/project-details//project-assignment/project-assignment.service';
@NgModule({
  imports: [
    RouterModule.forChild(manageProjectRoutes),
    SharedModule
  ],
  providers: [ManageProjectService, ProjectAssignmentService],
  declarations: [ManageProjectComponent, ProjectAssignmentComponent],
  exports: [
    RouterModule
  ],
})
export class ManageProjectModule { }

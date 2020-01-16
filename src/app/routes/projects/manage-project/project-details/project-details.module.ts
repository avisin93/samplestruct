import { NgModule } from '@angular/core';
import { ProjectDetailsComponent } from './project-details.component';
import { Routes, RouterModule } from '@angular/router'
import { SharedModule } from '../../../../shared/shared.module';

// import { ContractsComponent } from './contracts/contracts.component';
import { projectDetailsRoutes } from './project-details.routes';
// import { ProjectAssignmentComponent } from './project-assignment/project-assignment.component';
// import { ProjectAssignmentService } from './project-assignment/project-assignment.service';

@NgModule({
  imports: [
    RouterModule.forChild(projectDetailsRoutes),
    SharedModule
  ],
  // declarations: [ProjectDetailsComponent, ProjectComponent, ContractsComponent, ProjectAssignmentComponent],
  declarations: [ProjectDetailsComponent],
  exports: [
    RouterModule
  ],
  providers: []
})
export class ProjectDetailsModule { }

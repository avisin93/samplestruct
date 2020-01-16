import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import {ProjectComponent} from './project.component'
import { ProjectService } from './project.service';
const projectRoutes: Routes = [
    { path: '', component: ProjectComponent },
  ];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(projectRoutes),
    SharedModule
  ],
  declarations: [ProjectComponent],
  exports: [
    RouterModule
  ],
  providers:[ProjectService]
})
export class ProjectModule { }

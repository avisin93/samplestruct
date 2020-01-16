import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { Routes, RouterModule } from '@angular/router'
import { projectsRoutes } from './projects.routes';
import { ProjectsData } from './projects.data';


@NgModule({
  imports: [
    RouterModule.forChild(projectsRoutes)
  ],
  declarations: [ProjectsComponent],
  exports: [
    RouterModule
  ],
  providers:[ProjectsData]
})
export class ProjectsModule { }

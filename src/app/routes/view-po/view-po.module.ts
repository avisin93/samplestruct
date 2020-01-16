import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPoComponent } from './view-po.component';
import { ViewPOService } from './view-po.service';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsData } from '../projects/projects.data';


const routes: Routes = [
  { path: '', component: ViewPoComponent }];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [ViewPOService, ProjectsData],
  declarations: [ViewPoComponent],
  exports: [
    RouterModule
  ]
})
export class ViewPoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProjectsComponent } from './list-projects.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ListProjectsService } from './list-projects.service';

const routes: Routes = [
  { path: '', component: ListProjectsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ListProjectsComponent],
  providers:[ListProjectsService],
  exports: [
    RouterModule
  ]
})
export class ListProjectsModule { }

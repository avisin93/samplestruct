import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditingAndPostComponent } from './editing-and-post.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EditingAndPostService } from './editing-and-post.service';
import { EditingAndPost } from './editing-and-post';

const routes: Routes = [
  {
    path: '', component: EditingAndPostComponent
  }];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditingAndPostComponent],
  exports: [
    RouterModule
  ],
  providers: [EditingAndPostService, EditingAndPost]
})
export class EditingAndPostModule { }

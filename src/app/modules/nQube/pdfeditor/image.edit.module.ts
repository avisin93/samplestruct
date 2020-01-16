import { NgModule } from '@angular/core';
import { ImageEditComponent } from './image.edit.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: ImageEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [
    ImageEditComponent
  ],
  exports: [],
  providers: []
})
export class ImageEditModule {

}

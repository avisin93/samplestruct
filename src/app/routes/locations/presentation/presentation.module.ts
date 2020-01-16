import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentationComponent } from './presentation.component';

const routes: Routes = [
  { path: '', component: PresentationComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [PresentationComponent],
  exports: [
    RouterModule
  ]
})
export class PresentationModule { }
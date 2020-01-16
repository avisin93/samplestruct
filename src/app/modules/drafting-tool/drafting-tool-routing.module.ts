import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DraftingToolComponent } from './drafting-tool.component';

const routes: Routes = [
  {
    path: '',
    component: DraftingToolComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class DraftingToolRoutingModule { }

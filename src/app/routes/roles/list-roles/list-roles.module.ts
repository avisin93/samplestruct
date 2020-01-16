import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ListRolesComponent } from './list-roles.component';
import { ListRolesService } from './list-roles.service';
const routes: Routes = [
  { path: '', component: ListRolesComponent }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListRolesComponent],
  exports: [
    RouterModule
  ],
  providers: [ListRolesService]
})
export class RolesListingModule { }

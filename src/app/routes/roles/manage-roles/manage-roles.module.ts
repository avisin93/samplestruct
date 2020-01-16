import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ManageRolesComponent } from './manage-roles.component';
import { ManageRolesService } from './manage-roles.service';
const routes: Routes = [
  { path: '', component: ManageRolesComponent }]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManageRolesComponent],
  exports: [
    RouterModule
  ],
  providers: [ManageRolesService]
})
export class ManageRolesModule { }

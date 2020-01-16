// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';

// Components
import { GroupsComponent } from './groups.component';
import { AddEditGroupsComponent } from './add-edit-groups/add-edit-groups.component';
import { AddGroupUserComponent } from './add-group-user/add-group-user.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    GroupsComponent,
    AddEditGroupsComponent,
    AddGroupUserComponent
  ],
  exports: [
    GroupsComponent,
    AddEditGroupsComponent,
    AddGroupUserComponent
  ],
  entryComponents: [
    AddGroupUserComponent
  ],
  providers: [

  ]
})
export class GroupsModule { }

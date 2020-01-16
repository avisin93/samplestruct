// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../shared/shared.module';
import { GroupsModule } from '../groups/groups.module';

// Components
import { FacilitiesComponent } from './facilities.component';
import { AddEditFacilitiesComponent } from './add-edit-facilities/add-edit-facilities.component';
import { UploadListComponent } from './upload-list/upload-list.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GroupsModule
  ],
  declarations: [
    FacilitiesComponent,
    AddEditFacilitiesComponent,
    UploadListComponent
  ],
  exports: [
    FacilitiesComponent,
    AddEditFacilitiesComponent,
    UploadListComponent
  ],
  entryComponents: [
    AddEditFacilitiesComponent,
    UploadListComponent
  ],
  providers: [

  ]
})
export class FacilitiesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyProfileRouting } from './my-profile-routing.module';
import { SharedModule } from '../../shared.module';
import { MyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MyProfileRouting
  ],
  declarations: [
    MyProfileComponent
  ],
  exports: [],
  providers: []
})
export class MyProfileModule {}

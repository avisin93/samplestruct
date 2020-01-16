import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material';
import { MaterialModule } from '../material.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule
  ],
  exports: [MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule { }

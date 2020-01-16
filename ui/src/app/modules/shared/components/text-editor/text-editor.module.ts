// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ngx-ckeditor';
import { TextEditorComponent } from './text-editor.component';
import { UploadImgComponent } from './upload-img/upload-img.component';
import { HttpClientModule } from '@angular/common/http';
import { DynamicContentComponent } from './dynamic-content/dynamic-content.component';
import { MaterialModule } from 'src/app/modules/material.module';
// Modules

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    CKEditorModule
  ],
  declarations: [
    TextEditorComponent,
    UploadImgComponent,
    DynamicContentComponent
  ],
  exports: [
    TextEditorComponent
  ],
  entryComponents: [
    UploadImgComponent,
    DynamicContentComponent
  ],
  providers: [
    UploadImgComponent,
    DynamicContentComponent
  ]
})
export class TextEditorModule { }

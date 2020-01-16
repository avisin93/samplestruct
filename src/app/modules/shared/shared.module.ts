// Core Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Components
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
// Services
import { EmitterService } from './providers/emitter.service';
import { FooterComponent } from './components/footer/footer.component';
import { StorageService } from './providers/storage.service';
import { HttpService } from './providers/http.service';
import { LoaderService } from './components/loader/loader.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { HeadingSectionComponent } from './heading-section/heading-section.component';
import { CarouselDirective } from './directives/carousel/carousel.directive';
import { NgDataTablesModule } from './modules/ng-data-tables/ng-data-tables.module';
import { TruncatePipe } from './pipes/limitTo.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { FileUploadController } from './controllers/file-uploader.controller';
import { UtilitiesService } from './providers/utilities.service';
import { ColorPickerDirective } from './directives/color-picker/color-picker.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptedHttp } from './providers/intercepted.http';
import { ExecuteFileComponent } from '../nQube/model/model-assignment/add-edit-model/execute.file.component';
import { TextEditorModule } from './components/text-editor/text-editor.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HeaderService } from './components/header/header.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    NgDataTablesModule,
    TextEditorModule
  ],
  declarations: [
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    HeadingSectionComponent,
    CarouselDirective,
    TruncatePipe,
    LoaderComponent,
    ColorPickerDirective,
    ExecuteFileComponent,
    ChangePasswordComponent
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    HeadingSectionComponent,
    CarouselDirective,
    NgDataTablesModule,
    TruncatePipe,
    LoaderComponent,
    ColorPickerDirective,
    TextEditorModule
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  providers: [
    FileUploadController,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptedHttp, multi: true }
  ]
})
export class SharedModule {
  static forRoot (): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        HttpService,
        StorageService,
        EmitterService,
        LoaderService,
        UtilitiesService,
        HeaderService
      ]
    };
  }
}

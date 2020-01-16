import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { LoaderComponent } from './loader/loader.component';
import { ShowTwoDecimalPipe, NumberFormatPipe } from './pipes';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
import { SessionService, ToasterService } from '../common';
import { CookieService } from 'ngx-cookie-service';
import { RolePermission } from './role-permission';

const CustomSelectOptions: INgxSelectOptions = { // Check the interface for more options
  optionValueField: 'id',
  optionTextField: 'text'
};
// https://angular.io/styleguide#!#04-10
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LocalStorageModule.withConfig({
      storageType: 'localStorage'
    }),
    NgxSelectModule.forRoot(CustomSelectOptions)
  ],
  providers: [
    LocalStorageService,
    SessionService,
    CookieService,
    RolePermission,
    ToasterService
  ],
  declarations: [
    LoaderComponent,
    ShowTwoDecimalPipe,
    NumberFormatPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgxSelectModule,
    LoaderComponent,
    ShowTwoDecimalPipe,
    NumberFormatPipe
  ]
})

// https://github.com/ocombe/ng2-translate/issues/209
export class CoreCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreCommonModule
    };
  }
}

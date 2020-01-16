import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './root.component';
import { AppRoutingModule } from './root-routing.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../modules/material.module';

import { LoginComponent } from '../modules/login/login.component';
import { AuthGuardService } from '../modules/auth/auth-guard.service';
import { MatInputModule, MatFormFieldModule, MatTabsModule } from '@angular/material';
import { PagesModule } from '../modules/pages.module';
import { ToastrModule } from 'ngx-toastr';
import { RoleComponent } from './role/role.component';
import { SharedModule } from '../modules/shared/shared.module';
import { BreadcrumbComponent } from '../modules/breadcrumb/breadcrumb.component';
import * as $ from 'jquery';
import { ContractsModule } from '../modules/contracts/contracts.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    PagesModule,
    ReactiveFormsModule,
    SharedModule.forRoot(),
    NgbModule.forRoot(),
    HttpClientModule,
    DashboardModule,
    ContractsModule,
    ToastrModule.forRoot()

  ],

  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }, AuthGuardService
  ]
})
export class AppModule { }

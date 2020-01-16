// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { NgDataTablesComponent } from './ng-data-tables.component';
import { NgPaginationComponent } from './ng-pagination/ng-pagination.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule
  ],
  declarations: [
    NgDataTablesComponent,
    NgPaginationComponent
  ],
  exports: [
    NgDataTablesComponent
  ]
})
export class NgDataTablesModule { }

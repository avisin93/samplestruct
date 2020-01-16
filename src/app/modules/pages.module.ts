import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { HeaderComponent } from './header/header.component';
import { MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatOptionModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { CommonModule } from '@angular/common';
import { ContractsModule } from './contracts/contracts.module';
import { MenuSidebarService } from './menu-sidebar/menu-sidebar.service';
import { RequestService } from './request.service';
import { ContractService } from './contracts/contracts.service';
import { ExcelService } from './excel/excel.service';

import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DocHistoryComponent } from './doc-search/doc-history/doc-history.component';
import { MY_FORMATS, MomentUtcDateAdapter } from './moment-utc-date-adapter';
import { NotificationListService } from './notification/notification-list.service';
import { NotificationListModule } from './notification/notification-list.module';
import { GraphViewComponent } from './doc-search/doc-history/graph-view/graph-view.component';
import { UpdateCommentDialogComponent } from './doc-search/doc-history/dialog-components/update-comment-dialog/update-comment-dialog.component';
import { CalendarGraphViewComponent } from './doc-search/doc-history/calendar-graph-view/calendar-graph-view.component';
import { StorageService } from './shared/providers/storage.service';
import { SharedModule } from './shared/shared.module';
import { PopUpComponent } from './pop-up/pop-up.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SatDatepickerModule, SatNativeDateModule, DateAdapter as SatDateAdapter, MAT_DATE_FORMATS as SAT_MAT_DATE_FORMATS } from 'saturn-datepicker';
import { CommentPipe } from '../modules/shared/pipes/comment.pipe';
import { TrashComponent } from './trash/trash.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    MatOptionModule,
    PagesRoutingModule,
    DashboardModule,
    CommonModule,
    ContractsModule,
    BrowserModule,
    FlexLayoutModule,
    NgxDatatableModule,
    NotificationListModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SatDatepickerModule,
    SatNativeDateModule
  ],
  declarations: [
    PagesComponent,
    HeaderComponent,
    MenuSidebarComponent,
    DocSearchComponent,
    DocHistoryComponent,
    TrashComponent,
    GraphViewComponent,
    CalendarGraphViewComponent,
    ContractListComponent,
    PopUpComponent,
    UpdateCommentDialogComponent,
    CommentPipe
  ],
  providers: [
    MenuSidebarService,
    RequestService,
    ContractService,
    ExcelService,
    NotificationListService,
    StorageService,
    { provide: SAT_MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: SatDateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  entryComponents : [
    PopUpComponent,
    UpdateCommentDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PagesModule { }

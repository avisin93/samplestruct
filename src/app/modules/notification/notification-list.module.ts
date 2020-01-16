import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddEditNotificationComponent } from './add-edit-notification/add-edit-notification.component';
import { NotificationListComponent } from './notification-list.component';
import { NotificationListService } from './notification-list.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter, CalendarUtils } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import { addWeeks, endOfMonth } from 'date-fns';
import { SharedModule } from '../shared/shared.module';

export class MyCalendarUtils extends CalendarUtils {
  getMonthView (args: GetMonthViewArgs): MonthView {
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 1);
    return super.getMonthView(args);
  }
}

@NgModule({
  declarations: [
    NotificationListComponent,
    AddEditNotificationComponent
  ],

  imports: [
    CommonModule,
    MatFormFieldModule,
    MaterialModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
    MatInputModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    NotificationListService,
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils
    },
    MatDatepickerModule
  ],

  entryComponents: [],

  exports: [MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSelectModule,
  MatRadioModule,
  MatGridListModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatCheckboxModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PendingUpdatesComponent } from './pending-updates/pending-updates.component';
import { RenewalsDueComponent } from './renewals-due/renewals-due.component';
import { RecentActivitiesComponent } from './recent-activities/recent-activities.component';
import { UserService } from '../users.service';
import {
  CMCalendarHeader,
  CMMatCalendar
} from './event-calendar/event-calendar.component';
import { PortalModule } from '@angular/cdk/portal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CMCalendarBody } from './event-calendar/calendar-body';
import { CMMonthView } from './event-calendar/month-view';
import { ContractExpiryScheduleComponent } from './contract-expiry-schedule/contract-expiry-schedule.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    PendingUpdatesComponent,
    RenewalsDueComponent,
    RecentActivitiesComponent,
    CMMatCalendar,
    CMCalendarBody,
    CMCalendarHeader,
    CMMonthView,
    ContractExpiryScheduleComponent
  ],
  entryComponents: [CMCalendarHeader],
  imports: [
    CommonModule,
    NgxDatatableModule,
    PortalModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    SharedModule,
    NgCircleProgressModule.forRoot({
      backgroundStroke: '#c0c0c0',
      radius: 25,
      space: -8,
      unitsColor: '#483500',
      outerStrokeWidth: 8,
      outerStrokeColor: '#81D152',
      outerStrokeLinecap: 'square',
      innerStrokeColor: '#f1f1f1',
      innerStrokeWidth: 8,
      titleColor: '#474747',
      titleFontSize: '15',
      subtitleColor: '#483500',
      showSubtitle: false,
      showBackground: false
    })
  ],
  providers: [UserService]
})
export class DashboardModule {}

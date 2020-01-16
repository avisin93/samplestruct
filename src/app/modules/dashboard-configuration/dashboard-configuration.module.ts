import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { DashboardConfigurationComponent } from './dashboard-configuration.component';
import { DashboardConfigurationRoutingModule } from './dashboard-configuration-routing.module';
import { DashboardConfigurationTabComponent } from './tab/tab.component';
import { DashboardConfigurationTabFieldsComponent } from './tab/fields/fields.component';
import { DashboardConfigurationDialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    DashboardConfigurationComponent,
    DashboardConfigurationTabComponent,
    DashboardConfigurationTabFieldsComponent,
    DashboardConfigurationDialogComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MaterialModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardConfigurationRoutingModule
  ],
  providers: [],
  entryComponents: [
    DashboardConfigurationDialogComponent
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardConfigurationModule { }

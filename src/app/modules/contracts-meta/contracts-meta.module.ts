import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';

import { ContractsMetaComponent } from './contracts-meta.component';
import { ContractsMetaRoutingModule } from './contracts-meta-routing.module';
import { ContractsMetaTabComponent } from './tab/tab.component';
import { ContractsMetaTabSubtabComponent } from './tab/subtab/subtab.component';
import { ContractsMetaMatSubtabFormComponent } from './tab/subtab/form/form.component';
import { ContractsMetaMatSubtabTableComponent } from './tab/subtab/table/table.component';
import { ContractMetaResolve } from './contracts-meta.resolve';
import { ContractsMetaSubtabTableAddPanelComponent } from './tab/subtab/table/add-panel/add-panel.component';
import { MomentUtcDateAdapter, MY_FORMATS } from '../moment-utc-date-adapter';
import { NewObjectDialogComponent } from './new-object-dialog/new-object-dialog.component';
import { SharedContractMetaModule } from '../shared/shared-contract-meta.module';

@NgModule({
  declarations: [
    ContractsMetaComponent,
    ContractsMetaTabComponent,
    ContractsMetaTabSubtabComponent,
    ContractsMetaMatSubtabFormComponent,
    ContractsMetaMatSubtabTableComponent,
    ContractsMetaSubtabTableAddPanelComponent
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
    SharedContractMetaModule,
    ContractsMetaRoutingModule
  ],
  providers: [
    ContractMetaResolve,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  entryComponents: [
    NewObjectDialogComponent
  ],
  exports: [MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContractsMetaModule { }

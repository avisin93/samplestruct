import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { AddContractMetaModelComponent } from './add-contract-meta-model.component';
import { AddContractMetaModelRoutingModule } from './add-contract-meta-model-routing.module';
import { OpenDialogComponent } from './open-dialog/open-dialog.component';
import { AddContractMetaModelTabComponent } from './tab/tab.component';
import { AddContactMetaModelFieldsComponent } from './tab/subtab/fields/fields.component';
import { AddContractMetaModelSubtabComponent } from './tab/subtab/subtab.component';
import { PreviewContractMetaModelComponent } from './preview/preview.component';
import { PreviewContractMetaModelViewComponent } from './preview/view/view.component';
import { PreviewContractMetaModelViewTabComponent } from './preview/view/tab/tab.component';
import { PreviewContractMetaModelViewTabSubtabComponent } from './preview/view/tab/subtab/subtab.component';
import { PreviewContractMetaModelViewTabSubtabTableComponent } from './preview/view/tab/subtab/table/table.component';
import { PreviewContractMetaModelViewTabSubtabFormComponent } from './preview/view/tab/subtab/form/form.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedContractMetaModule } from '../shared/shared-contract-meta.module';

@NgModule({
  declarations: [
    AddContractMetaModelComponent,
    AddContractMetaModelTabComponent,
    AddContractMetaModelSubtabComponent,
    AddContactMetaModelFieldsComponent,
    OpenDialogComponent,
    PreviewContractMetaModelComponent,
    PreviewContractMetaModelViewComponent,
    PreviewContractMetaModelViewTabComponent,
    PreviewContractMetaModelViewTabSubtabComponent,
    PreviewContractMetaModelViewTabSubtabTableComponent,
    PreviewContractMetaModelViewTabSubtabFormComponent
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
    AddContractMetaModelRoutingModule,
    DragDropModule
  ],
  providers: [],

  entryComponents: [
    OpenDialogComponent
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddContractMetaModelModule { }

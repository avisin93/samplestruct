// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

// Services
import { NgDataTablesModule } from './modules/ng-data-tables/ng-data-tables.module';
import { TextEditorModule } from './components/text-editor/text-editor.module';
import { ContractsMetaTabSubtabFormTextFieldComponent } from '../contracts-meta/tab/subtab/form/text-field/text-field.component';
import { ContractsMetaTabSubtabFormDropdownComponent } from '../contracts-meta/tab/subtab/form/dropdown/dropdown.component';
import { ContractsMetaTabSubtabFormInputLocationComponent } from '../contracts-meta/tab/subtab/form/input-location/input-location.component';
import { ContractsMetaTabSubtabFormDropdownCreateComponent } from '../contracts-meta/tab/subtab/form/dropdown-create/dropdown-create.component';
import { ContractsMetaTabSubtabFormCurrencySelectInputComponent } from '../contracts-meta/tab/subtab/form/currency-select-input/currency-select-input.component';
import { ContractsMetaTabSubtabFormDatepickerComponent } from '../contracts-meta/tab/subtab/form/datepicker/datepicker.component';
import { ContractsMetaTabSubtabFormPeriodSelectInputComponent } from '../contracts-meta/tab/subtab/form/period-select-input/period-select-input.component';
import { ContractsMetaTabSubtabFormTextareaComponent } from '../contracts-meta/tab/subtab/form/textarea/textarea.component';
import { NumericFieldComponent } from '../contracts-meta/tab/subtab/form/numeric-field/numeric-field.component';
import { ContractsMetaTabSubtabFormInputFileComponent } from '../contracts-meta/tab/subtab/form/input-file/input-file.component';
import { ContractsMetaTabSubtabFormParentChildInput } from '../contracts-meta/tab/subtab/form/parent-child-input/parent-child-input.component';
import { ChildInputComponent } from '../contracts-meta/tab/subtab/form/child-input/child-input.component';
import { NewObjectDialogComponent } from '../contracts-meta/new-object-dialog/new-object-dialog.component';
import { ContractsMetaTabSubtabFormrRadioGroupComponent } from '../contracts-meta/tab/subtab/form/radio-group/radio-group.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgDataTablesModule,
    TextEditorModule
  ],
  declarations: [
    ContractsMetaTabSubtabFormTextFieldComponent,
    ContractsMetaTabSubtabFormDropdownComponent,
    ContractsMetaTabSubtabFormInputFileComponent,
    ContractsMetaTabSubtabFormParentChildInput,
    ChildInputComponent,
    ContractsMetaTabSubtabFormInputLocationComponent,
    ContractsMetaTabSubtabFormDropdownCreateComponent,
    ContractsMetaTabSubtabFormCurrencySelectInputComponent,
    ContractsMetaTabSubtabFormDatepickerComponent,
    ContractsMetaTabSubtabFormPeriodSelectInputComponent,
    ContractsMetaTabSubtabFormTextareaComponent,
    NewObjectDialogComponent,
    NumericFieldComponent,
    ContractsMetaTabSubtabFormrRadioGroupComponent
  ],
  exports: [
    ContractsMetaTabSubtabFormTextFieldComponent,
    ContractsMetaTabSubtabFormDropdownComponent,
    ContractsMetaTabSubtabFormInputFileComponent,
    ContractsMetaTabSubtabFormParentChildInput,
    ChildInputComponent,
    ContractsMetaTabSubtabFormInputLocationComponent,
    ContractsMetaTabSubtabFormDropdownCreateComponent,
    ContractsMetaTabSubtabFormCurrencySelectInputComponent,
    ContractsMetaTabSubtabFormDatepickerComponent,
    ContractsMetaTabSubtabFormPeriodSelectInputComponent,
    ContractsMetaTabSubtabFormTextareaComponent,
    NewObjectDialogComponent,
    NumericFieldComponent,
    ContractsMetaTabSubtabFormrRadioGroupComponent
  ],
  entryComponents: [],
  providers: []
})
export class SharedContractMetaModule {}

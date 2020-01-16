import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { ContractsComponent } from './contracts.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermComponent } from './term/term.component';
import { FixedPeriodComponent } from './term/fixed-period/fixed-period.component';
import { FixedPeriodWithoutRenewalComponent } from './term/fixed-period-without-renewal/fixed-period-without-renewal.component';
import { OpenEndedContractsComponent } from './term/open-ended-contracts/open-ended-contracts.component';
import { CommercialsComponent } from './commercials/commercials.component';
import { GeneralTermsComponent } from './commercials/general-terms/general-terms.component';
import { ContactPersonComponent } from './contact-person/contact-person.component';
import { AddContactPersonComponent } from './contact-person/add-contact-person/add-contact-person.component';
import { DocumentComponent } from './document/document.component';
import { AddNewDocumentDialogComponent } from './document/add-new-document-dialog/add-new-document-dialog.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { TransactionRateStandardComponent } from './commercials/transaction-rate-standard/transaction-rate-standard.component';
import { TransactionRateVolumeComponent } from './commercials/transaction-rate-volume/transaction-rate-volume.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddTransactionRateStandardComponent } from './commercials/transaction-rate-standard/add-transaction-rate-standard/add-transaction-rate-standard.component';
import { ContractResolve } from './contracts.resolve';
import { DocumentService } from './document/document.service';
import { SharedModule } from '../shared/shared.module';
import { AddTransactionRateVolumeComponent } from './commercials/transaction-rate-volume/add-transaction-rate-volume/add-transaction-rate-volume.component';
import { TimeMaterialModelComponent } from './commercials/time-material-model/time-material-model.component';
import { AddTimeMaterialDialogComponent } from './commercials/time-material-model/add-time-material-dialog/add-time-material-dialog.component';
import { FixedFeeComponent } from './commercials/fixed-fee/fixed-fee.component';
import { AddFixedFeeComponent } from './commercials/fixed-fee/add-fixed-fee/add-fixed-fee.component';
import { MinimumBillingComponent } from './commercials/minimum-billing/minimum-billing.component';
import { AddMinimumBillingComponent } from './commercials/minimum-billing/add-minimum-billing/add-minimum-billing.component';
import { AdditionalReportingFieldsComponent } from './commercials/additional-reporting-fields/additional-reporting-fields.component';
import { OtherCommercialTermsComponent } from './other-commercial-terms/other-commercial-terms.component';
import { ColaComponent } from './other-commercial-terms/cola/cola.component';
import { IncentiveComponent } from './other-commercial-terms/incentive/incentive.component';
import { PenaltyComponent } from './other-commercial-terms/penalty/penalty.component';
import { EarlyPaymentDiscountComponent } from './other-commercial-terms/early-payment-discount/early-payment-discount.component';
import { LatePaymentFeeComponent } from './other-commercial-terms/late-payment-fee/late-payment-fee.component';
import { TerminationComponent } from './other-commercial-terms/termination/termination.component';
import { LimitationOfLiabillityComponent } from './other-commercial-terms/limitation-of-liabillity/limitation-of-liabillity.component';
import { SlaComponent } from './sla/sla.component';
import { TatComponent } from './sla/tat/tat.component';
import { QualityComponent } from './sla/quality/quality.component';
import { UptimeComponent } from './sla/uptime/uptime.component';
import { CreateNewObjectComponent } from './create-new-object-dialog/create-new-object.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    ContractsComponent,
    GeneralInformationComponent,
    TermComponent,
    FixedPeriodComponent,
    FixedPeriodWithoutRenewalComponent,
    OpenEndedContractsComponent,
    CommercialsComponent,
    GeneralTermsComponent,
    ContactPersonComponent,
    AddContactPersonComponent,
    DocumentComponent,
    AddNewDocumentDialogComponent,
    UploadDialogComponent,
    CreateNewObjectComponent,
    AddTransactionRateStandardComponent,
    TransactionRateStandardComponent,
    TransactionRateVolumeComponent,
    AddTransactionRateVolumeComponent,
    TimeMaterialModelComponent,
    AddTimeMaterialDialogComponent,
    FixedFeeComponent,
    AddFixedFeeComponent,
    MinimumBillingComponent,
    AddMinimumBillingComponent,
    AdditionalReportingFieldsComponent,
    OtherCommercialTermsComponent,
    ColaComponent,
    IncentiveComponent,
    PenaltyComponent,
    EarlyPaymentDiscountComponent,
    LatePaymentFeeComponent,
    TerminationComponent,
    LimitationOfLiabillityComponent,
    SlaComponent,
    TatComponent,
    QualityComponent,
    UptimeComponent
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
    LayoutModule,
    NgxFileDropModule
  ],
  providers: [
    DocumentService,
    ContractResolve
  ],

  entryComponents: [
    UploadDialogComponent,
    CreateNewObjectComponent,
    AddNewDocumentDialogComponent
  ],
  exports: [MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContractsModule { }

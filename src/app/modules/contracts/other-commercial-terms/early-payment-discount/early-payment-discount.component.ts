import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { dateValidator, endDateValidator, getErrorMessage, numberValidator } from 'src/app/modules/utilsValidation';
import { saveAs } from 'file-saver';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';

@Component({
  selector: 'cm-early-payment-discount',
  templateUrl: './early-payment-discount.component.html',
  styleUrls: ['./early-payment-discount.component.scss'],
  providers: [
    DatePipe
  ]
})
export class EarlyPaymentDiscountComponent implements OnInit {

  @Input() arrayEarlyPaymentDiscStatus: any[];
  @Input() matgroupCommercials: any;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  showDownload = false;
  objectToExport: JSON;
  minDateTo;
  maxDateFrom;

  formGroup: FormGroup;
  contractId: Text;
  constructor (private contractService: ContractService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private otherCommercialTermsService: OtherCommercialTermsService) { }

  ngOnInit () {

    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      inputClause: new FormControl(''),
      inputReferenceNo: new FormControl(''),
      inputRelatedReferenceNo: new FormControl(''),
      inputPercentage: new FormControl('',[numberValidator]),
      inputValue: new FormControl('',[numberValidator]),
      inputBillingCycle: new FormControl(''),
      inputDateFrom: new FormControl(''),
      inputDateTo: new FormControl(''),
      selectedStatus: new FormControl(''),
      alertContractOwner: new FormControl('')
    });

    this.formGroup.get('inputDateTo').setValidators([ dateValidator,
      endDateValidator(this.formGroup.get('inputDateFrom'))]);

    if (typeof this.contractService.contractData !== 'undefined'
    && this.contractService.contractData !== null && this.contractService.contractData.early_payment_discount !== undefined) {
      this.showDownload = true;
      this.contractId = this.contractService.contractData._id;
      this.formGroup.get('inputClause').setValue(this.contractService.contractData.early_payment_discount.clause);
      this.formGroup.get('inputReferenceNo').setValue(this.contractService.contractData.early_payment_discount.reference_no);
      this.formGroup.get('inputRelatedReferenceNo').setValue(this.contractService.contractData.early_payment_discount.related_reference_no);
      this.formGroup.get('inputPercentage').setValue(this.contractService.contractData.early_payment_discount.percentage);
      this.formGroup.get('inputValue').setValue(this.contractService.contractData.early_payment_discount.value);
      this.formGroup.get('inputBillingCycle').setValue(this.contractService.contractData.early_payment_discount.billing_cycle);
      this.formGroup.get('inputDateFrom').setValue(this.contractService.contractData.early_payment_discount.date_from);
      if (this.contractService.contractData.penalty_details && this.contractService.contractData.penalty_details.date_to) {
        this.maxDateFrom = moment(this.contractService.contractData.penalty_details.date_to).subtract(1, 'd');
      }
      this.formGroup.get('inputDateTo').setValue(this.contractService.contractData.early_payment_discount.date_to);
      if (this.contractService.contractData.penalty_details && this.contractService.contractData.penalty_details.date_from) {
        this.minDateTo = moment(this.contractService.contractData.penalty_details.date_from).add(1, 'd');
      }
      this.formGroup.get('selectedStatus').setValue(this.contractService.contractData.early_payment_discount.status ? this.contractService.contractData.early_payment_discount.status.code : '');
      this.formGroup.get('alertContractOwner').setValue(this.contractService.contractData.early_payment_discount.alert_contract_owner ? 'true' : 'false');
      this.objectToExport = this.contractService.contractData.early_payment_discount;
    }
    this.onChanges();
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  dateFromChanged (event: MatDatepickerInputEvent<Date>): void {
    this.minDateTo = moment(event.value).add(1, 'd');
  }

  dateToChanged (event: MatDatepickerInputEvent<Date>): void {
    this.maxDateFrom = moment(event.value).subtract(1, 'd');
  }

  generatePDF () {
    if (this.objectToExport) {
      let doc = new jsPDF();
      let start = 20;
      let step = 10;
      doc.setFontSize(24);

      doc.setFontSize(14);
      doc.text('CLAUSE: ' + (this.objectToExport['clause'] ? this.objectToExport['clause'].replace(/\n|\r/g, ' ') : ''), 30, start + step);
      step += 10;

      doc.text('REFERENCE NO: ' + this.objectToExport['reference_no'], 30, start + step);
      step += 10;

      doc.text('RELATED REFERENCE NO: ' + this.objectToExport['related_reference_no'], 30, start + step);
      step += 10;

      doc.text('PERCENTAGE: ' + this.objectToExport['percentage'] + '%', 30, start + step);
      step += 10;

      doc.text('VALUE: ' + this.objectToExport['value'], 30, start + step);
      step += 10;

      doc.text('BILLING CYCLE: ' + (this.objectToExport['billing_cycle'] ?
        this.datePipe.transform(this.objectToExport['billing_cycle'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('DATE FROM: ' + (this.objectToExport['date_from'] ?
        this.datePipe.transform(this.objectToExport['date_from'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('DATE TO: ' + (this.objectToExport['date_to'] ?
        this.datePipe.transform(this.objectToExport['date_to'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('STATUS: ' + (this.objectToExport['status'] ? this.objectToExport['status']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('ALERT CONTRACT OWNER: ' + (this.objectToExport['alert_contract_owner'] ? 'Yes' : 'No'), 30, start + step);
      step += 10;

      doc.save('EarlyPaymentDiscount.pdf');
    } else {
      this.toastr.error(
        'Operation failed',
        'There is not data to export'
      );
    }
  }

  generateCSV () {
    if (this.objectToExport) {
      const header = [
        'CLAUSE', 'REFERENCE NO', 'RELATED REFERENCE NO', 'PERCENTAGE', 'VALUE', 'BILLING CYCLE', 'DATE FROM',
        'DATE TO', 'STATUS', 'ALERT CONTRACT OWNER'
      ];

      const obj = {
        clause: this.objectToExport['clause'] ? this.objectToExport['clause'].replace(/\n|\r/g, ' ') : '',
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_reference_no'],
        percentage: this.objectToExport['percentage'],
        value: this.objectToExport['value'],
        invoice_date: this.objectToExport['billing_cycle'] ? this.datePipe.transform(this.objectToExport['billing_cycle'], 'MM/dd/yyyy') : 'N/A',
        date_from: this.objectToExport['date_from'] ? this.datePipe.transform(this.objectToExport['date_from'], 'MM/dd/yyyy') : 'N/A',
        date_to: this.objectToExport['date_to'] ? this.datePipe.transform(this.objectToExport['date_to'], 'MM/dd/yyyy') : 'N/A',
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        alert_contract_owner: this.objectToExport['alert_contract_owner'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'EarlyPaymentDiscount.csv');
    } else {
      this.toastr.error(
        'Operation failed',
        'There is not data to export'
      );
    }
  }

  validate (): boolean {
    let validate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).markAsTouched();
      if (this.formGroup.get(key).invalid) {
        validate = false;
      }
    });

    return validate;
  }

  getErrorMessage (field: FormControl, customMsg?: JSON): string {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }

  saveEarlyPayDisc () {

    if (!this.validate()) {
      return;
    }

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectData = {
      'type': 'OTHER_COMMERCIALS_TERMS',
      'data': {}
    };

    objectData.data = {
      early_payment_discount : {
        clause: this.formGroup.get('inputClause').value,
        reference_no: this.formGroup.get('inputReferenceNo').value,
        related_reference_no: this.formGroup.get('inputRelatedReferenceNo').value,
        percentage: this.formGroup.get('inputPercentage').value,
        value: this.formGroup.get('inputValue').value,
        billing_cycle: this.formGroup.get('inputBillingCycle').value,
        date_from: this.formGroup.get('inputDateFrom').value,
        date_to: this.formGroup.get('inputDateTo').value,
        status_code: this.formGroup.get('selectedStatus').value,
        alert_contract_owner: this.formGroup.get('alertContractOwner').value === 'true' ? true : false
      }
    };

    if (this.formGroup.get('alertContractOwner').value === 'true') {
      let notificationObject: any = {
        data: {
          title: 'Early Payment Discount Terms',
          description: this.formGroup.get('inputClause').value,
          type: { // MOCKED
            name : 'Early Payment Discount Type',
            valid_from : null,
            valid_to : null,
            code : 'EARLYPAYDISCTYPE'
          },
          send_notification: true,
          business_partner: this.contractService.contractData.business_partner,
          linked_contract: {
            contract_id: this.contractService.contractId,
            title: this.contractService.contractData.contract_title,
            category: this.contractService.contractData.category,
            end_date: this.contractService.contractData.end_date
          },
          reminder: {
            reminder_status: this.formGroup.get('selectedStatus').value,
            frequency_type: 'THREE_DAYS',
            start_date: this.formGroup.get('inputDateFrom').value

          }
        }
      };
      this.otherCommercialTermsService.saveNotification(notificationObject).subscribe((response: any) => {
        console.info('Notification created!');
      }, (error: any) => {
        console.log(error);
      });
    } else {
      this.otherCommercialTermsService.deleteNotificationByType(this.contractService.contractId, 'EARLYPAYDISCTYPE').subscribe((response: any) => {
        console.info('Notification deleted!');
      }, (error: any) => {
        console.log(error);
      });
    }

    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'Early Payment Discount successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['early_payment_discount'],
          status: this.arrayEarlyPaymentDiscStatus.find(s => { return s.code === objectData.data['early_payment_discount']['status_code']; })
        };
        this.matgroupCommercials.selectedIndex += 1;
      },
      () => {
        this.toastr.error(
          'Operation failed',
          'Something went wrong!'
        );
      }
    );
    this.isDirty.emit(false);
  }

  cancel () {
    this.formGroup.reset();
    this.ngOnInit();
  }
}

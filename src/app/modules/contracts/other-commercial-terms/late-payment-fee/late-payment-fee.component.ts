import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getErrorMessage, numberValidator, digitWithSpacesValidator } from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { MatSelect } from '@angular/material';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';
import { NotificationListService } from 'src/app/modules/notification/notification-list.service';
import { HttpParams } from '@angular/common/http';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';

@Component({
  selector: 'cm-late-payment-fee',
  templateUrl: './late-payment-fee.component.html',
  styleUrls: ['./late-payment-fee.component.scss'],
  providers: [
    DatePipe
  ]
})
export class LatePaymentFeeComponent implements OnInit {
  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;
  @Input() matgroupCommercials;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  formGroup: FormGroup;

  @Input() arrayTimePeriods = [];
  arrayCurrencies = [];
  arrayStatuses = [];

  showDownload = false;
  objectToExport: JSON;

  notificationId: string;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      clause: new FormControl(''),
      referenceNo: new FormControl(''),
      relatedReferenceNo: new FormControl(''),
      invoiceDate: new FormControl(''),
      noticePeriod: new FormControl('', [digitWithSpacesValidator]),
      noticePeriodType: new FormControl(''),
      currency: new FormControl(''),
      penaltyValue: new FormControl({value: '',
        disabled: !(this.formGroup && this.formGroup.controls &&
                    this.formGroup.controls.currency.value &&
                    this.formGroup.controls.currency.value !== '')},
        [numberValidator]),
      status: new FormControl(''),
      alert: new FormControl('NO')
    });
  }

  constructor (
    private contractService: ContractService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private otherCommercialTermsService: OtherCommercialTermsService,
    private notificationListService: NotificationListService
  ) {
    this.initializeForm();
  }

  ngOnInit () {

    if ((!this.contractService.contractData || !this.contractService.contractData.late_payment_fee_details)) {
      this.formGroup.get('currency').setValue(this.contractService.genInfoCurrency ? this.contractService.genInfoCurrency.code : '');
      this.selectedCurrency();

      this.contractService.getGenInfoCurrencySubject().subscribe(value => {
        if (!this.objectToExport || !this.objectToExport['currency']) {
          this.formGroup.get('currency').setValue(value ? value['code'] : '');
          this.selectedCurrency();
        }
      });
    }

    this.contractService.getAllCurrencies().subscribe(
      (res: any) => {
        this.arrayCurrencies = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of currencies'
        );
      }
    );

    this.contractService.getAllLatePayFeeStatuses().subscribe(
      (res: any) => {
        this.arrayStatuses = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of statuses'
        );
      }
    );

    if (this.contractService.contractData && this.contractService.contractData.late_payment_fee_details) {
      this.showDownload = true;
      this.formGroup.get('clause').setValue(this.contractService.contractData.late_payment_fee_details.clause);
      this.formGroup.get('referenceNo').setValue(this.contractService.contractData.late_payment_fee_details.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(this.contractService.contractData.late_payment_fee_details.related_ref_no);
      this.formGroup.get('invoiceDate').setValue(this.contractService.contractData.late_payment_fee_details.invoice_date);
      this.formGroup.get('noticePeriod').setValue(this.contractService.contractData.late_payment_fee_details.notice_period);
      this.formGroup.get('noticePeriodType').setValue(this.contractService.contractData.late_payment_fee_details.notice_period_type ?
        this.contractService.contractData.late_payment_fee_details.notice_period_type.code : '');
      if (this.contractService.contractData.late_payment_fee_details.currency) {
        this.formGroup.get('currency').setValue(this.contractService.contractData.late_payment_fee_details.currency.code);
        this.selectedCurrency();
      }
      this.formGroup.get('penaltyValue').setValue(this.contractService.contractData.late_payment_fee_details.penalty_value);
      this.formGroup.get('status').setValue(this.contractService.contractData.late_payment_fee_details.status ?
        this.contractService.contractData.late_payment_fee_details.status.code : '');
      this.formGroup.get('alert').setValue(this.contractService.contractData.late_payment_fee_details.alert ? 'YES' : 'NO');
      this.objectToExport = this.contractService.contractData.late_payment_fee_details;

      let queryParams = new HttpParams();
      queryParams = queryParams.set('contractId', this.contractService.contractId);
      queryParams = queryParams.set('typeCode', 'LATEPAYMENTFEETYPE');

      this.notificationListService.searchNotifications(queryParams).then((res: any) => {
        if (res.docs[0]) {
          this.notificationId = res.docs[0]._id;
        }
      },() => {
        this.toastr.error('Cannot catch list of time frequencies');
      });
    }
    this.onChanges();
  }

  onChanges () {
    this.formGroup.valueChanges.subscribe(val => {
      this.isDirty.emit(true);
    });
  }

  focusSelect () {
    if (!(this.formGroup.get('currency').value &&
      this.formGroup.get('currency').value !== '')) {
      this.currencyDropDown.toggle();
    }
  }

  selectedCurrency () {
    if (this.formGroup.get('currency').value &&
        this.formGroup.get('currency').value !== '') {
      this.formGroup.get('penaltyValue').enable();
    }
  }

  cancel () {
    this.formGroup.reset();
    this.ngOnInit();
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

  save () {

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
      late_payment_fee_details: {
        clause: this.formGroup.get('clause').value,
        reference_no: this.formGroup.get('referenceNo').value,
        related_ref_no: this.formGroup.get('relatedReferenceNo').value,
        invoice_date: this.formGroup.get('invoiceDate').value,
        notice_period: this.formGroup.get('noticePeriod').value,
        notice_period_type_code: this.formGroup.get('noticePeriodType').value,
        currency_code: this.formGroup.get('currency').value,
        penalty_value: this.formGroup.get('penaltyValue').value,
        status_code: this.formGroup.get('status').value,
        alert: this.formGroup.get('alert').value !== '' ? (this.formGroup.get('alert').value === 'YES' ? true : false) : false
      }
    };

    if (this.formGroup.get('alert').value === 'YES') {
      let notificationObject: any = {
        data: {
          title: 'Late Payment Fee Terms',
          description: this.formGroup.get('clause').value,
          date: this.formGroup.get('invoiceDate').value,
          type: { // MOCKED
            name : 'Late Payment Fee Type',
            valid_from : null,
            valid_to : null,
            code : 'LATEPAYMENTFEETYPE'
          },
          send_notification: true,
          business_partner: this.contractService.contractData.business_partner,
          linked_contract: {
            contract_id: this.contractService.contractId,
            title: this.contractService.contractData.contract_title,
            category: this.contractService.contractData.category,
            end_date: this.contractService.contractData.end_date,
            notice_period: this.formGroup.get('noticePeriod').value,
            notice_period_type: this.formGroup.get('noticePeriodType').value
          },
          reminder: {
            reminder_status: 'ACTIVE',
            end_date: this.contractService.contractData.term.end_date,
            to_users: this.contractService.contractData.contact_persons
          }
        }
      };
      if (this.notificationId) {
        this.otherCommercialTermsService.updateNotification(notificationObject,this.notificationId).subscribe((response: any) => {
          console.info('Notification updated!');
        }, (error: any) => {
          console.log(error);
        });
      } else {
        this.otherCommercialTermsService.saveNotification(notificationObject).subscribe((response: any) => {
          console.info('Notification created!');
        }, (error: any) => {
          console.log(error);
        });
      }
    } else {
      this.otherCommercialTermsService.deleteNotificationByType(this.contractService.contractId, 'LATEPAYMENTFEETYPE').subscribe((response: any) => {
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
          'Late Payment Fee successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['late_payment_fee_details'],
          notice_period_type: this.arrayTimePeriods.find(tp => { return tp.code === objectData.data['late_payment_fee_details']['notice_period_type_code']; }),
          currency: this.arrayCurrencies.find(c => { return c.code === objectData.data['late_payment_fee_details']['currency_code']; }),
          status: this.arrayStatuses.find(s => { return s.code === objectData.data['late_payment_fee_details']['status_code']; })
        };
        this.matgroupCommercials.selectedIndex += 1;
      },
      () => {
        this.toastr.error(
          'Operation failed',
          'Something went wrong'
        );
      }
    );
    this.isDirty.emit(false);
  }

  generatePDF () {
    if (this.objectToExport) {
      let doc = new jsPDF();
      let start = 20;
      let step = 10;
      doc.setFontSize(24);

      doc.setFontSize(14);
      doc.text('CLAUSE: ' + this.objectToExport['clause'], 30, start + step);
      step += 10;

      doc.text('REFERENCE NO: ' + this.objectToExport['reference_no'], 30, start + step);
      step += 10;

      doc.text('RELATED REFERENCE NO: ' + this.objectToExport['related_ref_no'], 30, start + step);
      step += 10;

      doc.text('INVOICE DATE: ' + (this.objectToExport['invoice_date'] ?
        this.datePipe.transform(this.objectToExport['invoice_date'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('NOTICE PERIOD: ' + this.objectToExport['notice_period']
        + ' ' + (this.objectToExport['notice_period_type'] ? this.objectToExport['notice_period_type']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('PENALTY VALUE: '
        + (this.objectToExport['currency'] ? this.objectToExport['currency']['symbol'] : '') + this.objectToExport['penalty_value'], 30, start + step);
      step += 10;

      doc.text('STATUS: ' + (this.objectToExport['status'] ? this.objectToExport['status']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('ALERT: ' + (this.objectToExport['alert'] ? 'YES' : 'NO'), 30, start + step);
      step += 10;

      doc.save('LatePaymentFee.pdf');
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
        'CLAUSE', 'REFERENCE NO', 'RELATED REFERENCE NO',
        'INVOICE DATE', 'NOTICE PERIOD', 'NOTICE PERIOD TYPE',
        'PENALTY VALUE', 'STATUS', 'ALERT'
      ];

      const obj = {
        clause: this.objectToExport['clause'],
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_ref_no'],
        invoice_date: this.objectToExport['invoice_date'] ? this.datePipe.transform(this.objectToExport['invoice_date'], 'MM/dd/yyyy') : 'N/A',
        notice_period: this.objectToExport['notice_period'],
        notice_period_type: this.objectToExport['notice_period_type'] ? this.objectToExport['notice_period_type']['name'] : '',
        penalty_value: this.objectToExport['currency']['symbol'] + ' ' + this.objectToExport['penalty_value'],
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        alert: this.objectToExport['alert'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob(['\ufeff' + csvArray], { type: 'text/csv' });
      saveAs(blob, 'LatePaymentFee.csv');
    } else {
      this.toastr.error(
        'Operation failed',
        'There is not data to export'
      );
    }
  }

  getErrorMessage (field: FormControl, customMsg?: JSON) {
    if (field.touched) {
      return getErrorMessage(field, customMsg);
    }
  }
}

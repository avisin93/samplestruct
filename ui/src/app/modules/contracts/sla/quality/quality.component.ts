import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { numberValidator, getErrorMessage } from 'src/app/modules/utilsValidation';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../contracts.service';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cm-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss'],
  providers: [
    DatePipe
  ]
})
export class QualityComponent implements OnInit {

  @Input() matgroupSla;
  @Input() arrayCurrencies: any[];
  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;

  arrayStatuses = [];

  objectToExport: JSON;
  showDownload = false;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      clause: new FormControl(''),
      referenceNo: new FormControl(''),
      relatedReferenceNo: new FormControl(''),
      status: new FormControl(''),
      preShipment: new FormControl('',[Validators.pattern('^[0-9]+%?$')]),
      cal: new FormControl('',[Validators.pattern('^[0-9]+%?$')]),
      dateReported: new FormControl(''),
      cqr: new FormControl('',[Validators.pattern('^[0-9]+%?$')]),
      type: new FormControl(''),
      currency: new FormControl(''),
      performancePay: new FormControl({value: '',
        disabled: !(this.formGroup && this.formGroup.controls &&
                    this.formGroup.controls.currency.value &&
                    this.formGroup.controls.currency.value !== '')},
        [numberValidator]),
      alert: new FormControl('NO')
    });
  }

  constructor (
    private contractService: ContractService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    if ((!this.contractService.contractData || !this.contractService.contractData.quality_details)) {
      this.formGroup.get('currency').setValue(this.contractService.genInfoCurrency ? this.contractService.genInfoCurrency.code : '');
      this.selectedCurrency();

      this.contractService.getGenInfoCurrencySubject().subscribe(value => {
        if (!this.objectToExport || !this.objectToExport['currency']) {
          this.formGroup.get('currency').setValue(value ? value['code'] : '');
          this.selectedCurrency();
        }
      });
    }

    this.contractService.getAllQualityStatuses().subscribe(
      (res: any) => {
        this.arrayStatuses = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of statuses'
        );
      }
    );

    if (this.contractService.contractData && this.contractService.contractData.quality_details) {
      this.showDownload = true;
      this.formGroup.get('clause').setValue(this.contractService.contractData.quality_details.clause);
      this.formGroup.get('referenceNo').setValue(this.contractService.contractData.quality_details.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(this.contractService.contractData.quality_details.related_ref_no);
      this.formGroup.get('status').setValue(this.contractService.contractData.quality_details.status ?
        this.contractService.contractData.quality_details.status.code : '');
      this.formGroup.get('preShipment').setValue(
        (this.contractService.contractData.quality_details.pre_shipment && this.contractService.contractData.quality_details.pre_shipment !== '' ?
        (this.contractService.contractData.quality_details.pre_shipment + '%') : ''));
      this.formGroup.get('cal').setValue((this.contractService.contractData.quality_details.cal && this.contractService.contractData.quality_details.cal !== '' ?
        (this.contractService.contractData.quality_details.cal + '%') : ''));
      this.formGroup.get('dateReported').setValue(this.contractService.contractData.quality_details.date_reported);
      this.formGroup.get('cqr').setValue(
        (this.contractService.contractData.quality_details.cqr && this.contractService.contractData.quality_details.cqr !== '' ?
        (this.contractService.contractData.quality_details.cqr + '%') : ''));
      this.formGroup.get('type').setValue(this.contractService.contractData.quality_details.quality_type);
      if (this.contractService.contractData.quality_details.currency) {
        this.formGroup.get('currency').setValue(this.contractService.contractData.quality_details.currency.code);
        this.selectedCurrency();
      }
      this.formGroup.get('performancePay').setValue(this.contractService.contractData.quality_details.performance_pay);
      this.formGroup.get('alert').setValue(this.contractService.contractData.quality_details.alert ? 'YES' : 'NO');
      this.objectToExport = this.contractService.contractData.quality_details;
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
      this.formGroup.get('performancePay').enable();
    }
  }

  cancel () {
    this.formGroup.reset();
    this.ngOnInit();
  }

  save () {

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectData = {
      'type': 'SLA',
      'data': {}
    };

    objectData.data = {
      quality_details: {
        clause: this.formGroup.get('clause').value,
        reference_no: this.formGroup.get('referenceNo').value,
        related_ref_no: this.formGroup.get('relatedReferenceNo').value,
        status_code: this.formGroup.get('status').value,
        pre_shipment: this.formGroup.get('preShipment').value.toString().endsWith('%') ? this.formGroup.get('preShipment').value.slice(0, -1) : this.formGroup.get('preShipment').value,
        cal: this.formGroup.get('cal').value.toString().endsWith('%') ? this.formGroup.get('cal').value.slice(0, -1) : this.formGroup.get('cal').value,
        date_reported: this.formGroup.get('dateReported').value,
        cqr: this.formGroup.get('cqr').value.toString().endsWith('%') ? this.formGroup.get('cqr').value.slice(0, -1) : this.formGroup.get('cqr').value,
        quality_type: this.formGroup.get('type').value,
        currency_code: this.formGroup.get('currency').value,
        performance_pay: this.formGroup.get('performancePay').value,
        alert: this.formGroup.get('alert').value !== '' ? (this.formGroup.get('alert').value === 'YES' ? true : false) : false
      }
    };

    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'Quality successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['quality_details'],
          currency: this.arrayCurrencies.find(c => { return c.code === objectData.data['quality_details']['currency_code']; }),
          status: this.arrayStatuses.find(s => { return s.code === objectData.data['quality_details']['status_code']; })
        };
        this.matgroupSla.selectedIndex += 1;
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

      doc.text('STATUS: ' + (this.objectToExport['status'] ? this.objectToExport['status']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('PRE SHIPMENT: ' + this.objectToExport['pre_shipment'] + '%', 30, start + step);
      step += 10;

      doc.text('CAL: ' + this.objectToExport['cal'] + '%', 30, start + step);
      step += 10;

      doc.text('DATE REPORTED: ' + (this.objectToExport['date_reported'] ?
        this.datePipe.transform(this.objectToExport['date_reported'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('CQR: ' + this.objectToExport['cqr'] + '%', 30, start + step);
      step += 10;

      doc.text('TYPE: ' + this.objectToExport['quality_type'], 30, start + step);
      step += 10;

      doc.text('PERFORMANCE PAY: '
        + (this.objectToExport['currency'] ? this.objectToExport['currency']['symbol'] : '') + this.objectToExport['performance_pay'], 30, start + step);
      step += 10;

      doc.text('ALERT: ' + this.objectToExport['alert'], 30, start + step);
      step += 10;

      doc.save('QUALITY.pdf');
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
        'CLAUSE', 'REFERENCE NO', 'RELATED REFERENCE NO', 'STATUS', 'PRE SHIPMENT',
        'CAL', 'DATE REPORTED', 'CQR', 'TYPE', 'PERFORMANCE PAY', 'ALERT'
      ];

      const obj = {
        clause: this.objectToExport['clause'],
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_ref_no'],
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        pre_shipment: this.objectToExport['pre_shipment'],
        cal: this.objectToExport['cal'],
        date_reported: this.objectToExport['date_reported'] ? this.datePipe.transform(this.objectToExport['date_reported'], 'MM/dd/yyyy') : 'N/A',
        cqr: this.objectToExport['cqr'],
        quality_type: this.objectToExport['quality_type'],
        performance_pay: this.objectToExport['currency']['symbol'] + ' ' + this.objectToExport['performance_pay'],
        alert: this.objectToExport['alert'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob(['\ufeff' + csvArray], { type: 'text/csv' });
      saveAs(blob, 'QUALITY.csv');
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

import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../contracts.service';
import { numberValidator, getErrorMessage } from 'src/app/modules/utilsValidation';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

@Component({
  selector: 'cm-tat',
  templateUrl: './tat.component.html',
  styleUrls: ['./tat.component.scss']
})
export class TatComponent implements OnInit {

  @Input() matgroupSla;
  @Input() arrayCurrencies: any[];
  @ViewChild('currencyDropDown') currencyDropDown: MatSelect;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;

  arrayTypes = [];
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
      currency: new FormControl(''),
      performancePay: new FormControl({value: '',
        disabled: !(this.formGroup && this.formGroup.controls &&
                    this.formGroup.controls.currency.value &&
                    this.formGroup.controls.currency.value !== '')},
        [numberValidator]),
      type: new FormControl(''),
      hours: new FormControl('',[numberValidator]),
      alert: new FormControl('NO')
    });
  }

  constructor (
    private contractService: ContractService,
    private toastr: ToastrService
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    if ((!this.contractService.contractData || !this.contractService.contractData.tat_details)) {
      this.formGroup.get('currency').setValue(this.contractService.genInfoCurrency ? this.contractService.genInfoCurrency.code : '');
      this.selectedCurrency();

      this.contractService.getGenInfoCurrencySubject().subscribe(value => {
        if (!this.objectToExport || !this.objectToExport['currency']) {
          this.formGroup.get('currency').setValue(value ? value['code'] : '');
          this.selectedCurrency();
        }
      });
    }

    this.contractService.getAllTatTypes().subscribe(
      (res: any) => {
        this.arrayTypes = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of types'
        );
      }
    );

    this.contractService.getAllTatStatuses().subscribe(
      (res: any) => {
        this.arrayStatuses = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of statuses'
        );
      }
    );

    if (this.contractService.contractData && this.contractService.contractData.tat_details) {
      this.showDownload = true;
      this.formGroup.get('clause').setValue(this.contractService.contractData.tat_details.clause);
      this.formGroup.get('referenceNo').setValue(this.contractService.contractData.tat_details.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(this.contractService.contractData.tat_details.related_ref_no);
      this.formGroup.get('status').setValue(this.contractService.contractData.tat_details.status ?
        this.contractService.contractData.tat_details.status.code : '');
      if (this.contractService.contractData.tat_details.currency) {
        this.formGroup.get('currency').setValue(this.contractService.contractData.tat_details.currency.code);
        this.selectedCurrency();
      }
      this.formGroup.get('performancePay').setValue(this.contractService.contractData.tat_details.performance_pay);
      this.formGroup.get('type').setValue(this.contractService.contractData.tat_details.tat_type ?
        this.contractService.contractData.tat_details.tat_type.code : '');
      this.formGroup.get('hours').setValue(this.contractService.contractData.tat_details.hours);
      this.formGroup.get('alert').setValue(this.contractService.contractData.tat_details.alert ? 'YES' : 'NO');
      this.objectToExport = this.contractService.contractData.tat_details;
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
      tat_details: {
        clause: this.formGroup.get('clause').value,
        reference_no: this.formGroup.get('referenceNo').value,
        related_ref_no: this.formGroup.get('relatedReferenceNo').value,
        status_code: this.formGroup.get('status').value,
        currency_code: this.formGroup.get('currency').value,
        performance_pay: this.formGroup.get('performancePay').value,
        tat_type_code: this.formGroup.get('type').value,
        hours: this.formGroup.get('hours').value,
        alert: this.formGroup.get('alert').value !== '' ? (this.formGroup.get('alert').value === 'YES' ? true : false) : false
      }
    };

    this.contractService.updateContract(objectData, urlParams).subscribe(
      (response: any) => {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success(
          'Operation Complete',
          'TAT successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['tat_details'],
          tat_type: this.arrayTypes.find(t => { return t.code === objectData.data['tat_details']['tat_type_code']; }),
          currency: this.arrayCurrencies.find(c => { return c.code === objectData.data['tat_details']['currency_code']; }),
          status: this.arrayStatuses.find(s => { return s.code === objectData.data['tat_details']['status_code']; })
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

      doc.text('PERFORMANCE PAY: '
        + (this.objectToExport['currency'] ? this.objectToExport['currency']['symbol'] : '') + this.objectToExport['performance_pay'], 30, start + step);
      step += 10;

      doc.text('TYPE: ' + (this.objectToExport['tat_type'] ? this.objectToExport['tat_type']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('HOURS: ' + this.objectToExport['hours'], 30, start + step);
      step += 10;

      doc.text('ALERT: ' + this.objectToExport['alert'], 30, start + step);
      step += 10;

      doc.save('TAT.pdf');
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
        'STATUS', 'PERFORMANCE PAY', 'TYPE', 'HOURS', 'ALERT'
      ];

      const obj = {
        clause: this.objectToExport['clause'],
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_ref_no'],
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        performance_pay: this.objectToExport['currency']['symbol'] + ' ' + this.objectToExport['performance_pay'],
        tat_type: this.objectToExport['tat_type'] ? this.objectToExport['tat_type']['name'] : '',
        hours: this.objectToExport['hours'],
        alert: this.objectToExport['alert'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob(['\ufeff' + csvArray], { type: 'text/csv' });
      saveAs(blob, 'TAT.csv');
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

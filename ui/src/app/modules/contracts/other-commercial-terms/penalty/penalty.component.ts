import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getErrorMessage, numberValidator } from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';

@Component({
  selector: 'cm-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss'],
  providers: [
    DatePipe
  ]
})
export class PenaltyComponent implements OnInit {
  @Input() matgroupCommercials;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  formGroup: FormGroup;
  minDateTo;
  maxDateFrom;

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
      percentage: new FormControl('',[numberValidator]),
      type: new FormControl(''),
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      status: new FormControl(''),
      alert: new FormControl('NO')
    });
  }

  constructor (
    private contractService: ContractService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private otherCommercialTermsService: OtherCommercialTermsService
    ) {
    this.initializeForm();
  }

  ngOnInit () {

    this.contractService.getAllPenaltyTypes().subscribe(
      (res: any) => {
        this.arrayTypes = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of types'
        );
      }
    );

    this.contractService.getAllPenaltyStatuses().subscribe(
      (res: any) => {
        this.arrayStatuses = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of statuses'
        );
      }
    );

    if (this.contractService.contractData && this.contractService.contractData.penalty_details) {
      this.showDownload = true;
      this.formGroup.get('clause').setValue(this.contractService.contractData.penalty_details.clause);
      this.formGroup.get('referenceNo').setValue(this.contractService.contractData.penalty_details.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(this.contractService.contractData.penalty_details.related_ref_no);
      this.formGroup.get('percentage').setValue(this.contractService.contractData.penalty_details.percentage);
      this.formGroup.get('type').setValue(this.contractService.contractData.penalty_details.penalty_type ?
        this.contractService.contractData.penalty_details.penalty_type.code : '');
      this.formGroup.get('dateFrom').setValue(this.contractService.contractData.penalty_details.date_from);
      if (this.contractService.contractData.penalty_details.date_to) {
        this.maxDateFrom = moment(this.contractService.contractData.penalty_details.date_to).subtract(1, 'd');
      }
      this.formGroup.get('dateTo').setValue(this.contractService.contractData.penalty_details.date_to);
      if (this.contractService.contractData.penalty_details.date_from) {
        this.minDateTo = moment(this.contractService.contractData.penalty_details.date_from).add(1, 'd');
      }
      this.formGroup.get('status').setValue(this.contractService.contractData.penalty_details.status ?
        this.contractService.contractData.penalty_details.status.code : '');
      this.formGroup.get('alert').setValue(this.contractService.contractData.penalty_details.alert ? 'YES' : 'NO');
      this.objectToExport = this.contractService.contractData.penalty_details;
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

  cancel () {
    this.formGroup.reset();
    this.ngOnInit();
  }

  save () {

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };

    const objectData = {
      'type': 'OTHER_COMMERCIALS_TERMS',
      'data': {}
    };

    objectData.data = {
      penalty_details: {
        clause: this.formGroup.get('clause').value,
        reference_no: this.formGroup.get('referenceNo').value,
        related_ref_no: this.formGroup.get('relatedReferenceNo').value,
        percentage: this.formGroup.get('percentage').value,
        penalty_type_code: this.formGroup.get('type').value,
        date_from: this.formGroup.get('dateFrom').value,
        date_to: this.formGroup.get('dateTo').value,
        status_code: this.formGroup.get('status').value,
        alert: this.formGroup.get('alert').value !== '' ? (this.formGroup.get('alert').value === 'YES' ? true : false) : false
      }
    };

    if (this.formGroup.get('alert').value === 'YES') {
      let notificationObject: any = {
        data: {
          title: 'Penalty Terms',
          description: this.formGroup.get('clause').value,
          type: { // MOCKED
            name : 'Penalty Type',
            valid_from : null,
            valid_to : null,
            code : 'PENALTYTYPE'
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
            reminder_status: this.formGroup.get('status').value,
            frequency_type: 'THREE_DAYS',
            start_date: this.formGroup.get('dateFrom').value

          }
        }
      };
      this.otherCommercialTermsService.saveNotification(notificationObject).subscribe((response: any) => {
        console.info('Notification created!');
      }, (error: any) => {
        console.log(error);
      });
    } else {
      this.otherCommercialTermsService.deleteNotificationByType(this.contractService.contractId,'PENALTYTYPE').subscribe((response: any) => {
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
          'Penalty successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['penalty_details'],
          penalty_type: this.arrayTypes.find(t => { return t.code === objectData.data['penalty_details']['penalty_type_code']; }),
          status: this.arrayStatuses.find(s => { return s.code === objectData.data['penalty_details']['status_code']; })
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

      doc.text('PERCENTAGE: ' + this.objectToExport['percentage'] + '%', 30, start + step);
      step += 10;

      doc.text('TYPE: ' + (this.objectToExport['penalty_type'] ? this.objectToExport['penalty_type']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('DATE FROM: ' + (this.objectToExport['date_from'] ?
        this.datePipe.transform(this.objectToExport['date_from'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('DATE TO: ' + (this.objectToExport['date_to'] ?
        this.datePipe.transform(this.objectToExport['date_to'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('STATUS: ' + (this.objectToExport['status'] ? this.objectToExport['status']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('ALERT: ' + this.objectToExport['alert'], 30, start + step);
      step += 10;

      doc.save('Penalty.pdf');
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
        'PERCENTAGE', 'TYPE', 'DATE FROM', 'DATE TO', 'STATUS', 'ALERT'
      ];

      const obj = {
        clause: this.objectToExport['clause'],
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_ref_no'],
        percentage: this.objectToExport['percentage'],
        penalty_type: this.objectToExport['penalty_type'] ? this.objectToExport['penalty_type']['name'] : '',
        date_from: this.objectToExport['date_from'] ? this.datePipe.transform(this.objectToExport['date_from'], 'MM/dd/yyyy') : 'N/A',
        date_to: this.objectToExport['date_to'] ? this.datePipe.transform(this.objectToExport['date_to'], 'MM/dd/yyyy') : 'N/A',
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        alert: this.objectToExport['alert'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'Penalty.csv');
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

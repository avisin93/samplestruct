import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getErrorMessage, numberValidator, digitWithSpacesValidator } from 'src/app/modules/utilsValidation';
import { ContractService } from '../../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { OtherCommercialTermsService } from '../other-commercial-terms.service';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/modules/excel/excel.service';
import { saveAs } from 'file-saver';
import { HttpParams } from '@angular/common/http';
import { NotificationListService } from '../../../notification/notification-list.service';
import { StorageService } from 'src/app/modules/shared/providers/storage.service';

@Component({
  selector: 'cm-cola',
  templateUrl: './cola.component.html',
  styleUrls: ['./cola.component.scss'],
  providers: [
    DatePipe
  ]
})
export class ColaComponent implements OnInit {

  @Input() matgroupCommercials;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();
  formGroup: FormGroup;

  @Input() arrayTimePeriods = [];
  arrayRevisionFrequencies = [];
  arrayStatuses = [];

  objectToExport: JSON;
  showDownload = false;

  notificationId: string;

  initializeForm () {
    if (this.formGroup) {
      this.formGroup.reset();
    }

    this.formGroup = new FormGroup({
      clause: new FormControl(''),
      type: new FormControl(''),
      indexType: new FormControl(''),
      applicableFrom: new FormControl(''),
      revisionFrequency: new FormControl(''),
      noticePeriod: new FormControl('', [digitWithSpacesValidator]),
      noticePeriodType: new FormControl(''),
      percentage: new FormControl('',[numberValidator]),
      status: new FormControl(''),
      referenceNo: new FormControl(''),
      relatedReferenceNo: new FormControl(''),
      reminder: new FormControl('')
    });
  }

  constructor (
    private otherCommercialTermsService: OtherCommercialTermsService,
    private contractService: ContractService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private notificationListService: NotificationListService
  ) {
    this.initializeForm();
  }

  ngOnInit () {
    this.contractService.getAllTimeFrequencies().subscribe(
      (res: any) => {
        this.arrayRevisionFrequencies = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of time frequencies'
        );
      }
    );

    this.contractService.getAllColaStatus().subscribe(
      (res: any) => {
        this.arrayStatuses = res;
      },
      () => {
        this.toastr.error(
          'Cannot catch list of statuses'
        );
      }
    );

    if (this.contractService.contractData && this.contractService.contractData.cola_details) {
      this.showDownload = true;
      this.formGroup.get('clause').setValue(this.contractService.contractData.cola_details.clause);
      this.formGroup.get('type').setValue(this.contractService.contractData.cola_details.cola_type);
      this.formGroup.get('indexType').setValue(this.contractService.contractData.cola_details.index_type);
      this.formGroup.get('applicableFrom').setValue(this.contractService.contractData.cola_details.applicable_from);
      this.formGroup.get('revisionFrequency').setValue(this.contractService.contractData.cola_details.revision_frequency ?
        this.contractService.contractData.cola_details.revision_frequency.code : '');
      this.formGroup.get('noticePeriod').setValue(this.contractService.contractData.cola_details.notice_period);
      this.formGroup.get('noticePeriodType').setValue(this.contractService.contractData.cola_details.notice_period_type ?
        this.contractService.contractData.cola_details.notice_period_type.code : '');
      this.formGroup.get('percentage').setValue(this.contractService.contractData.cola_details.percentage);
      this.formGroup.get('status').setValue(this.contractService.contractData.cola_details.status ?
        this.contractService.contractData.cola_details.status.code : '');
      this.formGroup.get('referenceNo').setValue(this.contractService.contractData.cola_details.reference_no);
      this.formGroup.get('relatedReferenceNo').setValue(this.contractService.contractData.cola_details.related_ref_no);
      this.formGroup.get('reminder').setValue(this.contractService.contractData.cola_details.reminder);
      this.objectToExport = this.contractService.contractData.cola_details;

      let queryParams = new HttpParams();
      queryParams = queryParams.set('contractId', this.contractService.contractId);
      queryParams = queryParams.set('typeCode', 'COLATYPE');

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
      cola_details: {
        clause: this.formGroup.get('clause').value,
        cola_type: this.formGroup.get('type').value,
        index_type: this.formGroup.get('indexType').value,
        applicable_from: this.formGroup.get('applicableFrom').value,
        revision_frequency_code: this.formGroup.get('revisionFrequency').value,
        notice_period: this.formGroup.get('noticePeriod').value,
        notice_period_type_code: this.formGroup.get('noticePeriodType').value,
        percentage: this.formGroup.get('percentage').value && this.formGroup.get('percentage').value.toString().endsWith('%') ? this.formGroup.get('percentage').value.slice(0, -1) : this.formGroup.get('percentage').value,
        status_code: this.formGroup.get('status').value,
        reference_no: this.formGroup.get('referenceNo').value,
        related_ref_no: this.formGroup.get('relatedReferenceNo').value,
        reminder: this.formGroup.get('reminder').value !== '' ? this.formGroup.get('reminder').value : false
      }
    };

    if (this.formGroup.get('reminder').value) {
      let notificationObject: any = {
        data: {
          title: 'COLA Terms',
          description: this.formGroup.get('clause').value,
          date: this.formGroup.get('applicableFrom').value,
          type: {
            name : 'COLA Type',
            valid_from : null,
            valid_to : null,
            code : 'COLATYPE'
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
      this.otherCommercialTermsService.deleteNotificationByType(this.contractService.contractId,'COLATYPE').subscribe((response: any) => {
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
          'COLA successfully updated'
        );
        this.showDownload = true;
        this.objectToExport = {
          ...objectData.data['cola_details'],
          revision_frequency: this.arrayRevisionFrequencies.find(rf => { return rf.code === objectData.data['cola_details']['revision_frequency_code']; }),
          notice_period_type: this.arrayTimePeriods.find(tp => { return tp.code === objectData.data['cola_details']['notice_period_type_code']; }),
          status: this.arrayStatuses.find(s => { return s.code === objectData.data['cola_details']['status_code']; })
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

      doc.text('TYPE: ' + this.objectToExport['cola_type'], 30, start + step);
      step += 10;

      doc.text('INDEX TYPE: ' + this.objectToExport['index_type'], 30, start + step);
      step += 10;

      doc.text('APPLICABLE FROM: ' + (this.objectToExport['applicable_from'] ?
        this.datePipe.transform(this.objectToExport['applicable_from'], 'MM/dd/yyyy') : 'N/A'), 30, start + step);
      step += 10;

      doc.text('REVISION FREQUENCY: ' + (this.objectToExport['revision_frequency'] ? this.objectToExport['revision_frequency']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('NOTICE PERIOD: ' + this.objectToExport['notice_period']
        + ' ' + (this.objectToExport['notice_period_type'] ? this.objectToExport['notice_period_type']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('PERCENTAGE: ' + this.objectToExport['percentage'] + '%', 30, start + step);
      step += 10;

      doc.text('STATUS: ' + (this.objectToExport['status'] ? this.objectToExport['status']['name'] : ''), 30, start + step);
      step += 10;

      doc.text('REFERENCE NO: ' + this.objectToExport['reference_no'], 30, start + step);
      step += 10;

      doc.text('RELATED REFERENCE NO: ' + this.objectToExport['related_ref_no'], 30, start + step);
      step += 10;

      doc.text('REMINDER: ' + (this.objectToExport['reminder'] ? 'YES' : 'NO'), 30, start + step);
      step += 10;

      doc.save('COLA.pdf');
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
        'CLAUSE', 'TYPE', 'INDEX TYPE', 'APPLICABLE FROM', 'REVISION FREQUENCY', 'NOTICE PERIOD', 'NOTICE PERIOD TYPE',
        'PERCENTAGE', 'STATUS', 'REFERENCE NO', 'RELATED REFERENCE NO', 'REMINDER'
      ];

      const obj = {
        clause: this.objectToExport['clause'],
        cola_type: this.objectToExport['cola_type'],
        index_type: this.objectToExport['index_type'],
        applicable_from: this.objectToExport['applicable_from'] ? this.datePipe.transform(this.objectToExport['applicable_from'], 'MM/dd/yyyy') : 'N/A',
        revision_frequency: this.objectToExport['revision_frequency'] ? this.objectToExport['revision_frequency']['name'] : '',
        notice_period: this.objectToExport['notice_period'],
        notice_period_type: this.objectToExport['notice_period_type'] ? this.objectToExport['notice_period_type']['name'] : '',
        percentage: this.objectToExport['percentage'],
        status: this.objectToExport['status'] ? this.objectToExport['status']['name'] : '',
        reference_no: this.objectToExport['reference_no'],
        related_ref_no: this.objectToExport['related_ref_no'],
        reminder: this.objectToExport['reminder'] ? 'YES' : 'NO'
      };

      const data = [obj];

      const replacer = (key, value) => value === null ? '' : value;
      let csv = data.map(row => Object.keys(data[0]).map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      let blob = new Blob([csvArray], { type: 'text/csv' });
      saveAs(blob, 'COLA.csv');
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

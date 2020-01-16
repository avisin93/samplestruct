import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-queue-setup',
  templateUrl: './add-edit-queue-setup.component.html',
  styleUrls: ['./add-edit-queue-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditQueueSetupComponent implements OnInit {

  @Input('heading') heading = 'Add Queue';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = '';

  @Input('projectId') projectId;

  // tslint:disable
  @Input('db_queue') db_queue;
    // tslint:enable
  @Input('projects') projects = [];

  @Input('queues') queues = [];

  queueTypes = [
        { name: 'Default', value: 'Default' },
        { name: 'Physical Delivery', value: 'Physical Delivery' },
        { name: 'Other', value: 'Other' },
        { name: 'Audit', value: 'Audit' },
        { name: 'Analyst', value: 'Analyst' },
        { name: 'Publish', value: 'Publish' },
        { name: 'Reject', value: 'Reject' },
        { name: 'Archive', value: 'Archive' },
        { name: 'Destroy', value: 'Destroy' }
  ];
  uniqueQueueTypeList = ['Default', 'Physical Delivery','Audit','Analyst','Publish','Reject','Archive','Destroy'];
  nextQueueList = [];

  addEditQueueSetupForm: FormGroup;

  constructor (private _fb: FormBuilder,
        public _dialogRef: MatDialogRef<AddEditQueueSetupComponent>,
        public httpService: HttpService,
        public _toastCtrl: ToastrService) {

    this.addEditQueueSetupForm = this._fb.group({
      _id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      queuefor: new FormControl('', [Validators.required]),
      queuetype: new FormControl('', [Validators.required]),
      projectId: '',
      nextqueue: new FormControl(''),
      active: true
    });
  }

  ngOnInit (): void {
    this.addEditQueueSetupForm.controls['projectId'].setValue(this.projectId);
    // $('.add-edit-queue-setup').closest('.cdk-overlay-pane').addClass('queueAddEditPopup');
    this.nextQueueList.push({ name: 'Select', value: '' });
    this.queues.forEach((item) => {
      this.nextQueueList.push({ name: item.name, value: item._id });
    });
  }

  onQueueTypeChange (selectedQueue) {
    console.log(selectedQueue);
  }

  saveQueue ({ value, valid }: { value: any, valid: boolean }) {

    let queue = this.queues.find(queue => queue.name === value.name);
    if (queue) {
      if (this.mode === 'add') {
        this._toastCtrl.error('Queue name should be unique !');
        valid = false;
      } else {
        if (queue._id !== value._id) {
          this._toastCtrl.error('Queue name should be unique !');
          valid = false;
        }
      }
    }
    let nextq = this.queues.find((q) => {
      return value.nextqueue === q._id;
    });
    value.nextqueue = nextq;
    if (!valid) {
      this.addEditQueueSetupForm.markAsDirty();
      this.addEditQueueSetupForm.get('nextqueue').markAsTouched();
    } else {
      this.addEditQueueSetupForm.markAsPristine();
      value.uniqueQueueTypeList = this.uniqueQueueTypeList;
      this.httpService.save(UrlDetails.$exela_addOrUpdateProjectQueueUrl, value)
                .subscribe(response => {
                  if (this.mode === 'add') {
                    this._toastCtrl.success('Queue added successfully !');
                  } else {
                    this._toastCtrl.success('Queue updated successfully !');
                  }
                  this._dialogRef.close('save');
                }, (error) => {
                  this._toastCtrl.error(error._body);
                });
    }

  }
  setEditFormValues (details?: any) {
    this.db_queue = details;
    this.addEditQueueSetupForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}

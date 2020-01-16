import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-project-doctype-setup',
  templateUrl: './add-edit-project-doctype-setup.component.html',
  styleUrls: ['./add-edit-project-doctype-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditProjectDocTypeSetupComponent implements OnInit {

  @Input('heading') heading = 'Add Queue';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = '';

  // tslint:disable
  @Input('db_queue') db_queue;
  // tslint:enable

  @Input('projects') projects = [];

  @Input('queues') queues = [];

  @Input('projectId') projectId = '';

  addEditQueueSetupForm: FormGroup;

  constructor (private _fb: FormBuilder,
        public _dialogRef: MatDialogRef<AddEditProjectDocTypeSetupComponent>,
        public httpService: HttpService,
        public _toastCtrl: ToastrService) {

    this.addEditQueueSetupForm = this._fb.group({
      _id :  new FormControl(''),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      active: true
    });
  }

  ngOnInit (): void {
    $('.add-edit-queue-setup').closest('.cdk-overlay-pane').addClass('queueAddEditPopup');
  }

  getProjectSpecificQueues (event) {
    this.httpService.getAll('UrlDetails.$getQueuesUrl' + event.value) // TODO: Vido
            .subscribe(response => {
              this.queues = response;
            }, () => {
            });
  }

  saveQueue ({ value, valid }: { value: any, valid: boolean }) {
    console.log(value);
    let reqData = value;
    reqData.projectId = this.projectId;
    if (!valid) {
      this.addEditQueueSetupForm.markAsDirty();
    } else {
      this.addEditQueueSetupForm.markAsPristine();
      this.httpService.save(UrlDetails.$exela_addOrUpdateProjectDocTypeUrl, reqData)
                .subscribe(response => {
                  if (this.mode === 'add') {
                    this._toastCtrl.success('DocType added successfully !');
                  } else {
                    this._toastCtrl.success('DocType updated successfully !');
                  }
                  this._dialogRef.close('save');
                }, () => {
                  this._toastCtrl.error('Something went wrong');
                });
    }
  }

  setEditFormValues (details?: any) {
    this.db_queue = details;
    console.log(details);
    this.addEditQueueSetupForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}

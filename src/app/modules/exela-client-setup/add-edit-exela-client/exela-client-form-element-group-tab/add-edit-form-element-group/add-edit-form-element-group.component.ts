import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { StorageService } from '../../../../shared/providers/storage.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-form-element-group-tab',
  templateUrl: './add-edit-form-element-group.component.html',
  styleUrls: ['./add-edit-form-element-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditFormElementGroupTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('heading') heading = '';

  @Input('mode') mode = '';

  @Input('formElementGroupRecord') formElementGroupRecord;

  selectedRecipient;
  results = [];
  frequentSearchList = [];
  formElements = [];
  clientFormElementGroupForm: FormGroup;
  email: string = '';

  constructor (private _fb: FormBuilder, private _router: Router, public _toastCtrl: ToastrService,
        public httpService: HttpService, public loaderService: LoaderService, public _dialogRef: MatDialogRef<AddEditFormElementGroupTabComponent>) {
    this.clientFormElementGroupForm = this._fb.group({
      groupName: new FormControl('', [Validators.required]),
      formElement: new FormControl('', [Validators.required])
    });
  }
  ngOnInit (): void {
    let reqData = {
      organizationId: StorageService.get(StorageService.organizationId)
    };
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, reqData)
            .subscribe(response => {
              response.forEach(element => {
                let doctypes = element.doctypes;
                doctypes.forEach((docType) => {
                  this.formElements = this.formElements.concat(docType.formelements);
                });
              });
              if (this.mode === 'edit') {
                this.setEditFormValues(this.formElementGroupRecord);
              } else {
                this.removeExistingFormElemnets();
              }
            }, () => {
            });
  }

  removeExistingFormElemnets () {
    let reqData = {
      organizationId: StorageService.get(StorageService.organizationId)
    };
    this.httpService.get('UrlDetails.$getFormElementGroupsUrl', reqData) // TODO: Vido
            .subscribe(response => {
              response.forEach(formGroup => {
                let formElements = formGroup.formElements;
                formElements.forEach(formElement => {
                  let index = this.formElements.findIndex((element) => element._id === formElement._id);
                  if (index > -1) {
                    this.formElements.splice(index, 1);
                  }
                });
              });
            }, (erro) => {
            });
  }
  saveFormElementGroup ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.clientFormElementGroupForm.markAsDirty();
    } else {
      this.loaderService.show();
      this.clientFormElementGroupForm.markAsPristine();
      let reqData = value;
      if (this.mode === 'edit') {
        reqData._id = this.formElementGroupRecord.groupId;
        reqData.oldFormElementId = this.formElementGroupRecord.formElementId;
      }
      reqData.organizationId = StorageService.get(StorageService.organizationId);
      this.httpService.save('UrlDetails.$addOrUpdateFormElementGroupUrl', reqData).subscribe(response => { // TODO: Vido
        this._toastCtrl.success('Shared mailbox saved successfully');
        this.closePopup();
        this.loaderService.hide();
      }, () => {
        this.loaderService.hide();
      });
    }

  }

  setEditFormValues (details?: any) {
    let form = {
      groupName: details.groupName,
      formElement: details.formElementId
    };
    this.clientFormElementGroupForm.patchValue(form);
  }

  closePopup () {
    this._dialogRef.close();
  }
}

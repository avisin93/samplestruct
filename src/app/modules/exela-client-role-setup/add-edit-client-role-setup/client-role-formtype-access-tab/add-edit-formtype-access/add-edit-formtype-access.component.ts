import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

// import { UrlDetails } from '../../../../../model/url/url-details.model';

@Component({
  selector: 'app-add-edit-formtype-access',
  templateUrl: './add-edit-formtype-access.component.html',
  styleUrls: ['./add-edit-formtype-access.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditFormTypeAccessComponent implements OnInit {

  @Input('heading') heading = 'Edit Form';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = '';

  @Input('projects') projects = [];

  @Input('projectId') projectId = '';

  @Input('docType') docType = '';

  @Input('roleId') roleId = '';

  @Input('organizationId') organizationId = '';

  addEditFormTypeAccess: FormGroup;

  constructor (private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditFormTypeAccessComponent>,
    public httpService: HttpService,
    public _toastCtrl: ToastrService) {

    this.addEditFormTypeAccess = this._fb.group({
      _id :  new FormControl(''),
      name: new FormControl('', [Validators.required]),
      canread: new FormControl(),
      canupdate: new FormControl(),
      datatype: new FormControl(),
      displayname: new FormControl(),
      active: true
    });
  }

  ngOnInit (): void {
    $('.add-edit-queue-setup').closest('.cdk-overlay-pane').addClass('queueAddEditPopup');
  }

  saveFormType ({ value, valid }: { value: any, valid: boolean }) {
    let reqData: any = {};
    reqData.formElement = value;
    reqData.projectId = this.projectId;
    reqData.docType = this. docType;
    reqData.organizationId = this.organizationId;
    reqData.roleId = this.roleId;
    if (!valid) {
      this.addEditFormTypeAccess.markAsDirty();
    } else {
      this.addEditFormTypeAccess.markAsPristine();
      this.httpService.save('UrlDetails.$exela_addUpdateRoleDocTypeFormElement', reqData)
        .subscribe(response => {
          this._toastCtrl.success(response.message);
          this._dialogRef.close(value);
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error._body);
          } else {
            this._toastCtrl.error('Something went wrong');
          }
        });
    }
  }

  setEditFormValues (details?: any) {
    console.log(details);
    this.addEditFormTypeAccess.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}

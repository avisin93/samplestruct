import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';
import { Pattern } from '../../../../../models/util/pattern.model';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-shared-mailbox-tab',
  templateUrl: './add-edit-shared-mailbox.component.html',
  styleUrls: ['./add-edit-shared-mailbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditSharedMailboxTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('heading') heading = '';

  @Input('mode') mode = '';

  @Input('sharedMailboxId') sharedMailboxId = undefined;

  selectedRecipient;
  results = [];
  frequentSearchList = [];
  clientSharedMailboxForm: FormGroup;
  email: string = '';

  constructor (private _fb: FormBuilder, private _router: Router, public _toastCtrl: ToastrService,
        public httpService: HttpService, public loaderService: LoaderService, public _dialogRef: MatDialogRef<AddEditSharedMailboxTabComponent>) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    this.clientSharedMailboxForm = this._fb.group({
      mailboxName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)])
    });
  }
  ngOnInit (): void {
    if (this.mode === 'edit') {
      this.loaderService.show();
      this.httpService.get('UrlDetails.$getSharedMailboxDetailUrl', { id: this.sharedMailboxId }).subscribe(response => { // TODO: Vido
        this.setEditFormValues(response);
        this.loaderService.hide();
      }, () => {
        this.loaderService.hide();
        this._toastCtrl.error('Something went wrong');
      });
    }
  }

  saveSharedMailBox ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.clientSharedMailboxForm.markAsDirty();
    } else {
      this.loaderService.show();
      this.clientSharedMailboxForm.markAsPristine();
      let reqData = {
        mailboxName: value.mailboxName,
        email: value.email,
        organizationId: this.organizationId,
        active: true,
        _id: this.sharedMailboxId
      };
      if (this.mode === 'add') {
        reqData['mailboxUniqueName'] = 'shared_' + (Date.now().toString());
      }
      this.httpService.save('UrlDetails.$saveSharedMailboxUr', reqData).subscribe(response => { // TODO: Vido
        this._toastCtrl.success('Shared mailbox saved successfully');
        this.closePopup();
        this.loaderService.hide();
      }, () => {
        this.loaderService.hide();
      });
    }

  }

  setEditFormValues (details?: any) {
    this.clientSharedMailboxForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }
}

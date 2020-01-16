import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from '../../../../shared/providers/http.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-product-add-edit-action-menu',
  templateUrl: './add-edit-exela-action-menu.component.html',
  styleUrls: ['./add-edit-exela-action-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaProductAddEditActionMenuComponent implements OnInit {

  @Input('selectedAction') selectedAction = {};
  @Input('heading') heading ;

  @Input('mode') mode = '';

  addEditActionForm: FormGroup;

  showNameError: Boolean = false;

  showDisplayNameError: Boolean = false;

  constructor (private _fb: FormBuilder,
        private _router: Router,
        public _dialogRef: MatDialogRef<ExelaProductAddEditActionMenuComponent>,
        public _toastCtrl: ToastrService,
        private httpService: HttpService) {
    this.addEditActionForm = this._fb.group({
      _id : new FormControl(),
      name: new FormControl('', [Validators.required]),
      displayname: new FormControl('', [Validators.required]),
      queue: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit (): void {
    this.addEditActionForm.patchValue(this.selectedAction);
  }

  saveActionForm ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.addEditActionForm.markAsDirty();
      if (value.name === '') {
        this.showNameError = true;
      } else {
        if (value.displayname === '') {
          this.showDisplayNameError = true;
        }
      }
    } else {
      this.addEditActionForm.markAsPristine();
      this._dialogRef.close();
      value.active = true;
      if (this.mode === 'add') {
        this.httpService.save('UrlDetails.$addOrUpdateActionUrl', value).subscribe(response => { // TODO: vido
          this._toastCtrl.success('Action has been added Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error._body);
          }
        });
      } else {
        console.log(value);
        this.httpService.update('UrlDetails.$addOrUpdateActionUrl', value).subscribe(response => { // TODO: Vido
          this._toastCtrl.success('Action has been updated Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error._body);
          }
        });
      }
    }
  }

  closePopup () {
    this._dialogRef.close();
  }
}

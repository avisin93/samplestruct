import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../shared/providers/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-client-vendor-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})

export class AddEditClientVendorProductComponent implements OnInit {

  @Input('heading') heading = 'Add Product';

  @Input('saveButtonTitle') saveBtnTitle = 'Add';

  @Input('mode') mode = 'add';

  addEditProductForm: FormGroup;

  constructor (private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditClientVendorProductComponent>,
    public _toastCtrl: ToastrService,
    public httpService: HttpService) {
    this.addEditProductForm = this._fb.group({
      productCode: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required])
    });
  }

  ngOnInit () {
    $('.add-edit-client-vendor-product-wrap').closest('.cdk-overlay-pane').addClass('addEditClientVendorProductPopup');
  }

  saveProduct ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addEditProductForm.markAsDirty();
    } else {
      this.addEditProductForm.markAsPristine();
      this._dialogRef.close('saved');
    }
  }

  setEditFormValues (details?: any) {
    this.addEditProductForm.patchValue(details);
  }

  closePopup () {
    this._dialogRef.close();
  }

}

import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { HttpService } from '../../../shared/providers/http.service';
import { Pattern } from '../../../../models/util/pattern.model';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-product-information-tab',
  templateUrl: './exela-product-information.component.html',
  styleUrls: ['./exela-product-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaProductInformationComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('productId') _id = '';

  @ViewChild('input') imageInput: ElementRef;

  productInformationForm: FormGroup;

  logoSelected: boolean = false;
  logoValidation: boolean = false;

  logoString: string = '';

  countries: Array<any> = [
    {
      value: 'USA', text: 'USA'
    },
    {
      value: 'India', text: 'India'
    }
  ];

  productionurls: Array<any> = [
    {
      value: 'Texas', text: 'Texas'
    },
    {
      value: 'Arizona', text: 'Arizona'
    },
    {
      value: 'California', text: 'California'
    }
  ];

  constructor (private _fb: FormBuilder,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public fileUploadCtrl: FileUploadController,
        public httpService: HttpService) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_PATTERN;
    const ALPHA_NUMERIC = Pattern.ALPHA_NUMERIC;
    const ALPHA_NUMERIC_WITH_SPACE = Pattern.ALPHA_NUMERIC_WITH_SPACE;
    const WITHOUT_SPACE = Pattern.WITHOUT_SPACE;

    this.productInformationForm = this._fb.group({
      productcode: new FormControl('', [Validators.required]),
      productname: new FormControl('', [Validators.required]),
      productadminemail: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      manager: new FormControl(''),
      teamlead: new FormControl(''),
      productionurl: new FormControl(''),
      _id: new FormControl(),
      logo: new FormControl(''),
      active: true
    });
  }

  ngOnInit (): void {
    if (this.mode === 'edit') {
      this.loadProductById();
    }
  }

  loadProductById () {
    this.httpService.get(UrlDetails.$exela_getProductUrl + '/' + this._id, {}).subscribe((response) => {
      this.setEditFormValues(response);
    }, () => {
      console.log('exception while loading product by id');
    });
  }

  saveProduct ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.productInformationForm.markAsDirty();
      this.productInformationForm.get('teamlead').markAsTouched();
      this.productInformationForm.get('productionurl').markAsTouched();
      if (value.logo === '') {
        this.logoValidation = true;
      }
    } else {
      value.active = true;
      if (value.logo === '') {
        this.logoValidation = true;
      } else {
        this.productInformationForm.markAsPristine();
        if (this.mode === 'add') {
          this.httpService.save(UrlDetails.$exela_addOrUpdateProductUrl, value).subscribe(response => {
            this._toastCtrl.success('Product has been added Successfully');
            this.gotoProductSetup();
          }, (error) => {
            if (error.status === 500) {
              this._toastCtrl.error(error._body);
            }
          });
        } else {
          this.httpService.update(UrlDetails.$exela_addOrUpdateProductUrl, value).subscribe(response => {

            this._toastCtrl.success('Product has been updated Successfully');
          }, (error) => {
            if (error.status === 500) {
              this._toastCtrl.error(error._body);
            }
          });
        }

      }
    }
  }

  setEditFormValues (details?: any) {
    this.productInformationForm.patchValue(details);
    if (this.productInformationForm.controls['logo'].value !== null && this.productInformationForm.controls['logo'].value !== '') {
      this.logoSelected = true;
      this.logoValidation = false;
    }
  }

  selectLogo (input) {
    this.productInformationForm.controls['logo'].setValue(input.files[0]);
    this.fileUploadCtrl.readImageFile(input, { width: null, height: null }, null,(dataUrl) => {
      this.productInformationForm.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
      this.logoValidation = false;
    });
  }

  removeLogo () {
    this.productInformationForm.controls['logo'].setValue('');
    this.logoSelected = false;
    this.imageInput.nativeElement.value = '';
    this.logoValidation = true;
  }

  gotoProductSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-product-setup']);
  }

  gotoProductEdit (id) {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/product-setup/edit/' + id]);
  }

}

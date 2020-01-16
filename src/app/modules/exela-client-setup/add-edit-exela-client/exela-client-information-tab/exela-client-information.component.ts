import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/modules/shared/providers/session.service';

@Component({
  selector: 'app-exela-client-setup-information-tab',
  templateUrl: './exela-client-information.component.html',
  styleUrls: ['./exela-client-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExelaClientInformationTabComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('organizationId') _id = '';

  @Output('stepChange') stepChange = new EventEmitter<any>();

  @ViewChild('input') imageInput: ElementRef;

  clientInformationForm: FormGroup;

  logoSelected: boolean = false;

  logoString: string = '';

  countries: Array<any> = [
    {
      value: 'USA', text: 'USA'
    },
    {
      value: 'India', text: 'India'
    }
  ];

  states: Array<any> = [
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

  cities: Array<any> = [
    {
      value: 'Los Angeles', text: 'Los Angeles'
    },
    {
      value: 'Phoenix', text: 'Phoenix'
    },
    {
      value: 'San Diego', text: 'San Diego'
    }
  ];
  oldOrgCode: String = null;
  constructor (private _fb: FormBuilder,
        private _router: Router,
        public _toastCtrl: ToastrService,
        public fileUploadCtrl: FileUploadController,
        public httpService: HttpService) {
    this.clientInformationForm = this._fb.group({
      organizationcode: new FormControl('', [Validators.required]),
      organizationname: new FormControl('', [Validators.required]),
      address: new FormGroup(
        {
          add1: new FormControl(''),
          country: new FormControl(''),
          state: new FormControl(''),
          city: new FormControl(''),
          zipcode: new FormControl(''),
          countrycode: new FormControl('')
        }),
      phone: new FormControl(''),
      fax: new FormControl(''),
      logo: '',
      _id: new FormControl(),
      adminUserName: new FormControl(''),
      adminUserEmail: new FormControl(''),
      active: true
    });
  }

  ngOnInit (): void {
    if (this.mode === 'edit') {
      this.loadClientByClientId(this._id);
    }
  }
  loadClientByClientId (_id: any) {
    this.httpService.findById(UrlDetails.$exela_getClientUrl + '/' + _id, {}).subscribe((response) => {
      let client = response[0];
      this.setEditFormValues(client);
      this.oldOrgCode = client.organizationcode;
            // if (response.responseCode === 200 && response.responseData.responseCode === 100) {
            //     let client = (response.responseData.clients.length > 0) ? response.responseData.clients[0] : '';
            //     client['address'] = client['address1'];
            //     client['zipCode'] = client['zip'];
            //     this.setEditFormValues(client);
            // }
    }, () => {
      console.log('exception while loading client by id');
    });
  }

  saveClient ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.clientInformationForm.markAsDirty();
      this.clientInformationForm.get('address.country').markAsTouched();
      this.clientInformationForm.get('address.state').markAsTouched();
      this.clientInformationForm.get('address.city').markAsTouched();
    } else {
      this.clientInformationForm.markAsPristine();
      value.clientType = 'C';
      value.active = true;

      if (this.mode === 'add') {
        delete value._id;
        this.httpService.save(UrlDetails.$exela_createClientUrl, value).subscribe(response => {
          if (response.responseCode === 200) {
            this._toastCtrl.success('Client has been added successfully');
            /*
              TODO: SasaCV - We don't have our initializeDefaultConfigForClientUrl
              this.httpService.save('UrlDetails.$initializeDefaultConfigForClientUrl', { organizationId: response.id }).subscribe(res => {
              });
            */
            const userModules = JSON.parse(StorageService.get(StorageService.userModules));
            if (userModules[0].roles.indexOf('PRODUCTADMIN') > -1) {
              this.addProductToClient(response.id, userModules);
            } else {
              this.gotoClientSetup();
            }
          } else {
            this._toastCtrl.error('Server Error', 'Exela Auth error');
          }
        }, (error) => {
          this._toastCtrl.error(error.error);
        });
      } else {
        this.httpService.update(UrlDetails.$exela_createClientUrl, value).subscribe(response => {
          if (response.responseCode === 200) {
            this._toastCtrl.success('Client has been updated Successfully');
          } else {
            this._toastCtrl.error('Server Error', 'Exela Auth error');
          }
        }, (error) => {
          if (error.status === 400) {
            error.error = error.error.replace('Organization', 'Client');
            this._toastCtrl.error(error.error);
          }
        });
      }
    }
  }

  addProductToClient (organizationId, userModules) {
    let assignReq = {
      id: organizationId,
      products: {
        _id: userModules[0].productId,
        productname: userModules[0].productName
      }
    };
    this.httpService.save(UrlDetails.$exela_assignProductsToClientUrl, assignReq).subscribe(response => {
      this.gotoClientSetup();
    });
  }

  setEditFormValues (details?: any) {
    this.clientInformationForm.controls['adminUserName'].setValidators([]);
    this.clientInformationForm.controls['adminUserEmail'].setValidators([]);

    this.clientInformationForm.controls['adminUserName'].updateValueAndValidity();
    this.clientInformationForm.controls['adminUserEmail'].updateValueAndValidity();

    this.clientInformationForm.patchValue(details);
    if (this.clientInformationForm.controls['logo'].value !== '') {
      this.logoSelected = true;
    }
  }

  selectLogo (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 230, height: 80 }, (dataUrl) => {
      this.clientInformationForm.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
    });
  }

  removeLogo () {
    this.clientInformationForm.controls['logo'].setValue('');
    this.logoSelected = false;
    this.imageInput.nativeElement.value = '';
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-setup']);
  }

}

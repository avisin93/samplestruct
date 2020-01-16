import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pattern } from '../../../../models/util/pattern.model';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-information',
  templateUrl: './client-information.component.html',
  styleUrls: ['./client-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientInformationComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('organizationId') organizationId = '';

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

  constructor (private _fb: FormBuilder,
    private _router: Router,
    public _toastCtrl: ToastrService,
    public fileUploadCtrl: FileUploadController,
    public httpService: HttpService) {
    const EMAIL_REGEX = Pattern.EMAIL_PATTERN;
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_PATTERN;

    this.clientInformationForm = this._fb.group({
      organizationCode: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      primaryContactPhone: new FormControl(''),
      fax: new FormControl(''),
      logo: '',
      organizationId: new FormControl(),
      primaryContactEmail: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)])
    });
  }

  ngOnInit (): void {
    console.log('Client Mode ' + this.mode);
    console.log(this.organizationId);
    if (this.mode === 'edit') {
      this.loadClientByClientId(this.organizationId);
    }
  }
  loadClientByClientId (organizationId: any) {
    let clientReq = {
      organizationId : organizationId
    };
    this.httpService.findById('UrlDetails.$getClientUrl',clientReq).subscribe((response) => { // TODO: Vido
      let client = response;
      client['address'] = client['address1'];
      this.setEditFormValues(client);
    },() => {
      console.log('exception while loading client by id');
    });
  }

  saveClient ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.clientInformationForm.markAsDirty();
      this.clientInformationForm.get('country').markAsTouched();
      this.clientInformationForm.get('state').markAsTouched();
      this.clientInformationForm.get('city').markAsTouched();
    } else {
      this.clientInformationForm.markAsPristine();
      console.log('client request');
      console.log(value);
      value.organizationId = StorageService.get(StorageService.organizationId);
      value.clientType = 'C';
      console.log(StorageService.get(StorageService.organizationId));
      if (this.mode === 'add') {
        delete value.organizationId;
        this.httpService.save('UrlDetails.$createClientUrl',value).subscribe(response => { // TODO: Vido
          if (response.responseCode === '200') {
            this._toastCtrl.success('Client has been added Successfully');
            this.gotoClientSetup();
          } else if (response.responseCode === '401') {
            this._toastCtrl.error('Record with given client code already exists');
          } else {
            this._toastCtrl.error('Something went wrong !!');
          }

        });
      } else {
        this.httpService.update('UrlDetails.$updateClientUrl',value).subscribe(response => { // TODO: Vido
          if (response.responseCode === '200') {
            this._toastCtrl.success('Client has been updated Successfully');
          } else if (response.responseCode === '409') {
            this._toastCtrl.error('Record with user name or email id already exists');
          } else {
            this._toastCtrl.error('Something went wrong !!');
          }
        });
      }
    }
  }

  setEditFormValues (details?: any) {
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
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/client-setup']);
  }

}

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploadController } from '../../../shared/controllers/file-uploader.controller';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { Pattern } from '../../../../models/util/pattern.model';

@Component({
  selector: 'app-client-role-setup-information-tab',
  templateUrl: './client-role-information.component.html',
  styleUrls: ['./client-role-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientRoleInformationTabComponent implements OnInit {

  @Input('mode') mode = '';

  @Input('organizationId') organizationId = '';

  organizationName = '';

  productName = '';

  roleId = '';

  roleInformationForm: FormGroup;

  logoSelected: boolean = false;

  logoString: string = '';

  clients: Array<any> = [];
  products: Array<any> = [];

  showClientError: Boolean = false;
  showProductError: Boolean = false;

  constructor (private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    public _toastCtrl: ToastrService,
    public fileUploadCtrl: FileUploadController,
    public httpService: HttpService) {
    this.roleInformationForm = this._fb.group({
      roleName: new FormControl('', [Validators.required,Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_SPACE)]),
      organizationId: new FormControl(''),
      productId: new FormControl('', [Validators.required]),
      _id: new FormControl()
    });
  }

  ngOnInit (): void {
    this.getClientById();
    if (this.mode === 'edit') {
      this._route.params.subscribe((params: any) => {
        this.roleId = params.id;
        this.getRole();
      });
    }
  }

  getRole () {
    this.httpService.get(UrlDetails.$exelaGetRoleUrl + '/' + this.roleId,{}).subscribe(response => {
      this.organizationId = response.organizationId;
      this.organizationName = response.organizationName;
      this.productName = response.productName;
      this.products = [];
      this.httpService.get(UrlDetails.$exela_getClientProductUrl + '/' + this.organizationId, {}).subscribe(productResp => {
        this.products = [];
        productResp.forEach((product) => {
          this.products.push({ text: product.productname, value: product._id });
        });
        this.setEditFormValues(response);
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });
  }

  getClientById () {
    this.httpService.get(UrlDetails.$exela_getClientUrl + '/' + this.organizationId, {}).subscribe(response => {
      this.organizationName = response[0].organizationname;
      this.getAssignedProduct();
    }, error => {
      console.log(error);
    });
  }

  getAssignedProduct () {
    this.httpService.get(UrlDetails.$exela_getClientProductUrl + '/' + this.organizationId, {}).subscribe(response => {
      response.forEach((product) => {
        this.products.push({ text: product.productname, value: product._id });
      });
    }, (error) => {
      console.log(error);
    });
  }

  onProductChange (event) {
    this.productName = event.source.selected.viewValue;
  }

  loadClientByClientId (_id: any) {
    this.httpService.findById(UrlDetails.$exela_getClientUrl + '/' + _id, {}).subscribe((response) => {
      let client = response[0];
      this.setEditFormValues(client);
    }, (error) => {
      console.log(error);
      console.log('exception while loading client by id');
    });
  }

  saveClient ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.roleInformationForm.markAsDirty();
      if (value.organizationId === '') {
        this.showClientError = true;
      }
      if (value.productId === '') {
        this.showProductError = true;
      }

    } else {
      this.roleInformationForm.markAsPristine();
      if (this.mode === 'add') {
        delete value._id;
        value.organizationId = this.organizationId;
      }
      let req = value;
      req.organizationName = this.organizationName;
      req.productName = this.productName;
      req.active = true;
      this.httpService.save(UrlDetails.$exelaCreateOrUpdateClientProductRoleUrl, req).subscribe(response => {
        if (this.mode === 'add') {
          this._toastCtrl.success('Role has been added Successfully');
        } else {
          this._toastCtrl.success('Role has been updated Successfully');
        }
        this.gotoClientSetup();

      },
        (error) => {
          this._toastCtrl.error(error._body);
        });
    }
  }

  setEditFormValues (details?: any) {
    this.roleInformationForm.patchValue(details);
    if (details.roleName === 'CLIENTADMIN' || details.roleName === 'SUPERADMIN' || details.roleName === 'PRODUCTADMIN') {
      this._toastCtrl.error(details.roleName + 'Role details can not be edited.');
      this.gotoClientSetup();
    }
    // if (this.roleInformationForm.controls['logo'].value !== '') {
    //   this.logoSelected = true;
    // }
  }

  selectLogo (input) {
    this.fileUploadCtrl.readImageFile(input, { width: 230, height: 80 }, (dataUrl) => {
      this.roleInformationForm.controls['logo'].setValue(dataUrl);
      this.logoSelected = true;
    });
  }

  removeLogo () {
    this.roleInformationForm.controls['logo'].setValue('');
    this.logoSelected = false;
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-role-setup']);
  }

}

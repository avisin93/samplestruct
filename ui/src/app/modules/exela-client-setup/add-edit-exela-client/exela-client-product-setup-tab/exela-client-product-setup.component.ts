import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../shared/providers/session.service';
import { RequestService } from 'src/app/modules/request.service';

@Component({
  selector: 'app-exela-client-setup-product-tab',
  templateUrl: './exela-client-product-setup.component.html',
  styleUrls: ['./exela-client-product-setup.component.scss']
})
export class ExelaClientProductTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';
  organizationCode: string;
  assignProductForm: FormGroup;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Client setup',
      base: false,
      link: '',
      active: true
    }
  ];

  selectedItem: any;
  selectedItemIndex: number = -1;
  side: string = 'left';
  listing: Array<any> = [];

  constructor (
    private _fb: FormBuilder,
    public _toastCtrl: ToastrService,
    private _router: Router,
    private httpService: HttpService,
    private requestService: RequestService
  ) {
    this.assignProductForm = this._fb.group({
      currentProductList: this._fb.array([]),
      assignProductList: this._fb.array([])
    });
  }

  ngOnInit () {
    this.getAssignedProduct();
    this.loadClientByClientId(this.organizationId);
  }

  loadClientByClientId (_id: any) {
    this.httpService.findById(UrlDetails.$exela_getClientUrl + '/' + _id, {}).subscribe((response) => {
      this.organizationCode = response[0].organizationcode;
    }, (error) => {
      console.log(error);
      this._toastCtrl.error('Error Exela Auth', 'Exela Auth error');
    });
  }

  getProductList (assignedProducts) {
    this.httpService.get(UrlDetails.$exela_getAllProductsUrl,{}).subscribe(response => {
      response.forEach((item) => {
        let alreadyAssigned = false;
        assignedProducts.forEach((prod) => {
          if (prod.productname === item.productname) {
            alreadyAssigned = true;
          }
        });
        if (!alreadyAssigned) {
          this._currentProductList.push(this.productForm(item));
        }
      });
    }, (error) => {
      console.log(error);
      this._toastCtrl.error('Error Exela Auth', 'Exela Auth error');
    });
  }

  getAssignedProduct () {
    this.httpService.get(UrlDetails.$exela_getClientProductUrl + '/' + this.organizationId, {}).subscribe(response => {
      response.forEach((item) => {
        this._assignProductList.push(this.productForm(item));
      });
      this.getProductList(response);
    }, (error) => {
      console.log(error);
      this._toastCtrl.error('Error Exela Auth', 'Exela Auth error');
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.assignProductForm.controls['client'].markAsTouched();
    } else {
      const assignedProdList = [];
      let assignContractManagement = false;
      if (value.assignProductList.length > 0) {
        value.assignProductList.forEach((item) => {
          if (!assignContractManagement) {
            assignContractManagement = item.productcode === 'contractmanagement';
          }
          assignedProdList.push({
            _id: item.id,
            productname: item.name,
            productcode: item.productcode
          });
        });
        const assignReq = {
          id: this.organizationId,
          products: assignedProdList
        };
        this.httpService.save(UrlDetails.$exela_assignProductsToClientUrl, assignReq).subscribe(response => {
          this._toastCtrl.success('Products assigned to client');
          if (assignContractManagement) {
            this.requestService.doPOST('/api/contracts/client-init', null, 'API_CONTRACT', null, this.organizationCode).subscribe(response => {
              this._toastCtrl.success('Contract meta model has been added for client successfully');
            }, (error) => {
              this._toastCtrl.error(error.error);
            });
          }
        }, (error) => {
          console.log(error);
          this._toastCtrl.error('Error Exela Auth', 'Exela Auth error');
        });
      } else {
        this._toastCtrl.error('Please add at least one Products to assign');
      }
    }
  }

  get _currentProductList (): FormArray {
    return this.assignProductForm.get('currentProductList') as FormArray;
  }

  get _assignProductList (): FormArray {
    return this.assignProductForm.get('assignProductList') as FormArray;
  }

  productForm (item: any) {
    return new FormGroup({
      id: new FormControl(item._id),
      name: new FormControl(item.productname),
      productcode: new FormControl(item.productcode)
    });
  }

  onSelectItem (item, index, side) {
    this.selectedItem = item;
    this.selectedItemIndex = index;
    this.side = side;
  }

  moveLeft () {
    if (this.selectedItemIndex !== -1 && this.side === 'right') {
      this._assignProductList.removeAt(this.selectedItemIndex);
      this._currentProductList.push(this.selectedItem);
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveRight () {
    if (this.selectedItemIndex !== -1 && this.side === 'left') {
      this._currentProductList.removeAt(this.selectedItemIndex);
      this._assignProductList.push(this.selectedItem);
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveAllLeft () {
    if (this._assignProductList.length > 0) {
      for (let i = 0; i < this._assignProductList.length; i++) {
        this._currentProductList.push(this._assignProductList.at(i));
      }

      for (let i = this._assignProductList.length - 1; i >= 0; i--) {
        this._assignProductList.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveAllRight () {
    if (this._currentProductList.length > 0) {
      for (let i = 0; i < this._currentProductList.length; i++) {
        this._assignProductList.push(this._currentProductList.at(i));
      }

      for (let i = this._currentProductList.length - 1; i >= 0; i--) {
        this._currentProductList.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-setup']);
  }

}

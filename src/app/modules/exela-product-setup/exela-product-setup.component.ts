import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { UrlDetails } from '../../models/url/url-details.model';
import { HttpService } from '../shared/providers/http.service';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { LoaderService } from '../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';

@Component({
  selector: 'app-exela-product-setup',
  templateUrl: './exela-product-setup.component.html',
  styleUrls: ['./exela-product-setup.component.scss']
})

export class ExelaProductSetupComponent implements OnInit {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  columns: Array<any> = [
    {
      title: 'PRODUCT CODE',
      key: 'productcode',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'PRODUCT NAME',
      key: 'productname',
      sortable: true,
      filter: true,
      link: true
    }

  ];

  records: Array<any> = [];

  totalRows: number = 0;

  searchBox: boolean = true;

  hasActionButtons: boolean = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Product Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '500px',
    height: '320px',
    panelClass: 'appModalPopup'
  };
  constructor (private _router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private loaderService: LoaderService,
    public toastController: ToastrService) { }

  ngOnInit () {
    this.getProductList();
  }

  getProductList () {
    this.loaderService.show();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    this.httpService.get(UrlDetails.$exela_getAllProductsUrl, {
      headers: headers
    }).subscribe(response => {
      this.records = response;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      this.loaderService.hide();
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    });
  }

  gotoLink (data: any) {
    if (typeof data.row._id !== 'undefined') {
      this._router.navigate(['edit/' + data.row._id], { relativeTo: this.route });
    }
  }

  editProduct (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id], { relativeTo: this.route });
    }
  }

  deleteProduct (data: any) {
    let deleteRoleSetUpAlert = new SweetAlertController();
    deleteRoleSetUpAlert.deleteConfirm({},() => {
      data.active = false;
      this.httpService.delete(UrlDetails.$exela_addOrUpdateProductUrl, data)
            .subscribe(response => {
              this.toastController.success('Product Deleted Successfully');
              this.getProductList();
            }, () => {
              this.toastController.error('Something went wrong, Please try again.');
            });
    });
  }
}

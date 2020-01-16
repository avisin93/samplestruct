import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { SettingsService } from '../../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { TranslatorService } from '../../../../core/translator/translator.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpRequest } from '../../../../common';
import { SharedData } from '../../../../shared/shared.data';
import { Ng2DataTableMethods, Common } from '../../../../common';
import { ROUTER_LINKS_FULL_PATH, ACTION_TYPES, CONTRACT_STATUS, CustomTableConfig, VENDOR_TYPE } from '../../../../config';
import { VendorListService } from './list-vendor.service';
import { SharedService } from '../../../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListVendorsComponent implements OnInit {
  isSearchClicked: boolean = false;
  totalItems: any;
  projectTypes: any;
  public singleData;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  // CONTRACT_STATUS = CONTRACT_STATUS;
  CONTRACT_STATUS: { id: number; text: string; }[];
  permissionArr: any;
  MODULE_ID: any;
  // VENDOR_TYPE = VENDOR_TYPE;
  VENDOR_TYPE: { id: number; text: string; }[];
  index: any = 1;
  // ng2Table
  public page: any = 1;
  public rows: Array<any> = [];
  public totalRows: Array<any> = [];
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = CustomTableConfig.pageSize;
  public maxSize: any = 5;
  public numPages: any = 1;
  public length: any = 0;
  vendorList: any;
  categories: any;
  public tableRecordNo: any = 1;
  vendorsFilterForm: FormGroup;
  showLoadingFlg: boolean = false;
  projectType: any = [];
  category: any = [];
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  breadcrumbData: any = {
    title: 'actors.vendors.labels.vendorlist',
    subTitle: 'actors.vendors.labels.vendorSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.vendors.labels.vendorlist',
      link: ''
    }
    ]
  }
  commonLabels: any;
  permissionObject: any;
  constructor(private translateService: TranslateService, private toastrService: ToastrService, private _sharedService: SharedService, private _vendorlist: VendorListService, private fb: FormBuilder, public http: HttpRequest, private sharedData: SharedData, private router: Router, public route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.setPermissionsDetails();
    this.getLocalizedDropdownValues();
    this.getListVendors();
    // this.onChangeTable();
    this.getProjectTypes();
    this.vendorsFilterForm = this.fb.group({
      name: [''],
      email: [''],
      electronicIdNumber: [''],
      contract: ['',],
      vendorType: [''],
      projectType: [''],
      category: [''],
    });

  }
  getLocalizedDropdownValues() {
    this.CONTRACT_STATUS = Common.changeDropDownValues(this.translateService, CONTRACT_STATUS);
    this.VENDOR_TYPE = Common.changeDropDownValues(this.translateService, VENDOR_TYPE);
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });
  }
  /*set action & ui control permissions based on role of logged in vendor*/
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
  }
  // Get project types
  getProjectTypes() {
    this._sharedService.getProjectTypes().subscribe((data: any) => {
      this.projectTypes = [];
      this.projectTypes = data.payload.results;
      this.projectType = Common.getMultipleSelectArr(this.projectTypes, ['id'], ['name']);
    });
  }
  // Get category
  getCatgory(typeID = '') {
    this.category = [];
    this.categories = [];
    if (typeID) {
      this._sharedService.getProjectCategories(typeID).subscribe((data: any) => {
        this.category = [];
        this.categories = data.payload.results;
        this.category = Common.getMultipleSelectArr(this.categories, ['id'], ['i18n', 'mappingName']);
      });
    }
  }
  /**
method to get data for current page
  **/
  // public onChangeTable(page: any = { page: this.currentPage, itemsPerPage: this.itemsPerPage }): any {
  //   this.rows = Ng2DataTableMethods.changePage(page, this.totalRows);
  // }

  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    if (!this.isSearchClicked) {
      this.vendorsFilterForm.reset();
    }
    this.index = 1 + (20 * (this.currentPage - 1));

    this._vendorlist.search(this.getSearchQueryParam()).subscribe((response: any) => {

      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showLoadingFlg = false;
        this.vendorList = response.payload.results;
        this.totalItems = response.payload.totalItems;
      }
    });
  }
  /**
  method to filter data on key up event
  **/
  filterData(event) {
    this.rows = Ng2DataTableMethods.filterData(event, this.totalRows);
  }
  sort(e) {
  }

  /**
method to navigate to details page of selected user
  **/
  editVendor(rowIndex) {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.editVendor, [rowIndex])]);
  }
  /**Searches on enter button*/
  @HostListener('document:keydown', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  }
  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    //let params1: URLSearchParams = new URLSearchParams();

    var queryParamObj = {};

    if (this.vendorsFilterForm && this.isSearchClicked) {
      var formValues = this.vendorsFilterForm.value;
      if (formValues.email) {
        params = params.append('email', formValues.email.toLowerCase().trim());
      }

      if (formValues.name) {
        params = params.append('name', formValues.name.trim());
      }

      if (formValues.electronicIdNumber) {
        params = params.append('electronicId', formValues.electronicIdNumber.trim());
      }

      if (formValues.contract) {
        params = params.append('contractStatus', formValues.contract);
      }

      if (formValues.projectType) {
        params = params.append('projectTypeId', formValues.projectType);
      }
      if (formValues.vendorType) {
        params = params.append('vendorType', formValues.vendorType);
      }
      if (formValues.category) {
        params = params.append('categoryId', formValues.category);
      }
    }

    return params;
  }
  clear() {
    this.isSearchClicked = false;
    this.vendorsFilterForm.reset();
    this.vendorsFilterForm.patchValue({
      contract: "",
      vendorType: "",
      projectType: "",
      category: ""
    })
    this.categories = [];
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
    this.getListVendors();
  }

  search() {
    this.isSearchClicked = true;
    this.setdefaultPage();
    this.getListVendors();
  }
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }
  changeStatus(vendorData, event) {
    this._vendorlist.changeStatus(vendorData.id).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.toastrService.success(response.header.message);
      }
      else {
        this.toastrService.error(response.header.message);
        this.toggleStatusButton1(vendorData, event);
      }
    }, (err) => {
      this.toastrService.error(this.commonLabels.errorMessages.error);
      this.toggleStatusButton1(vendorData, event);
    });
  }
  toggleStatusButton1(vendorData, event) {
    if (vendorData.status === 1) {
      vendorData.status = 0;
      $(event.target).prop('checked', false);
    } else {
      vendorData.status = 1;
      $(event.target).prop('checked', true);
    }
  }
  getListVendors() {
    this.showLoadingFlg = true;
    this._vendorlist.getVendorList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showLoadingFlg = false;
        if (response.payload && response.payload.results) {
          this.vendorList = response.payload.results;
          this.totalItems = response.payload.totalItems;
        } else {
          this.vendorList = [];
          this.totalItems = 0;
        }
      } else {
        this.vendorList = [];
        this.totalItems = 0;
      }
    }, error => {
      this.showLoadingFlg = false;
      this.vendorList = [];
      this.totalItems = 0;
    },
    );
  }

  openSwapPopUp(event, index, vendorData) {
    let swalObj;
    if (vendorData.status === 1) {
      $(event.target).prop('checked', true);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.disableUserMessage, true, true);
    } else {
      $(event.target).prop('checked', false);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.enableUserMessage, true, true);
    }
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.vendorList[index].status = vendorData.status === 1 ? 0 : 1;
        vendorData.status = this.vendorList[index].status;
        this.toggleStatusButton(event, vendorData);
        this.changeStatus(vendorData, event);
        // this.changeAccess(scouterData);
      } else {
        this.toggleStatusButton(event, vendorData);
      }
    });
  }

  toggleStatusButton(event, vendorData) {
    if (vendorData.status === 1) {
      $(event.target).prop('checked', true);
    } else {
      $(event.target).prop('checked', false);
    }
  }



}

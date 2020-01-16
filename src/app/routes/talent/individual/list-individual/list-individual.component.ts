/**
* Component     : ListIndividualComponent
* Author        : Boston Byte LLC
* Creation Date : 19th April, 2019
*/

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedData } from '@app/shared/shared.data';
import { Common, NavigationService } from '@app/common';
import { ROUTER_LINKS, ACTION_TYPES, CONTRACT_STATUS, CustomTableConfig, UI_ACCESS_PERMISSION_CONST } from '@app/config';
import { IndividualListDataModel } from './list-individual.data.model';
import { ListIndividualService } from './list-individual.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ROUTER_LINKS_TALENT_FULL_PATH } from '../../talent.config';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-individual-freelancers',
  templateUrl: './list-individual.component.html',
  styleUrls: ['./list-individual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListIndividualComponent implements OnInit {
  ROUTER_LINKS_TALENT_FULL_PATH = ROUTER_LINKS_TALENT_FULL_PATH;
  ROUTER_LINKS = ROUTER_LINKS;
  ACTION_TYPES = ACTION_TYPES;
  CONTRACT_STATUS = CONTRACT_STATUS;
  uiAccessPermissionsObj: any;
  permissionArr: any;
  MODULE_ID: any;
  index: any = 1;
  // ng2Table
  public rows: Array<any> = [];
  public totalRows: Array<any> = [];
  itemsPerPage: any = CustomTableConfig.pageSize;
  currentPage: any = CustomTableConfig.pageNumber;
  page: any;
  public maxSize: any = CustomTableConfig.maxPageLinkSize;
  public numPages = 1;
  public length = 0;
  public tableRecordNo: any = 1;
  individualList: any = [];
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  Individual_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'name': 'name',
    'phone': 'phoneNo',
    'email': 'email',
  };
  breadcrumbData: any = {
    title: 'talent.individuals.labels.individualList',
    subTitle: 'talent.individuals.labels.individualListSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'talent.individuals.labels.individualList',
      link: ''
    }
    ]
  };
  totalItems: any = 0;
  totalCount: any = 0;
  showLoadingFlg = false;
  IndividualListFilterForm: FormGroup;
  isSearchClicked = false;
  common: any;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  constructor(public http: HttpClient,
    private sharedData: SharedData,
    private router: Router,
    public route: ActivatedRoute,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private navigationService: NavigationService,
    public _ListIndividualService: ListIndividualService) {
  }
  /**
   * function callled at the initialization of the page
   */
  public ngOnInit(): void {
    this.createIndividualFilterForm();
    this.setdefaultPage();
    this.getListIndividual();
    this.setPermissionsDetails();
    this.setLocaleObj();
  }
  /**
   * set action & ui control permissions based on role of logged in user
   */
  setPermissionsDetails() {
    this.permissionArr = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionArr[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
   * method to navigate to manage individual page
   * @param individualData dataObject of individual
   */
  editIndividual(individualData) {
    this.navigationService.navigate([ROUTER_LINKS_TALENT_FULL_PATH.manageIndividual + '/' + individualData.id]);
  }
  openSwapPopUp(event, individualData, index) {
    let swalObj;
    if (individualData.status) {
      $(event.target).prop('checked', true);
      swalObj = Common.swalConfirmPopupObj(this.common.labels.disableUserMessage, true, true);
    } else {
      $(event.target).prop('checked', false);
      swalObj = Common.swalConfirmPopupObj(this.common.labels.enableUserMessage, true, true);
    }
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.individualList[index].status = individualData.status ? false : true;
        individualData.status = this.individualList[index].status;
        this.changeAccess(individualData, event);
      }
    });
  }
  toggleStatusButton(event, individualData) {
    if (individualData.status) {
      $(event.target).prop('checked', true);
    } else {
      $(event.target).prop('checked', false);
    }
  }
  /**
   * method to call webService and get individual list
   */
  getListIndividual() {
    this.showLoadingFlg = true;
    this.totalCount = '';
    this._ListIndividualService.getIndividualList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.showLoadingFlg = false;
        this.index = 1 + (20 * (this.currentPage - 1));
        this.individualList = IndividualListDataModel.getIndividualListData(response.payload.results);
        this.totalItems = response.payload.totalItems;
        this.totalCount = response.payload.totalItems;
      } else {
        this.showLoadingFlg = false;
        this.individualList = [];
        this.totalItems = 0;
        this.toastrService.error(response.header.message);
      }
    }, error => {
      this.showLoadingFlg = false;
      this.individualList = [];
      this.totalItems = 0;
      this.toastrService.error(this.common.errorMessages.error);
    });
  }
  /**
   * gets translated values of labels
   */
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });
  }
  /**
    * Gets all search query parameters from the filter form and returns it.
    */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.Individual_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.Individual_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.isSearchClicked && this.IndividualListFilterForm) {
      const formValues = this.IndividualListFilterForm.value;
      if (formValues.name) {
        params = params.append(this.Individual_LIST_QUERY_PARAMS.name, formValues.name);
      }
      if (formValues.phone) {
        params = params.append(this.Individual_LIST_QUERY_PARAMS.phone, formValues.phone);
      }
      if (formValues.email) {
        params = params.append(this.Individual_LIST_QUERY_PARAMS.email, formValues.email);
      }
    }
    return params;
  }
  /**
   * It hits the service to give/remove status of individual.
   * @param IndividualData Data of a particular location scouter
   */
  changeAccess(individualData, event) {
    this._ListIndividualService.updateIndividualAccess(individualData.id).subscribe((response: any) => {
      if (response.header && Common.checkStatusCode(response.header.statusCode)) {
        this.toastrService.success(response.header.message);
        this.toggleStatusButton(event, individualData);
      }
      else {
        if (response.header && response.header.message) {
          this.toastrService.error(response.header.message);
        } else {
          this.toastrService.error(this.common.errorMessages.error);
        }
      }
    }, (err) => {
      this.toastrService.error(this.common.errorMessages.error);
    });
  }
  /**
   * Creates individual filter form
   */
  createIndividualFilterForm() {
    this.IndividualListFilterForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['']
    });
  }
  /**
   * method to clear filters
   */
  clear() {
    this.setdefaultPage();
    this.isSearchClicked = false;
    this.IndividualListFilterForm.reset();
    this.clearIndividualList();
    this.getListIndividual();
  }
  /**
   * Sets default page
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.totalItems = 0;
  }
  /**
   * Searches individual list according to the search query params
   */
  search() {
    this.isSearchClicked = true;
    this.clearIndividualList();
    this.setdefaultPage();
    this.getListIndividual();
  }
  /**
   * It clears individual list object and sets total number of items to default.
   */
  clearIndividualList() {
    this.individualList = [];
    this.totalItems = 0;
  }
  /**
   * pageChanged use to change page
   * @param event  as object
   */
  public pageChanged(event: any): void {
    this.individualList = [];
    this.currentPage = event.page;
    if (!this.isSearchClicked) {
      this.IndividualListFilterForm.reset();
    }
    this.index = 1 + (20 * (this.currentPage - 1));
    this.getListIndividual();
  }
  /**
   * Navigates to Add location screen
   */
  navigateTo() {
    this.navigationService.navigate([ROUTER_LINKS_TALENT_FULL_PATH.manageIndividual]);
  }
}

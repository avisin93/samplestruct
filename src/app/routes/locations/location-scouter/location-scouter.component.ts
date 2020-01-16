import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LocationScouterService } from './location-scouter.service';
import { SharedData } from '@app/shared/shared.data';
import { LocationScouterListData } from './location-scouter.data-model';
import { Common } from '@app/common';
import { ROUTER_LINKS, ACTION_TYPES, CustomTableConfig, SCOUTER_LIST_ACCESS } from '@app/config';
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-location-scouter',
  templateUrl: './location-scouter.component.html',
  styleUrls: ['./location-scouter.component.scss']
})
export class LocationScouterComponent implements OnInit {

  ROUTER_LINKS = ROUTER_LINKS;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  permissionArr: any;
  MODULE_ID: any;
  public page: Number = CustomTableConfig.pageNumber;
  public maxSize: Number = CustomTableConfig.maxSize;
  public numPages: Number = 1;

  SCOUTER_LIST_ACCESS = SCOUTER_LIST_ACCESS;
  breadcrumbData: any = {
    title: 'location.labels.locationScouterAccess',
    subTitle: 'location.labels.listLocationScouters',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'location.labels.scouterAccess',
      link: ''
    }
    ]
  };
  SCOUTER_ACCESS_LIST_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'name': 'name',
    'email': 'email',
    'viewAccess': 'viewAccess',
  };
  itemsPerPage: Number = CustomTableConfig.pageSize;
  currentPage: any = CustomTableConfig.pageNumber;
  scoutersList: any = [];
  scouterAccessFilterForm: FormGroup;
  showLoadingFlg: boolean;
  totalItems: any;
  commonLabels: any;

  constructor(public http: HttpClient,
    private sharedData: SharedData,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _LocationScouterService: LocationScouterService,
    private translateService: TranslateService) {
  }
  /**
   * Method called at the time of page initialization
   */
  public ngOnInit(): void {
    this.setLocaleObj();
    this.createForm();
    this.setPermissionsDetails();
    this.getScouterAccessList();
  }

  /**
   * It gets list of location scouters from the database.
   */
  getScouterAccessList(): any {
    this.showLoadingFlg = true;
    this._LocationScouterService.getScouterLocationAccessList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (response.header) {
        if (Common.checkStatusCode(response.header.statusCode)) {
          this.showLoadingFlg = false;
          if (response.payload && response.payload.results) {
            this.scoutersList = LocationScouterListData.getScoutersList(response.payload.results);
            this.totalItems = response.payload.totalItems;
          } else {
            this.clearScouterList();
          }
        } else {
          this.clearScouterList();
        }
      }
    },
      (err) => {
        this.clearScouterList();
        this.showLoadingFlg = false;
        this.toastrService.error(this.commonLabels.errorMessages.error);
      });

  }
  /**
   * It clears scouter list object and sets total number of items to default.
   */
  clearScouterList() {
    this.scoutersList = [];
    this.totalItems = 0;
  }
  /**
   * It creates filter form used to filter scouter list.
   */
  createForm(): any {
    this.scouterAccessFilterForm = this.fb.group({
      scouterName: [''],
      scouterEmail: [''],
      accessStatus: [' ']
    });
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
   * Sets search query params
   */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    const formValues = this.scouterAccessFilterForm.value;

    params = params.append(this.SCOUTER_ACCESS_LIST_PARAMS.pageNo, JSON.stringify(this.currentPage));
    params = params.append(this.SCOUTER_ACCESS_LIST_PARAMS.pageSize, JSON.stringify(this.itemsPerPage));
    if (formValues.scouterName) {
      params = params.append(this.SCOUTER_ACCESS_LIST_PARAMS.name, formValues.scouterName.trim());
    }
    if (formValues.scouterEmail) {
      params = params.append(this.SCOUTER_ACCESS_LIST_PARAMS.email, formValues.scouterEmail.toLowerCase().trim());
    }
    if (formValues.accessStatus || formValues.accessStatus === 0) {
      params = params.append(this.SCOUTER_ACCESS_LIST_PARAMS.viewAccess, formValues.accessStatus);
    }
    return params;
  }
  /**
   * It hits the service to give/remove location list access to scouter.
   * @param scouterData Data of a particular location scouter
   */
  changeAccess(scouterData, event) {
    // if (scouterData.rolePermission.view) {
    //   scouterData.rolePermission.view = false;
    // } else {
    //   scouterData.rolePermission.view = true;
    // }
    const scouterAccessData = LocationScouterListData.setScouterAccessData(scouterData);
    this._LocationScouterService.updateScouterLocationAccess(scouterAccessData).subscribe((response: any) => {
      if (response.header && Common.checkStatusCode(response.header.statusCode)) {
        this.toastrService.success(response.header.message);
      }
      else {
        if (response.header && response.header.message) {
          this.toastrService.error(response.header.message);
        } else {
          this.toastrService.error(this.commonLabels.errorMessages.error);
          this.toggleStatusButton1(scouterData, event);
        }
      }
    }, (err) => {
      this.toastrService.error(this.commonLabels.errorMessages.error);
      this.toggleStatusButton1(scouterData, event);
    });
  }
  toggleStatusButton1(scouterData, event) {

    if (scouterData.rolePermission.view === true) {
      scouterData.rolePermission.view = false;
      $(event.target).prop('checked', false);
    } else {
      scouterData.rolePermission.view = true;
      $(event.target).prop('checked', true);
    }
  }
  /**
   * Searches location list according to the search query params
   */
  search() {
    this.scoutersList = [];
    this.setdefaultPage();
    this.getScouterAccessList();
  }
  /**
   * Clears search filter
   */
  clear() {
    this.scoutersList = [];
    this.scouterAccessFilterForm.reset();
    this.scouterAccessFilterForm.patchValue({
      scouterName: '',
      scouterEmail: '',
      accessStatus: ' '
    });
    this.setdefaultPage();
    this.getScouterAccessList();
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
   * pageChanged use to change page
   * @param event  as object
   */
  public pageChanged(event: any): void {
    this.scoutersList = [];
    this.currentPage = event.page;
    this.getScouterAccessList();
  }
  /*method to set common labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });

  }
  openSwapPopUp(event, scouterData, index) {
    let swalObj;
    if (scouterData.rolePermission.view) {
      $(event.target).prop('checked', true);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.disableUserMessage, true, true);
    } else {
      $(event.target).prop('checked', false);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.enableUserMessage, true, true);
    }
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.scoutersList[index].rolePermission.view = scouterData.rolePermission.view ? false : true;
          scouterData.rolePermission.view = this.scoutersList[index].rolePermission.view;
          this.toggleStatusButton(event, scouterData);
          this.changeAccess(scouterData, event);
        } else {
          this.toggleStatusButton(event, scouterData);
        }
      });
  }

  toggleStatusButton(event, scouterData) {
    if (scouterData.rolePermission.view) {
      $(event.target).prop('checked', true);
    } else {
      $(event.target).prop('checked', false);
    }
  }

}

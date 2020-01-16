import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { SettingsService } from '../../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CustomValidators } from 'ng2-validation';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { TranslatorService } from '../../../../core/translator/translator.service';
import { HttpClient } from '@angular/common/http';
import { SharedData } from '../../../../shared/shared.data';
import { SharedService } from '../../../../shared/shared.service';
import { Ng2DataTableMethods, Common, NavigationService } from '../../../../common';
import { ROUTER_LINKS_FULL_PATH, ACTION_TYPES, CONTRACT_STATUS, URL_PATHS, CONTRACT_STATUS_CONST, PROJECT_TYPES_ARR, CustomTableConfig, PROJECT_TYPES } from '../../../../config';
import { FreelancersListService } from './list-freelancers.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

const swal = require('sweetalert');
@Component({
  selector: 'app-list-freelancers',
  templateUrl: './list-freelancers.component.html',
  styleUrls: ['./list-freelancers.component.scss']
})
export class ListFreelancersComponent implements OnInit {
  isSearchClicked: boolean = false;
  public singleData;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ACTION_TYPES = ACTION_TYPES;
  // CONTRACT_STATUS = CONTRACT_STATUS;
  CONTRACT_STATUS_CONST = CONTRACT_STATUS_CONST;
  uiAccessPermissionsObj: any;
  permissionArr: any;
  MODULE_ID: any;
  // ng2Table
  public rows: Array<any> = [];
  public totalRows: Array<any> = [];
  public page: any = 1;
  index: any = 1;
  totalItems: any;
  maxPageLinkSize: any = CustomTableConfig.maxPageLinkSize;
  itemsPerPage: any = CustomTableConfig.pageSize;
  currentPage: any = CustomTableConfig.pageNumber;
  public maxSize: any = 5;
  public numPages: any = 1;
  public length: any = 0;
  public tableRecordNo: any = 1;
  public categories = [];
  freelancerList: any;
  freelancersFilterForm: FormGroup;
  PROJECT_TYPES_ARR = PROJECT_TYPES_ARR;
  showLoadingFlg: boolean = false;
  category: any = [];
  projectTypes: any = [];
  projectType: any = [];
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  breadcrumbData: any = {
    title: 'actors.freelancers.labels.freelancersList',
    subTitle: 'actors.freelancers.labels.freelancersListSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'actors.freelancers.labels.freelancersList',
      link: ''
    }
    ]
  };
  CONTRACT_STATUS: { id: number; text: string; }[];
  userInfo: any = {};
  commonLabels: any;
  permissionObject: any;

  constructor(public http: HttpClient,
    private fb: FormBuilder,
    private sharedData: SharedData,
    private _sharedService: SharedService,
    private navigationService: NavigationService,
    public route: ActivatedRoute,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private _freelancersListService: FreelancersListService) {
  }

  public ngOnInit(): void {
    this.userInfo = this.sharedData.getUsersInfo();
    this.getFreelancersList();
    this.setPermissionsDetails();
    this.createForm();
    this.getProjectTypes();
    this.getDropdownValues();
  }
  /*set action & ui control permissions based on role of logged in user*/
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
  }
  getDropdownValues() {
    this.CONTRACT_STATUS = Common.changeDropDownValues(this.translateService, CONTRACT_STATUS);
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });
  }
  createForm() {
    this.freelancersFilterForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      electronicId: [''],
      contractStatus: [''],
      projectType: [''],
      category: ['']
    });
  }
  clearForm() {
    this.isSearchClicked = false;
    this.freelancersFilterForm.reset();
    this.freelancersFilterForm.patchValue({
      contractStatus: "",
      projectType: "",
      category: ""
    });
    this.categories = [];
    this.setdefaultPage();
    this.getFreelancersList();
  }
  getProjectTypes() {
    this._sharedService.getProjectTypes().subscribe((data: any) => {
      this.projectTypes = [];
      this.projectTypes = data.payload.results;
      this.projectType = Common.getMultipleSelectArr(this.projectTypes, ['id'], ['name']);
    });
  }

  getProjectCategories(flag) {
    this.category = [];
    this.categories = [];
    if (flag) {
      this._sharedService.getProjectCategories(this.freelancersFilterForm.value.projectType).subscribe((response: any) => {
        if (Common.checkStatusCode(response.header.statusCode)) {
          if (response.payload.results) {
            this.category = [];
            this.categories = response.payload.results;
            this.category = Common.getMultipleSelectArr(this.categories, ['id'], ['i18n', 'mappingName']);
          }
          else {
            this.categories = [];
          }
        }
        else {
          this.categories = [];
        }
      });
    }
  }
  /**Searches on enter button*/
  @HostListener('document:keydown', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  }
  /**
  ** Get Ski Lifts Listing with filters and pagination used
  **/
  getFreelancersList() {
    this.showLoadingFlg = true;
    this._freelancersListService.getFreelancersList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showLoadingFlg = false;

        this.index = 1 + (20 * (this.currentPage - 1));
        if (response.payload.results) {
          this.freelancerList = response.payload.results;
          this.totalItems = response.payload.totalItems;
        } else {
          this.freelancerList = [];
          this.totalItems = 0;
        }
      } else {
        this.freelancerList = [];
        this.totalItems = 0;
      }
    }, error => {
      this.showLoadingFlg = false;
      this.freelancerList = [];
      this.totalItems = 0;
    });
  }
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.isSearchClicked) {
      this.freelancersFilterForm.reset();
    }
    this.getFreelancersList();
  }
  search() {
    this.isSearchClicked = true;
    this.setdefaultPage();
    this.getFreelancersList();
  }
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }
  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    if (this.freelancersFilterForm && this.isSearchClicked) {
      var formValues = this.freelancersFilterForm.value;
      if (formValues.name) {
        params = params.append('name', formValues.name.trim());
      }

      if (formValues.email) {
        params = params.append('email', formValues.email.toLowerCase().trim());
      }

      if (formValues.electronicId) {
        params = params.append('electronicId', formValues.electronicId.trim());
      }
      if (formValues.contractStatus && formValues.contractStatus != "-1") {
        params = params.append('contractStatus', formValues.contractStatus);
      }
      if (formValues.projectType) {
        params = params.append('projectTypeId', formValues.projectType);
      }
      if (formValues.category && formValues.projectType) {
        params = params.append('categoryId', formValues.category);
      }

    }
    return params;
  }
  /**
method to navigate to details page of selected user
  **/
  editUser(freelancer) {
    if ((freelancer.id != this.userInfo.id)) {
      this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.editFreelancer, [freelancer.id])]);
    }
  }
  //
  // deleteUser(freelancer) {
  //   var textMsg = 'Are you sure you want to delete ' + freelancer.i18n.displayName + ' Freelancer';
  //   var swalObj = Common.swalConfirmPopupObj(textMsg);
  //
  //   swal(swalObj, (isConfirm) => {
  //     if (isConfirm) {
  //       this._freelancersListService.delete(freelancer.id).subscribe((result: any) => {
  //         this.getFreelancersList();
  //         if (result.header.statusCode !== 200) {
  //           swal('Error', result.header.message, 'error');
  //         } else {
  //           swal('Deleted!', freelancer.i18n.displayName + ' has been deleted.', 'success');
  //         }
  //       });
  //     } else {
  //       swal('Cancelled', 'Freelancer is safe', 'error');
  //     }
  //   });
  // }
  changeStatus(freelancerData, event) {
    if ((freelancerData.id != this.userInfo.id)) {
      this._freelancersListService.changeStatus(freelancerData.id).subscribe((response: any) => {
        if (Common.checkStatusCode(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
        }
        else {
          if (response.header.message) {
            this.toastrService.error(response.header.message);
            this.toggleStatusButton1(freelancerData, event);
          }

        }
      }, (err) => {
        this.toastrService.error(this.commonLabels.errorMessages.error);
        this.toggleStatusButton1(freelancerData, event);
      });
    }
  }
  toggleStatusButton1(freelancerData, event) {
    if (freelancerData.status === 1) {
      freelancerData.status = 0;
      $(event.target).prop('checked', false);
    } else {
      freelancerData.status = 1;
      $(event.target).prop('checked', true);
    }
  }

  openSwapPopUp(event, index, freelancer) {
    let swalObj;
    if (freelancer.status === 1) {
      $(event.target).prop('checked', true);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.disableUserMessage, true, true);
    } else {
      $(event.target).prop('checked', false);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.enableUserMessage, true, true);
    }
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.freelancerList[index].status = freelancer.status === 1 ? 0 : 1;
          freelancer.status = this.freelancerList[index].status;
          this.toggleStatusButton(event, freelancer);
          this.changeStatus(freelancer, event);
          // this.changeAccess(scouterData);
        } else {
          this.toggleStatusButton(event, freelancer);
        }
      });
  }

  toggleStatusButton(event, freelancerData) {
    if (freelancerData.status === 1) {
      $(event.target).prop('checked', true);
    } else {
      $(event.target).prop('checked', false);
    }
  }
}

/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, HostListener, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PassesService } from './passes.service';
import { defaultDateRangepickerOptions, CustomTableConfig, ERROR_CODES, } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { ManageBidData } from '../manage-bid.data';
import { Common, NavigationService, TriggerService } from '@app/common';
import { PASSES_STATUS_CONST, STATUS_CONST, PROJECT_APPROVAL_STATUS } from './passes.constant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PassesDataModel } from './passes.data.model';
import { TAB_CONST, TAB_NAME_KEYS, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import { SharedData } from '@app/shared/shared.data';
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-passes',
  templateUrl: './passes.component.html',
  styleUrls: ['./passes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PassesComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  @ViewChild('approvalStatusModal') public approvalStatusModal: ModalDirective;
  @ViewChild('rejectModal') public rejectModal: ModalDirective;
  statusKeyObj: any = Common.keyValueDropdownArr(PROJECT_APPROVAL_STATUS, 'id', 'text');
  projectApprovalStatusObj: any = Common.keyValueDropdownArr(PROJECT_APPROVAL_STATUS, 'text', 'id');
  BIDDING_ROUTER_LINKS_FULL_PATH = BIDDING_ROUTER_LINKS_FULL_PATH;
  passesList: any;
  approvalHierarchyArr: any = [];
  passesNameList: any = [];
  PASSES_STATUS_CONST: { id: number; text: string; }[];
  passesFilterForm: FormGroup;
  itemsPerPage: Number = 20;
  rejectionReason: string = "";
  currentPage: any = CustomTableConfig.pageNumber;
  page: any = CustomTableConfig.pageNumber;
  public maxSize: any = 3;
  public numPages: any = 1;
  totalItems: any;
  common: any;
  STATUS_CONST = STATUS_CONST;
  isSearchClicked: Boolean = false;
  showTableLoadingFlg: Boolean = false;
  today = new Date();
  searchFlag: Boolean = false;
  biddingsLabelsObj: any = {};
  myDateRangePickerOptions = JSON.parse(JSON.stringify(defaultDateRangepickerOptions));
  PASSES_LIST_QUERY_PARAMS = {
    'projectId': 'projectId',
    'pageNo': 'pageNo',
    'pageSize': 'pageSize',
    'estimatedRangeFrom': 'estimatedRangeFrom',
    'estimatedRangeTo': 'estimatedRangeTo',
    'from': 'from',
    'to': 'to',
    'pass': 'pass',
    'status': 'status',
    'daterange': 'daterange'
  };
  showLoadingFlg: Boolean = false;
  passesDropdown: any[];
  passDropDownlist: any[];
  tempObj: { createdFromPassId: any; projectId: any, status: any; };
  permissionObject: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /* initialize contsructor after declaration of all variables */
  constructor(private _passesService: PassesService,
    private router: Router,
    public manageBidData: ManageBidData,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private triggerService: TriggerService,
    private fb: FormBuilder,
    private sharedData: SharedData,
    private route: ActivatedRoute) {
    // tslint:disable-next-line:max-line-length
    this.myDateRangePickerOptions.disableSince = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() + 1 };
  }
  /* all life cycle events whichever required after inicialization of constructor */
  ngOnInit() {
    this.setPermissionsDetails();
    this.manageBidData.disableProjectInputs = this.manageBidData.serviceDisableProjectInputsFlag;
    Common.scrollTOTop();
    this.setLocaleObj();
    this.manageBidData.initialize(TAB_CONST.passes, TAB_NAME_KEYS.passes, 'passes-tab');
    this.createForm();
    this.getDropdownValues();
    this.translateFunc();
    this.getPassesList();
  }
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObject[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /*method to set biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  /**
  /**method to get current page when page changed by user
  ** @param event  as object contains current page number
  **/
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    this.passesList = [];
    if (!this.isSearchClicked) {
      this.passesFilterForm.reset();
    }
    this.getPassesList();
  }
  /**
  /*method to get search query params for callling Passes listing api
  @param status  as number for getting passes status
  @return params as httpparams object
  */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.PASSES_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.PASSES_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    params = params.append(this.PASSES_LIST_QUERY_PARAMS.projectId, this.manageBidData.projectId.toString());

    if (this.isSearchClicked && this.passesFilterForm) {
      const formValues = this.passesFilterForm.value;
      if (formValues.passNumber) {
        params = params.append(this.PASSES_LIST_QUERY_PARAMS.pass, formValues.passNumber);
      }
      if (formValues.estimateRangeTo) {
        params = params.append(this.PASSES_LIST_QUERY_PARAMS.estimatedRangeTo, formValues.estimateRangeTo);
      }
      if (formValues.estimateRangeFrom) {
        params = params.append(this.PASSES_LIST_QUERY_PARAMS.estimatedRangeFrom, formValues.estimateRangeFrom);
      }
      if (formValues.status || formValues.status === 0) {
        params = params.append(this.PASSES_LIST_QUERY_PARAMS.status, formValues.status);
      }
      if (formValues.daterange) {
        const daterange = formValues.daterange;
        const dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('fromDate', dobObj['fromDate']);
        params = params.append('toDate', dobObj['toDate']);
      }
    }
    return params;
  }
  /* Method to get passes list */
  getPassesList() {
    this.showLoadingFlg = true;
    this.showTableLoadingFlg = true;
    this._passesService.getPassesList(this.getSearchQueryParam()).subscribe((response: any) => {
      this.showLoadingFlg = false;
      this.showTableLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.totalItems = response.payload.totalItems;
        this.passesList = PassesDataModel.getPassesListDetails(response.payload.results);
        this.getPassesDropdown();
      } else {
        this.passesList = [];
        this.toastrService.error(response.header.message);
      }
    }, error => {
      this.passesList = [];
      this.totalItems = 0;
      this.showLoadingFlg = false;
      this.showTableLoadingFlg = false;
      this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
    });

  }
  /**
  **method to create pass
  **@param id  as number 
  **@param status  as number 
  **/
  createPass(pass) {
    if (pass.allowToCreatePass) {
      this.tempObj = {
        createdFromPassId: pass.id,
        projectId: this.manageBidData.projectId,
        status: this.STATUS_CONST.draft
      };
      this._passesService.createPassCopy(this.tempObj).subscribe((response: any) => {
        this.showLoadingFlg = false;
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
          this.manageBidData.serviceDisableProjectInputsFlag = false;
          this.manageBidData.disableProjectInputs = false;
          this.manageBidData.setDisableProjectInputsFlagInSessionStorage(false);
          this.getPassesList();
        } else {
          this.toastrService.error(response.header.message);
        }
      }, error => {
        this.showLoadingFlg = false;
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
      });
    }
  }
  /* Method to get pass list for dropdown */
  getPassesDropdown() {
    this._passesService.getPassDropdown(this.manageBidData.projectId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.passesDropdown = response.payload.results;
        this.passDropDownlist = Common.getMultipleSelectArr(this.passesDropdown, ['id'], ['passName']);
      } else {
        this.passDropDownlist = [];
      }
    }, error => {
      this.passDropDownlist = [];
    });

  }
  /* method to search Passes data as per selected parameters in  filters */
  search() {
    let validForm = false;
    const formValues = this.passesFilterForm.value;
    if (formValues.estimateRangeFrom && formValues.estimateRangeTo) {
      $('.redcolor').addClass('red');
      // tslint:disable-next-line:radix
      if (parseInt(formValues.estimateRangeFrom) < parseInt(formValues.estimateRangeTo)) {
        validForm = true;
        $('.redcolor').removeClass('red');
      }
    } else {
      $('.redcolor').addClass('red');
    }

    if (!formValues.estimateRangeFrom || !formValues.estimateRangeTo) {
      validForm = true;
      $('.redcolor').removeClass('red');
    }
    if (validForm) {
      this.isSearchClicked = true;
      this.showTableLoadingFlg = true;
      this.passesList = [];
      this.setdefaultPage();
      this.getPassesList();
    }

  }

  /* Method to get translated dropdown values */
  getDropdownValues() {
    this.PASSES_STATUS_CONST = Common.changeDropDownValues(this.translateService, PASSES_STATUS_CONST);
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.approvalStatusModal.hide();
      this.rejectModal.hide();
    }
    if (event.key === 'Enter') {
      this.search();
    }
  }
  /*method to set common labels from language jsons*/
  translateFunc() {
    this.translateService.get('common').subscribe(res => {
      this.common = res;
    });

  }
  /* method to clear filters */
  clear() {
    this.showTableLoadingFlg = true;
    this.isSearchClicked = false;
    this.passesFilterForm.reset();
    this.passesList = [];
    this.getPassesList();
    $('.redcolor').removeClass('red');

  }
  /* method to  navigate to particular page */
  navigateTo(setPassDetailsFlag: Boolean = false, passDetails, canEditFlag: Boolean = false) {
    let finalUrl = Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.bidAicp, [this.manageBidData.projectId]);
    if (setPassDetailsFlag) {
      this.manageBidData.passDetails['passId'] = passDetails.id;
      this.manageBidData.passDetails['status'] = passDetails.status;
      this.manageBidData.passDetails['passName'] = passDetails.pass;
      this.manageBidData.passDetails['onlyView'] = !canEditFlag;
      finalUrl += "/" + passDetails.id;
    }
    this.router.navigate([finalUrl]);
  }
  /**
  /*method to edit existing pass
  @param setPassDetailsFlag  as boolean to set pass details or not
  @param passDetails  as pass object
  @param allowToCreatePass  as boolean to create pass or not
  */
  editPass(setPassDetailsFlag: Boolean = false, passDetails, allowToCreatePass: Boolean) {
    if (allowToCreatePass) {
      this.manageBidData.disableProjectInputs = false;
      this.manageBidData.setDisableProjectInputsFlagInSessionStorage(false);
      this.navigateTo(setPassDetailsFlag, passDetails, true);
    }

  }
  /* method to set default page to 1 */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
  }
  /*method to create passes filter form */
  createForm() {
    this.passesFilterForm = this.fb.group({
      passNumber: [''],
      status: [''],
      estimateRangeFrom: [''],
      estimateRangeTo: [''],
      daterange: ['']
    });
  }
  /**
  /*method to open rejection reason modal
  @param rejectionReason  as string to set rejection reason
  */
  openRejectionModal(rejectionReason) {
    this.rejectionReason = rejectionReason;
    this.rejectModal.show();
  }
  /**
  /*method to open approval status modal
  @param pass  as object to get pass details 
  */
  openApprovalModal(pass) {
    this.approvalHierarchyArr = pass.approvalList;
    if (this.approvalHierarchyArr && this.approvalHierarchyArr.length > 0) {
      for (let index = 0; index < this.approvalHierarchyArr.length; index++) {
        const tempDetails = this.approvalHierarchyArr[index];
        if (index) {
          tempDetails['percent'] = this.getLengthStyle(this.approvalHierarchyArr.length, index);
        } else {
          tempDetails['percent'] = 0;
        }
      }
      this.approvalStatusModal.show();
    }
  }
  /**
  /*method to open convert to  project modal
  @param pass  as object to get pass details 
  */
  openConvertToProjectPopUp(pass) {
    let swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.convertToProjectAlertMessage, true, true, this.biddingsLabelsObj.labels.yes, this.biddingsLabelsObj.labels.no);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this.checkProjectAlreadyExistsOrNot(pass);
      }
    });
  }
  /**
  /*method to navigate to approval hierarchy tab
  */
  navigateToApprovalHierarchy() {
    this.navigationService.navigate([Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.manageBidApprovalHierarchy, [this.manageBidData.projectId])]);
  }
  /**
  /*method to check project name already exists or not
  @param pass  as object to get pass details 
  */
  checkProjectAlreadyExistsOrNot(pass) {
    this._passesService.checkProjectAlreadyExistsOrNot(this.manageBidData.projectId, pass.id).subscribe((responseData: any) => {
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.convertPassToProject(pass);
      } else if (responseData.header.statusCode === ERROR_CODES.duplicate_entry) {
        let swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.projectNameAlreadyExistsMsg, true, true, this.biddingsLabelsObj.labels.yes, this.biddingsLabelsObj.labels.no);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.convertPassToProject(pass);
          }
        });
      } else {
        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
      });
  }
  /**
  /*method to convert deal into project 
  @param pass  as object to get pass details 
  */
  convertPassToProject(pass) {
    this._passesService.convertToProject(this.manageBidData.projectId, pass.id).subscribe((responseData: any) => {
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.manageBidData.disableProjectInputs = true;
        this.manageBidData.serviceDisableProjectInputsFlag = true;
        this.manageBidData.setDisableProjectInputsFlagInSessionStorage(true);
        this.getPassesList();
        this.toastrService.success(responseData.header.message);
      } else if (responseData.header.statusCode === ERROR_CODES.approvalHierarchyNotSet) {
        let swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.approvalHierarchyAlertMessage, true, true, this.biddingsLabelsObj.labels.yes, this.biddingsLabelsObj.labels.no);
        swal(swalObj, (isConfirm) => {
          if (isConfirm) {
            this.navigateToApprovalHierarchy();
          }
        });
      } else {
        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
      });

  }
  /**
  /*method to get lenth of approval status progress bar
  @param length  as number to get approval list length
  @param index  as number index of approver obj
  */
  getLengthStyle(length, index) {
    const val = 100 / (length - 1);
    const percent = val * index;
    return percent;
  }
  ngOnDestroy() {
    this.triggerService.clearEvent();
  }
}

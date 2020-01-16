import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { Ng2DataTableMethods, Common, SessionService, TriggerService } from '../../../../../../common';
import {
  ROUTER_LINKS_FULL_PATH, ADVANCES_FOR_TYPE, ADVANCES_STATUS_CONST, CustomTableConfig, ADVANCES_STATUS_FLAG, ADVANCES_FOR_CONST,
  defaultDateRangepickerOptions, EVENT_TYPES, CURRENCY_CONVERSION_CONST, UI_ACCESS_PERMISSION_CONST,
  LOCAL_STORAGE_CONSTANTS, SETTLEMENT_STATUS, ROLES_CONST, ROUTER_LINKS
} from '../../../../../../config';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SharedData } from '../../../../../../shared/shared.data';
import { IMyDrpOptions } from 'mydaterangepicker';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdvancesService } from './list-advances.services';
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../projects.data';
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-list-advances',
  templateUrl: './list-advances.component.html',
  styleUrls: ['./list-advances.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ListAdvancesComponent implements OnInit {
  isSearchClicked:boolean=false;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  ADVANCES_STATUS_CONST = ADVANCES_STATUS_CONST;
  ADVANCES_STATUS_FLAG = ADVANCES_STATUS_FLAG;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  ADVANCES_FOR_TYPE =JSON.parse(JSON.stringify(ADVANCES_FOR_TYPE));
  showLoadingFlg: boolean = false;
  purchaseOrders: any = [];
  commonObj: any;
  selectedAdvances: any = [];
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  advancesFilterForm: FormGroup;
  settleAdvancesForm: FormGroup;
  advancesArray: FormArray;
  checkAllFlag: boolean = false;
  disableSettleButton: boolean = true;
  disableCheckAll: boolean = true;
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
  hideAddAdvancesFlag: boolean = false;
  hideSettleAdvancesFlag: boolean = false;
  advancesList: any;
  totalItems: any;
  checkedAdvancesArr: any;
  projectID: any;
  checkAdvances: FormGroup;
  confirmationessMsg: any;
  warningMsg: any;
  deleteMsg: any;
  cancelMsg: any;
  errMsg: string;
  alreadySelectedId: any;
  tempArr: any = [{
    pageNo: this.currentPage,
    checkedIndex: []
  }];
  settlementStatusKeyArr: any = [];
  subscription: any;
  currentCurrencyObj: any;
  targetUnit: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _advancesService: AdvancesService,
    private sessionlocalstorage: SessionService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private projectsData:ProjectsData,
    private triggerService: TriggerService
  ) {

  }

  ngOnInit() {
    Common.scrollTOTop();
    this.ADVANCES_FOR_TYPE.splice(2,1);
    this.projectID = this.projectsData.projectId;
    this.createAddForm();
    this.getAdvancesList(false);
    this.translateFunc();
    this.setPermissionsDetails();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type == EVENT_TYPES.currencyEvent)) {
          let currency = data.event.currentValue;
          this.currentCurrencyObj = data.event.currentValue;
          this.targetUnit = currency.targetUnit ? currency.targetUnit : 1;
        
          // this.getProjectDetails();
        }
      }
    });
    this.settlementStatusKeyArr = Common.keyValueDropdownArr(SETTLEMENT_STATUS, 'id','text');

  }

  checkboxes: any;
  //set module permission details
  setPermissionsDetails() {
    var permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];

    var modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
      if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj['removeActions'] && this.uiAccessPermissionsObj['removeActions']['addAdvance']) {
        this.hideAddAdvancesFlag = true;
      }
      if (this.uiAccessPermissionsObj && this.uiAccessPermissionsObj['removeActions'] && this.uiAccessPermissionsObj['removeActions']['settleAdvance']) {
        this.hideSettleAdvancesFlag = true;
      }

    }
  }

  createAddForm() {
    this.advancesFilterForm = this.advancesFilterFormGroup();
    this.settleAdvancesForm = this.settleAdvancesFormGroup();

  }

  advancesFilterFormGroup(): FormGroup {
    return this.fb.group({
      type: [''],
      name: [''],
      status: [''],
      dateRange: ['']
    })
  }

  settleAdvancesFormGroup(): FormGroup {
    return this.fb.group({
      //   checkAll: [''],
      advancesArr: this.fb.array([])
    })
  }

  createAdvancesGroup() {
    return this.fb.group({
      id: [''],
      advanceUserId: [''],
      checkAdvances: [''],
      advancesFor: [''],
      name: [''],
      amount: [''],
      totalAmountUsd: [''],
      cancelStatus: [''],
      paymentDate: [''],
      canCancel: [''],
      canEdit: [''],
      approvalStatus: [''],
      approverName: [''],
      ownAdvance: [''],
      settlementStatus:['']
    })
  }

  addAdvances() {
    this.advancesArray = <FormArray>this.settleAdvancesForm.controls['advancesArr'];
    this.advancesArray.push(this.createAdvancesGroup());
  }

  checkAll() {
    if (this.settleAdvancesForm.controls['checkAll'].value) {
      for (let i = 0; i < this.advancesArray.length; i++) {
        this.advancesArray.controls[i].patchValue({
          "checkAdvances": true,
        })
      }
    }
    else {
      for (let i = 0; i < this.advancesArray.length; i++) {
        this.advancesArray.controls[i].patchValue({
          "checkAdvances": false,
        })
      }
    }
  }

  /* Unique checkbox selection and maintain checkbox state on pagination */
  checkSettlementAdvances(data, index) {
    if (!this.alreadySelectedId) {
      this.alreadySelectedId = data.value.advanceUserId;
    }

    if (this.alreadySelectedId != data.value.advanceUserId) {
      swal("Message", this.commonObj.errorMessages.differentUsersError);
      this.advancesArray.controls[index].patchValue({
        "checkAdvances": false,
      });
    } else {
      if (!this.settleAdvancesForm.value.advancesArr[index].checkAdvances) {
        for (let i = 0; i < this.tempArr.length; i++) {
          if (this.currentPage == this.tempArr[i].pageNo) {
            for (let j = 0; j < this.tempArr[i].checkedIndex.length; j++) {
              if (this.tempArr[i].checkedIndex[j] == index) {
                this.tempArr[i].checkedIndex.splice(j, 1);
              }
            }

          }
        }
        let checkAdvance = _.find(this.settleAdvancesForm.value.advancesArr, { 'checkAdvances': true });
        if (!checkAdvance) {
          this.alreadySelectedId = "";
        }
      } else {
        for (let i = 0; i < this.tempArr.length; i++) {
          if (this.currentPage == this.tempArr[i].pageNo) {
            this.tempArr[i].checkedIndex.push(index);

          }
        }

      }
    }


    // this.disableSettleButton = true;
    // this.checkAllFlag = true;
    // this.tempArr.push({ 'advance': data.value.id });
    // let checkAdvance = _.find(this.tempArr, { 'advance': data.value.id });
    // if (checkAdvance) {
    //   this.advancesArray.controls[index].patchValue({
    //     "checkAdvances": true,
    //   });
    // } else {
    //   swal("Alert")
    //   this.advancesArray.controls[index].patchValue({
    //     "checkAdvances": false,
    //   });
    // }
    // for (let i = 0; i < this.advancesArray.value.length; i++) {
    //   if (data.value.id != this.advancesArray.value[i].id) {
    //     swal("alert")
    //     this.advancesArray.controls[i].patchValue({
    //       "checkAdvances": false,
    //     });

    //   }
    //   if (!this.advancesArray.value[i].checkAdvances) {
    //     this.checkAllFlag = false;
    //   }
    // }
    // if (this.checkAllFlag) {
    //   this.settleAdvancesForm.patchValue({
    //     "checkAll": true
    //   });
    // } else {
    //   this.settleAdvancesForm.patchValue({
    //     "checkAll": false
    //   });
    // }

    this.checkedAdvancesArr = this.settleAdvancesForm.value.advancesArr;
    for (let i = 0; i < this.checkedAdvancesArr.length; i++) {
      if (this.checkedAdvancesArr[i].checkAdvances) {
        this.disableSettleButton = false;
      }
    }
  }
  /* Unique checkbox selection and maintain checkbox state on pagination */

  /*Search filter params*/
  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    params = params.append('projectId', this.projectID);
    if (this.advancesFilterForm && this.isSearchClicked) {
      var formValues = this.advancesFilterForm.value;
      params = params.append('type', formValues.type);

      if (formValues.name) {
        params = params.append('name', formValues.name);
      }

      if (formValues.status && formValues.status != "-1") {
        params = params.append('status', formValues.status);
      }

      if (formValues.dateRange) {
        let daterange = this.advancesFilterForm.controls['dateRange'].value;
        let dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('fromDate', dobObj['fromDate']);
      }

      if (formValues.dateRange) {
        let daterange = this.advancesFilterForm.controls['dateRange'].value;
        let dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('toDate', dobObj['toDate']);
      }
    }

    return params;
  }
  /*Search filter params*/

  /*List form array creation*/
  getAdvancesList(flag) {
    this.showLoadingFlg = true;
    this.isSearchClicked = true;
    this.advancesArray = <FormArray>this.settleAdvancesForm.controls['advancesArr'];
    this.advancesArray.controls = [];
    this._advancesService.getAdvncesData(this.getSearchQueryParam()).subscribe((response: any) => {
      this.showLoadingFlg = false;
      this.isSearchClicked = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {

        if (response.payload && response.payload.results) {
          this.advancesArray.controls = [];
          this.advancesList = response.payload.results;
          this.totalItems = response.payload.totalItems;
          for (let i = 0; i < this.advancesList.length; i++) {
            this.addAdvances();
            this.advancesArray.controls[i].patchValue({
              "id": this.advancesList[i].id ? this.advancesList[i].id : "",
              "advanceUserId": this.advancesList[i].advanceUserId ? this.advancesList[i].advanceUserId : "",
              "advancesFor": this.advancesList[i].advancesFor || this.advancesList[i].advancesFor == 0 ? this.advancesList[i].advancesFor : "",
              "checkAdvances": false,
              "name": this.advancesList[i].i18n ? this.advancesList[i].i18n.name : "",
              "amount": this.advancesList[i].amount ? this.advancesList[i].amount : "",
              "totalAmountUsd": this.advancesList[i].defaultCurrencyAmount ? this.advancesList[i].defaultCurrencyAmount : 0,
              "approvalStatus": this.advancesList[i].approvals.status || this.advancesList[i].approvals.status == 0 ? this.advancesList[i].approvals.status : "",
              "cancelStatus": this.advancesList[i].status || this.advancesList[i].status == 0 ? this.advancesList[i].status : "",
              "paymentDate": this.advancesList[i].paymentDate ? this.advancesList[i].paymentDate : "",
              "canCancel": this.advancesList[i].canCancel ? this.advancesList[i].canCancel : "",
              "canEdit": this.advancesList[i].canEdit ? this.advancesList[i].canEdit : "",
              "approverName": this.advancesList[i].approvals.approverRoleName || this.advancesList[i].approvals.approverRoleName == 0 ? this.advancesList[i].approvals.approverRoleName : "",
              "ownAdvance": this.advancesList[i].ownAdvance ? this.advancesList[i].ownAdvance : false,
              "settlementStatus":(this.advancesList[i].settlementStatus || this.advancesList[i].settlementStatus == 0) ? this.advancesList[i].settlementStatus : 0,
            });

            if (!this.advancesList[i].canSettle) {
              this.checkAdvances = <FormGroup>this.advancesArray.controls[i];
              this.checkAdvances.controls['checkAdvances'].disable();
              //this.settleAdvancesForm.controls['checkAll'].disable();
            }
          }
          if (flag) {
            for (let i = 0; i < this.tempArr.length; i++) {
              if (this.currentPage == this.tempArr[i].pageNo) {
                for (let j = 0; j < this.tempArr[i].checkedIndex.length; j++) {
                  this.advancesArray.controls[this.tempArr[i].checkedIndex[j]].patchValue({
                    "checkAdvances": true
                  })
                }
              }
            }

          }
        } else {
          this.advancesList = [];
          this.totalItems = "";
          this.advancesArray = <FormArray>this.settleAdvancesForm.controls['advancesArr'];
          this.advancesArray.controls = [];
        }
      } else {
        this.advancesList = [];
        this.totalItems = "";
        this.advancesArray = <FormArray>this.settleAdvancesForm.controls['advancesArr'];
        this.advancesArray.controls = [];
      }
    }, error => {
      this.showLoadingFlg = false;
      this.advancesList = [];
      this.totalItems = "";
      this.advancesArray = <FormArray>this.settleAdvancesForm.controls['advancesArr'];
      this.advancesArray.controls = [];
    });
  }
  /*List form array creation*/
  search() {
    this.isSearchClicked = true;
    this.alreadySelectedId = "";
    this.tempArr = [{
      pageNo: this.currentPage,
      checkedIndex: []
    }];
    this.setdefaultPage();
    this.getAdvancesList(false);
  }
  getConvertedValue(usdAmount, amount) {
    let convertedValue = 0;
    if (this.currentCurrencyObj) {
      if (usdAmount) {
        let currentTargetUnit = (this.currentCurrencyObj && this.currentCurrencyObj.targetUnit) ? this.currentCurrencyObj.targetUnit : 1;
        convertedValue = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, usdAmount, currentTargetUnit);
      }
    }
    else {
      convertedValue = amount;
    }
    return convertedValue ? convertedValue.toFixed(2) : 0;;
  }
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    if(!this.isSearchClicked){
      this.advancesFilterForm.reset();
    }
    this.index = 1 + (20 * (this.currentPage - 1));
    let pageData = _.find(this.tempArr, { 'pageNo': event.page });

    if (!pageData) {
      this.tempArr.push({
        pageNo: this.currentPage,
        checkedIndex: []
      })
    }
    this.getAdvancesList(true)
  }
  /*Clear filters*/
  clear() {
    this.isSearchClicked = true;
    this.advancesFilterForm.reset();
    this.advancesFilterForm.patchValue({
      type: "",
      name: "",
      status: "",
      dateRange: ""
    })
    this.setdefaultPage();
    this.getAdvancesList(false);
  }
  /*Clear filters*/

  /*Send advances for settlement*/
  settleAdvances() {
    let checkedAdvances = _.filter(this.settleAdvancesForm.value.advancesArr, { 'checkAdvances': true });
    if (checkedAdvances && checkedAdvances.length > 0) {
      this.selectedAdvances = _.map(checkedAdvances, 'id');
      this.sessionlocalstorage.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.selectedAdvances, JSON.stringify(this.selectedAdvances));
      this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [this.projectID,''])]);
    }
  }
  /*Send advances for settlement*/

  /*Confirmation pop up*/
  translateFunc() {
    this.translateService.get('common.labels.advanceWarningMsg').subscribe((res: string) => {
      this.warningMsg = res;

    });
    this.translateService.get('common.labels.confirmationMsg').subscribe((res: string) => {
      this.confirmationessMsg = res;

    });
    this.translateService.get('common.labels.cancelDeleteAdvance').subscribe((res: string) => {
      this.cancelMsg = res;

    });
    this.translateService.get('common.labels.deleteAdvance').subscribe((res: string) => {
      this.deleteMsg = res;
    });
    this.translateService.get('common.errorMessages.error').subscribe((res: string) => {
      this.errMsg = res;
    });
    this.translateService.get('common').subscribe((res: string) => {
      this.commonObj = res;
    });

  }
  cancleAdvance(advanceID) {
    var swalObj = Common.swalConfirmPopupObj(this.warningMsg, true, true, this.deleteMsg,this.cancelMsg, '',this.confirmationessMsg);

    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this._advancesService.removeAdvance(advanceID).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.alreadySelectedId = "";
            this.tempArr = [{
              pageNo: this.currentPage,
              checkedIndex: []
            }];
            this.getAdvancesList(false);
            this.toastrService.success(response.header.message);
          }
          else {
            this.toastrService.error(this.errMsg);
          }
        }, error => {
          this.toastrService.error(this.errMsg);
        });

      } else {


      }
    });
  }
  /*Confirmation pop up*/

  /*Add screen redirection*/
  navigateTo(url) {
    this.router.navigate([Common.sprintf(url, [this.projectID,''])]);
  }
  /*Add screen redirection*/

  /*Edit screen redirection*/
  editAdvance(advanceId, advancesFor) {
    switch (advancesFor) {
      case ADVANCES_FOR_CONST.freelancer:
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageFreelancerAdvance, [this.projectID, advanceId])]);
        break;
      case ADVANCES_FOR_CONST.vendor:
        this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageVendorAdvance, [this.projectID, advanceId])]);
        break;
    }
  }
  /*Edit screen redirection*/
}

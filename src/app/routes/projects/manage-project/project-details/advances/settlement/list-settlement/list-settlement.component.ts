import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../../../../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpRequest } from '../../../../../../../common';
import { SharedData } from '../../../../../../../shared/shared.data';
import { ROUTER_LINKS_FULL_PATH, CustomTableConfig, SETTLEMENT_TYPE, SETTLEMENT_STATUS, CURRENCY_CONVERSION_CONST, EVENT_TYPES, defaultDateRangepickerOptions, UI_ACCESS_PERMISSION_CONST } from '../../../../../../../config';
import { Ng2DataTableMethods, Common, NavigationService, TriggerService } from '../../../../../../../common';
import { SettlementListService } from "./list-settlement.service";
import { Subscription } from 'rxjs/Subscription';
import { IMyDrpOptions } from 'mydaterangepicker';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../../../../../projects.data';

const swal = require('sweetalert');

declare var $: any;
@Component({
  selector: 'app-list-settlement',
  templateUrl: './list-settlement.component.html',
  styleUrls: ['./list-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListSettlementComponent implements OnInit {
  isSearchClicked: boolean =false;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  // SETTLEMENT_TYPE = SETTLEMENT_TYPE;
  // SETTLEMENT_STATUS =JSON.parse(JSON.stringify(SETTLEMENT_STATUS));
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  settlementFilterForm: FormGroup;
  public maxSize: any = 5;
  public numPages: any = 1;
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: any = CustomTableConfig.pageSize;
  index: any = 1;
  subscription: Subscription;
  public page: any = 1;
  showLoadingFlg: boolean = false;
  settlementList: any = [];
  totalItems: any;
  projectId: any;
  targetUnit: any = 1;
  currentCurrencyObj: any;
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  commonLabels: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  SETTLEMENT_TYPE: { id: number; text: string; }[];
  SETTLEMENT_STATUS: { id: number; text: string; }[];
  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private _sharedService: SharedService,
    private _settlementlist: SettlementListService,
    private fb: FormBuilder,
    public http: HttpRequest,
    private sharedData: SharedData,
    private projectsData:ProjectsData,
    private translateService: TranslateService,
    private triggerService: TriggerService) { }

  ngOnDestroy() {
    $("#settlement-tab").removeClass("active");
    $("#advances-tab").addClass("active");
    this.subscription.unsubscribe();
    this.currentCurrencyObj = {};
  }

  ngOnInit() {
    this.getDropdownValues();
    Common.scrollTOTop();
    this.SETTLEMENT_STATUS.splice(4,1);
    $("#settlement-tab").addClass("active");
    $("#advances-tab").removeClass("active");
    this.projectId = this.projectsData.projectId;
    this.setPermissionsDetails();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type == EVENT_TYPES.currencyEvent)) {
          let currency = data.event.currentValue;
          this.currentCurrencyObj = data.event.currentValue;
          this.targetUnit = currency.targetUnit ? currency.targetUnit : 1;
          // this.getProjectDetails();
        }
      }
    })
    this.settlementFilterForm = this.fb.group({
      type: [''],
      name: [''],
      status: [''],
      dateRange: [''],
    });

    this.getListSettlements();
  }
    getDropdownValues() {
      this.SETTLEMENT_TYPE = Common.changeDropDownValues(this.translateService, SETTLEMENT_TYPE);
      this.SETTLEMENT_STATUS = Common.changeDropDownValues(this.translateService, SETTLEMENT_STATUS);
    }

  navigateTo(id) {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [id])]);
  }
  //set module permission details
  setPermissionsDetails() {
    var permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];

    var modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  editSettlement(id) {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [id])])
  }

  getSearchQueryParam() {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    params = params.append('projectId', this.projectId);
    //let params1: URLSearchParams = new URLSearchParams();

    var queryParamObj = {};
    // var startDate = $('#dateRange').data('daterangepicker').startDate._d;
    //   var endDate = $('#dateRange').data('daterangepicker').endDate._d;
    if (this.settlementFilterForm  && this.isSearchClicked) {
      var formValues = this.settlementFilterForm.value;
      // if (formValues.type) {
      params = params.append('type', formValues.type);
      // }

      if (formValues.name) {
        params = params.append('name', formValues.name);
      }

      if (formValues.status && !(formValues.status == -1)) {
        params = params.append('status', formValues.status);
      }

      if (formValues.dateRange) {
        let daterange = this.settlementFilterForm.controls['dateRange'].value;
        let dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('fromDate', dobObj['fromDate']);
      }

      if (formValues.dateRange) {
        let daterange = this.settlementFilterForm.controls['dateRange'].value;
        let dobObj = Common.setOffsetToUTCMyRangeDatePicker(daterange);
        params = params.append('toDate', dobObj['toDate']);
      }
    }
    return params;
  }

  clear() {
    this.isSearchClicked = true;
    this.settlementFilterForm.reset();
    this.settlementFilterForm.patchValue({
      type: "",
      name: "",
      status: "",
      dateRange: "",
    })
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
    this.getListSettlements();
  }

  search() {
    this.isSearchClicked = true;
    this.setdefaultPage();
    this.getListSettlements();
  }
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
  }
  getConvertedValue(usdAmount, amount) {

    let convertedValue = 0;
    if (this.currentCurrencyObj) {
      if (usdAmount) {
        const currentTargetUnit = (this.currentCurrencyObj && this.currentCurrencyObj.targetUnit) ? this.currentCurrencyObj.targetUnit : 1;
        convertedValue = Common.convertValue(CURRENCY_CONVERSION_CONST.defaultToOthers, usdAmount, currentTargetUnit);
      }
    }
    else {
      convertedValue = amount;
    }
    return convertedValue ? convertedValue.toFixed(2) : 0;
  }
  getListSettlements() {
    this.isSearchClicked = true;
    this.showLoadingFlg = true;
    this._settlementlist.getSettlementList(this.getSearchQueryParam()).subscribe((response: any) => {
      this.showLoadingFlg = false;
      this.isSearchClicked = false;
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.settlementList = response.payload.results;
          this.totalItems = response.payload.totalItems;
        } else {
          this.settlementList = [];
          this.totalItems = 0;
        }
      } else {
        this.settlementList = [];
        this.totalItems = 0;
      }
    }, error => {
      this.showLoadingFlg = false;
      this.settlementList = [];
      this.totalItems = 0;
    },
    );
  }

  deleteSettlement(settlement) {
    const textMsg = this.commonLabels.errorMessages.notRecoverSettlement;
    const swalObj = Common.swalConfirmPopupObj(textMsg, true, true, this.commonLabels.labels.delete, this.commonLabels.labels.cancelDelete, '', this.commonLabels.labels.confirmationMsg);

    swal(swalObj, (isConfirm) => {
      if (isConfirm) {
        this._settlementlist.deleteSettlement(settlement.id).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            this.getListSettlements();
            this.toastrService.success(response.header.message);
          }
          else {
            this.toastrService.error(this.commonLabels.errorMessages.error);
          }
        },
          error => {
            this.toastrService.error(this.commonLabels.errorMessages.error);
          }
        );
      } else {
      }
    });
  }

  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    if (!this.isSearchClicked) {
      this.settlementFilterForm.reset();
    }
    this.getListSettlements();
  }


}

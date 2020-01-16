import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../../../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';
import { HttpRequest } from '../../../../../../common';
import { SharedData } from '../../../../../../shared/shared.data';
import { ROUTER_LINKS, CustomTableConfig, CURRENCY_CONVERSION_CONST, EVENT_TYPES, defaultDateRangepickerOptions, UI_ACCESS_PERMISSION_CONST, ROUTER_LINKS_FULL_PATH, ACTION_TYPES } from '../../../../../../config';
import { Common, NavigationService, TriggerService } from '../../../../../../common';
import { ListSettlementService } from "./list-settlement.service";
import { Subscription } from 'rxjs/Subscription';
import { IMyDrpOptions } from 'mydaterangepicker';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../../../../projects.data';
import { SETTLEMENT_STATUS_CONST, SETTLEMENT_FOR_TYPE_CONST, SETTLEMENT_APPROVAL_CONST } from '../settlement.constants';
import { ManageSettlementListData } from './list-settlement.data.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const swal = require('sweetalert');

declare var $: any;
@Component({
  selector: 'app-list-settlement',
  templateUrl: './list-settlement.component.html',
  styleUrls: ['./list-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListSettlementComponent implements OnInit, AfterViewInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  @ViewChild('approvalStatusModal') public approvalStatusModal: ModalDirective;
  isSearchClicked: Boolean = false;
  ROUTER_LINKS = ROUTER_LINKS;
  // SETTLEMENT_FOR_TYPE_CONST =SETTLEMENT_FOR_TYPE_CONST;
  SETTLEMENT_STATUS_CONST = JSON.parse(JSON.stringify(SETTLEMENT_STATUS_CONST));
  SETTLEMENT_APPROVAL_CONST = SETTLEMENT_APPROVAL_CONST;
  statusKeyArr: any = Common.keyValueDropdownArr(SETTLEMENT_STATUS_CONST, 'id', 'text');
  typeKeyArr: any = Common.keyValueDropdownArr(SETTLEMENT_FOR_TYPE_CONST, 'id', 'text');
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  settlementFilterForm: FormGroup;
  public searchSupplierName = new BehaviorSubject<string>('');
  supplierNameSubscription: Subscription;
  public maxSize: any = 5;
  public numPages: any = 1;
  currentPage: any = CustomTableConfig.pageNumber;
  isLoadingSupplierName: Boolean = false;
  itemsPerPage: any = CustomTableConfig.pageSize;
  index: any = 1;
  supplierDropDown: any = [];
  subscription: Subscription;
  public page: any = 1;
  showLoadingFlg: Boolean = false;
  totalItems: any;
  projectId: any;
  currentCurrencyObj: any;
  permissionObj: any = {};
  approvalHierarchyArr: any = [];
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  commonLabels: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  settlementList: any;
  settlementListDataObj: any = {
    all: {},
    draft: {},
    pending: {},
    settled: {},
    rejected: {},
    cancelled: {}
  };
  statusType: any = '';
  budgetLineList: any = [];
  SETTLEMENT_FOR_TYPE_CONST: { id: number; text: string; }[];
  budgetId: any;
  supplierDropDownArr: any;
  SETTLEMENT_LIST_QUERY_PARAMS = {
    'name': 'name'
  };
  ACTION_TYPES=ACTION_TYPES;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize contsructor after declaration of all variables*/
  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private _sharedService: SharedService,
    private _settlementlist: ListSettlementService,
    private fb: FormBuilder,
    public http: HttpRequest,
    private sharedData: SharedData,
    private projectsData: ProjectsData,
    private translateService: TranslateService,
    private triggerService: TriggerService) { }

  /*inicialize contsructor after declaration of all variables*/
  ngOnInit() {
    this.getDropdownValues();
    Common.scrollTOTop();
    this.SETTLEMENT_STATUS_CONST.splice(4, 1);
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setPermissionsDetails();
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabels = res;
    });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type == EVENT_TYPES.currencyEvent)) {
          const currency = data.event.currentValue;
          this.currentCurrencyObj = data.event.currentValue;
        }
      }
    });

    this.createSettlementForm();
    this.getAllSettlements([SETTLEMENT_APPROVAL_CONST.draft,
    SETTLEMENT_APPROVAL_CONST.pending,
    SETTLEMENT_APPROVAL_CONST.settled,
    SETTLEMENT_APPROVAL_CONST.rejected]);
    this.setEventType({ type: EVENT_TYPES.currencyResetEvent, prevValue: {}, currentValue: true });
    this.detectChangedInput();
    this.getSupplierList();
  }
  getDropdownValues() {
    this.SETTLEMENT_FOR_TYPE_CONST = Common.changeDropDownValues(this.translateService, SETTLEMENT_FOR_TYPE_CONST);
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.approvalStatusModal.hide();
    }
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  }
  ngAfterViewInit() {
    $('.nav-link_0').addClass('active');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
    if (this.supplierNameSubscription) {
      this.supplierNameSubscription.unsubscribe();
    }
    this.currentCurrencyObj = {};
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /*all life cycle events whichever required after inicialization of constructor*/
  getAllSettlements(statusArr) {
    this.getListSettlements(SETTLEMENT_APPROVAL_CONST.all, (this.statusType === SETTLEMENT_APPROVAL_CONST.all ? true : false));
    this.getListSettlements(SETTLEMENT_APPROVAL_CONST.cancelled, (this.statusType === SETTLEMENT_APPROVAL_CONST.cancelled ? true : false));
    if (statusArr.includes(SETTLEMENT_APPROVAL_CONST.draft)) {
      this.getListSettlements(SETTLEMENT_APPROVAL_CONST.draft, (this.statusType === SETTLEMENT_APPROVAL_CONST.draft ? true : false));
    }
    if (statusArr.includes(SETTLEMENT_APPROVAL_CONST.pending)) {
      this.getListSettlements(SETTLEMENT_APPROVAL_CONST.pending, (this.statusType === SETTLEMENT_APPROVAL_CONST.pending ? true : false));
    }
    if (statusArr.includes(SETTLEMENT_APPROVAL_CONST.settled)) {
      this.getListSettlements(SETTLEMENT_APPROVAL_CONST.settled, (this.statusType === SETTLEMENT_APPROVAL_CONST.settled ? true : false));
    }
    if (statusArr.includes(SETTLEMENT_APPROVAL_CONST.rejected)) {
      this.getListSettlements(SETTLEMENT_APPROVAL_CONST.rejected, (this.statusType === SETTLEMENT_APPROVAL_CONST.rejected ? true : false));
    }
  }

  detectChangedInput() {
    this.supplierNameSubscription = this.searchSupplierName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getSupplierList(str));
  }

  /**
* It gets supplier search query parameters from the filter form and returns it.
*/
  getSupplierQueryParam(searchStr) {
    let params: HttpParams = new HttpParams();
    searchStr = searchStr.trim();
    if (searchStr) {
      params = params.append(this.SETTLEMENT_LIST_QUERY_PARAMS.name, searchStr.toString());
    }
    return params;
  }
  /**
* Get supplier drpdown list
*/
  getSupplierList(searchStr = '') {
    if (searchStr) {
      searchStr = searchStr.trim();
    }
    this.isLoadingSupplierName = true;
    this.supplierDropDown = [];
    this.supplierDropDownArr = [];

    this._settlementlist.getSuppliers(this.getSupplierQueryParam(searchStr)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.supplierDropDownArr = response.payload.results;
        this.supplierDropDown = Common.getMultipleSelectArr(this.supplierDropDownArr, ['id'], ['i18n', 'displayName']);
        this.isLoadingSupplierName = false;
      } else {
        this.supplierDropDown = [];
        this.supplierDropDownArr = [];
        this.isLoadingSupplierName = false;
      }
    }, error => {
      this.supplierDropDown = [];
      this.supplierDropDownArr = [];
    });

  }
  /**
      *method to update current tab data
      @param status as number for getting PO status
      */
  updateCurrentTabData(status) {
    let obj = this.getSettlementData(status)
    this.settlementList = obj.data;
    this.totalItems = obj.totalItems;
    this.currentPage = obj.currentPage;
  }
  /**
   *method to naviagte in between PO tabs
   @param event as object to get target  element
   @param statusType as PO status as per selected tab
   */
  showSettlements(event, statusType = '') {
    window.scrollTo(0, 0);
    this.statusType = statusType;
    $(event.target).parents('ul').find('.nav-link').removeClass('active');
    $(event.target).addClass('active');
    let dataObj = this.getSettlementData(statusType);
    setTimeout(() => { this.currentPage = CustomTableConfig.pageNumber; }, 0);
    if (dataObj.currentPage != CustomTableConfig.pageNumber) {
      this.settlementList = [];
      this.getListSettlements(statusType, true);
    }
    else {
      this.settlementList = dataObj.data;
      this.totalItems = dataObj.totalItems;
    }
  }
  createSettlementForm() {
    this.settlementFilterForm = this.fb.group({
      poNumber: [''],
      type: [''],
      supplierName: [''],
      budgetLine: [''],
      dateRange: [''],
    });
  }

  /**
  *method to get PO data as per selected status
  @param status number as po status
  @return dataObj as object of PO data,totalItems,currentPage as per selected status
  */
  getSettlementData(status) {
    let dataObj = {
      data: [],
      totalItems: 0,
      currentPage: 1
    }
    switch (status) {
      case SETTLEMENT_APPROVAL_CONST.draft:
        dataObj.data = this.settlementListDataObj.draft.data;
        dataObj.totalItems = this.settlementListDataObj.draft.totalItems;
        dataObj.currentPage = this.settlementListDataObj.draft.currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.pending:
        dataObj.data = this.settlementListDataObj.pending.data;
        dataObj.totalItems = this.settlementListDataObj.pending.totalItems;
        dataObj.currentPage = this.settlementListDataObj.pending.currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.settled:
        dataObj.data = this.settlementListDataObj.settled.data;
        dataObj.totalItems = this.settlementListDataObj.settled.totalItems;
        dataObj.currentPage = this.settlementListDataObj.settled.currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.rejected:
        dataObj.data = this.settlementListDataObj.rejected.data;
        dataObj.totalItems = this.settlementListDataObj.rejected.totalItems;
        dataObj.currentPage = this.settlementListDataObj.rejected.currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.cancelled:
        dataObj.data = this.settlementListDataObj.cancelled.data;
        dataObj.totalItems = this.settlementListDataObj.cancelled.totalItems;
        dataObj.currentPage = this.settlementListDataObj.cancelled.currentPage;
        break;
      default:
        dataObj.data = this.settlementListDataObj.all.data;
        dataObj.totalItems = this.settlementListDataObj.all.totalItems;
        dataObj.currentPage = this.settlementListDataObj.all.currentPage;
        break;
    }
    return dataObj;
  }

  /**
  *method to get PO data as per selected status
  @param status number as po status
  @param data as object of PO data,totalItems,currentPage as per selected status
  @param totalItems  as number for getting total number of POs
  @param currentPage  as number for tracking current page for selected tab
  */
  setSettlementData(status, data, totalItems, currentPage) {
    switch (status) {
      case SETTLEMENT_APPROVAL_CONST.draft:
        this.settlementListDataObj.draft.data = data;
        this.settlementListDataObj.draft.totalItems = totalItems;
        this.settlementListDataObj.draft.currentPage = currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.pending:
        this.settlementListDataObj.pending.data = data;
        this.settlementListDataObj.pending.totalItems = totalItems;
        this.settlementListDataObj.pending.currentPage = currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.settled:
        this.settlementListDataObj.settled.data = data;
        this.settlementListDataObj.settled.totalItems = totalItems;
        this.settlementListDataObj.settled.currentPage = currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.rejected:
        this.settlementListDataObj.rejected.data = data;
        this.settlementListDataObj.rejected.totalItems = totalItems;
        this.settlementListDataObj.rejected.currentPage = currentPage;
        break;
      case SETTLEMENT_APPROVAL_CONST.cancelled:
        this.settlementListDataObj.cancelled.data = data;
        this.settlementListDataObj.cancelled.totalItems = totalItems;
        this.settlementListDataObj.cancelled.currentPage = currentPage;
        break;
      default:
        this.settlementListDataObj.all.data = data;
        this.settlementListDataObj.all.totalItems = totalItems;
        this.settlementListDataObj.all.currentPage = currentPage;
        break;
    }
  }
  navigateTo(link, id) {
    this.router.navigate(['../', link, id], { relativeTo: this.route });
  }
  //set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];

    var modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  editSettlement(settlement) {
    if (settlement.canEdit) {
      const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.manageSettlement, [this.projectId, this.budgetId, settlement.id]);
      this.navigationService.navigate([url], { queryParams: { poId: settlement.purchaseOrderId } });
    }
  }
  viewPO(poId) {
    // this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.viewPO, [poId])]);
    const path = Common.sprintf(ROUTER_LINKS_FULL_PATH.viewPO, [poId]);
    window.open(window.location.origin + path);
  }
  getSearchQueryParam(status) {

    let params: HttpParams = new HttpParams();

    params = params.append('pageSize', this.itemsPerPage.toString());
    params = params.append('pageNo', this.currentPage.toString());
    params = params.append('projectBudgetId', this.budgetId);
    if (status || status == 0) {
      params = params.append('status', status);
    }
    if (this.settlementFilterForm && this.isSearchClicked) {
      var formValues = this.settlementFilterForm.value;
      params = params.append('type', formValues.type);
      if (formValues.poNumber) {
        params = params.append('purchaseOrderNumber', formValues.poNumber.trim());
      }
      if (formValues.supplierName) {
        params = params.append('supplierName', formValues.supplierName.trim());
      }
      // if (formValues.budgetLine) {
      //   params = params.append('budgetLineId', formValues.budgetLine);
      // }
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
      supplierName: "",
      status: "",
      dateRange: "",
      poNumber: ""
    })
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
    this.settlementList = [];
    this.budgetLineList = [];
    this.getSettlementListDetails();
  }

  search() {
    this.isSearchClicked = true;
    this.settlementList = [];
    this.getSettlementListDetails();
  }
  /* method to get po data as per default selection */
  getSettlementListDetails() {
    this.setdefaultPage();
    this.getAllSettlements([SETTLEMENT_APPROVAL_CONST.draft, SETTLEMENT_APPROVAL_CONST.pending, SETTLEMENT_APPROVAL_CONST.settled, SETTLEMENT_APPROVAL_CONST.rejected]);
  }
  /* method to set default page & get po data as per default selection */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
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
    return convertedValue ? convertedValue.toFixed(2) : 0;
  }
  /**
  * Sets Budgetline dropdown
  */
  setBudgetLines(supplierType) {
    if (typeof supplierType === "number") {
      // this.settlementFilterForm.controls["budgetLine"].reset();
      this._sharedService.getAdvancesBudgetLine(this.budgetId, supplierType).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          let budgetLineListData = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(budgetLineListData, ["id"], ["budgetLine"]);
        }
        else {
          this.budgetLineList = [];
          this.toastrService.error(response.header.message);
        }
      },
        error => {
          this.budgetLineList = [];
        });
    }
  }


  getListSettlements(status, canUpdateList: boolean = false) {
    this.isSearchClicked = true;
    this.showLoadingFlg = true;
    this._settlementlist.getSettlementList(this.getSearchQueryParam(status)).subscribe((response: any) => {
      this.isSearchClicked = false;
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let settlementListData = ManageSettlementListData.getSettlementListDetails(response.payload.results);
          this.setSettlementData(status, settlementListData, response.payload.totalItems, this.currentPage);
          if (canUpdateList) {
            this.showLoadingFlg = false;
            this.updateCurrentTabData(status);
          }
        } else {
          this.showLoadingFlg = false;
          this.setSettlementData(status, [], 0, this.currentPage);
        }
      } else {
        this.showLoadingFlg = false;
        this.setSettlementData(status, [], 0, this.currentPage);
      }
    }, error => {
      this.showLoadingFlg = false;
      this.setSettlementData(status, [], 0, this.currentPage);
    },
    );
  }
  /**
   *method to  open approval hierarchy status modal
   @param settlement  as object for getting settlement approvalList data
   */
  openApprovalModal(settlement) {
    if (settlement.status != SETTLEMENT_APPROVAL_CONST.draft) {
      this.approvalHierarchyArr = settlement.approvalList;
      if (this.approvalHierarchyArr && this.approvalHierarchyArr.length > 0) {
        for (let index = 0; index < this.approvalHierarchyArr.length; index++) {
          const tempDetails = this.approvalHierarchyArr[index];
          tempDetails['percent'] = this.getLengthStyle(this.approvalHierarchyArr.length + 1, index + 1);
        }
        this.approvalStatusModal.show();
      }
    }
  }
  /**
  *method to  set the position of elements on approval hierarchy modal
  @param length  as number for getting length of approval hierarchy list
  @param index  as number for getting index of approval hierarchy data
  */
  getLengthStyle(length, index) {

    const val = 100 / (length - 1);

    const percent = val * index;
    return percent;
  }
  deleteSettlement(settlementId, cancelSettlemntFlag, status) {
    if (cancelSettlemntFlag) {
      var textMsg = 'You will not be able to recover this settlement';
      var swalObj = Common.swalConfirmPopupObj(textMsg, true, true, this.commonLabels.labels.yes, this.commonLabels.labels.cancelDelete, '', this.commonLabels.labels.confirmationMsg);

      swal(swalObj, (isConfirm) => {
        if (isConfirm) {

          this._settlementlist.deleteSettlement(settlementId).subscribe((response: any) => {
            if (Common.checkStatusCodeInRange(response.header.statusCode)) {
              this.setdefaultPage();
              this.settlementList = [];
              this.setdefaultPage();
              this.getAllSettlements([status]);
              this.toastrService.success(response.header.message);
            }
            else {
              this.toastrService.error(this.commonLabels.labels.error);
            }
          },
            error => {
              this.toastrService.error(this.commonLabels.labels.error);
            }
          );
        } else {
        }
      });
    }
  }
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    this.showLoadingFlg = true;
    if (!this.isSearchClicked) {
      this.settlementFilterForm.reset();
    }
    this.getListSettlements(this.statusType, true);
  }


}

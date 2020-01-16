import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SharedData } from '@app/shared/shared.data';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Common } from '@app/common';
import { ROUTER_LINKS, ACTION_TYPES, CONTRACT_STATUS, CustomTableConfig, UI_ACCESS_PERMISSION_CONST } from '@app/config';
import { ROUTER_LINKS_TALENT_FULL_PATH } from '../../talent.config';
import { AgencyListService } from './list-agency.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AGENCY_STATUS } from '../../constants';
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-list-agency',
  templateUrl: './list-agency.component.html',
  styleUrls: ['./list-agency.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListAgencyComponent implements OnInit {

  ROUTER_LINKS = ROUTER_LINKS;
  ROUTER_LINKS_TALENT_FULL_PATH = ROUTER_LINKS_TALENT_FULL_PATH;
  UI_ACCESS_PERMISSION_CONST =  UI_ACCESS_PERMISSION_CONST;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  CONTRACT_STATUS = CONTRACT_STATUS;
  agencyListFilterForm: FormGroup;
  searchFlag: Boolean = false;
  permissionArr: any;
  index: any = 1;
  MODULE_ID: any;
  currentPage: any = CustomTableConfig.pageNumber;
  public maxSize: Number = CustomTableConfig.maxSize;
  itemsPerPage: Number = CustomTableConfig.pageSize;
  totalItems: Number = 0;
  showLoaderFlag: Boolean = true;
  commonLabelsObj: any;
  page: Number = 1;
  agencyList: any;
  AGENCY_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'commercialName': 'name',
    'email': 'email',
    'phone': 'phoneNo'
  };
  public categories = [];
  public tableRecordNo: any = 1;

  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  breadcrumbData: any = {
    title: 'talent.agency.labels.agencyList',
    subTitle: 'talent.agency.labels.agencySub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'talent.agency.labels.agencyList',
      link: ''
    }
    ]
  };
  commonLabels: any;

  constructor(
    private sharedData: SharedData,
    private router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private _agencyListService: AgencyListService,
    private toastrService: ToastrService,
    private translateService: TranslateService) {
  }

  ngOnInit() {
    this.setPermissionsDetails();
    this.createForm();
    this.getAgencyList();
    this.translateService.get('common').subscribe(res => {
      this.commonLabels = res;
    });
  }

  /*set action & ui control permissions based on role of logged in agency*/

  setPermissionsDetails() {
    this.permissionArr = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj = this.permissionArr[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
method to navigate to details page of selected agency
  **/
  editAgency(agencyId) {
    this.router.navigate([ROUTER_LINKS_TALENT_FULL_PATH.manageAgency, agencyId]);
  }

  /**
   * Method fetch agency list data from web service
   */
  getAgencyList() {
    this.showLoaderFlag = true;
    this._agencyListService.getAgencyList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.showLoaderFlag = false;
        this.index = 1 + (20 * (this.currentPage - 1));
          this.agencyList = response.payload.results;
          this.totalItems = response.payload.totalItems;
      } else {
        this.showLoaderFlag = false;
        this.agencyList = [];
        this.totalItems = 0;
      }
    }, error => {
      this.showLoaderFlag = false;
      this.agencyList = [];
      this.totalItems = 0;
    });
  }

  /**
   * Changes activation status
   * @param agencyData as agency data
   * @param event as change event
   */
  changeStatus(agencyData, event) {
    this._agencyListService.changeStatus(agencyData.id).subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        this.toastrService.success(response.header.message);
      }
      else {
        this.toastrService.error(response.header.message);
        this.toggleStatusButton(agencyData, event);
      }
    }, (err) => {
      this.toastrService.error(this.commonLabels.errorMessages.error);
      this.toggleStatusButton(agencyData, event);
    });
  }

/**
 * Opens Staus change confirmation pop up
 * @param event as change event
 * @param index as record index
 * @param agencyData as agency data
 */
  openSwapPopUp(event, index, agencyData) {
    let swalObj;
    if (agencyData.status === 1) {
      $(event.target).prop('checked', true);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.disableUserMessage, true, true);
    } else {
      $(event.target).prop('checked', false);
      swalObj = Common.swalConfirmPopupObj(this.commonLabels.labels.enableUserMessage, true, true);
    }
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.agencyList[index].status = agencyData.status === AGENCY_STATUS.enable ? AGENCY_STATUS.disable : AGENCY_STATUS.enable;
          agencyData.status = this.agencyList[index].status;
          this.toggleStatusButton(event, agencyData);
          this.changeStatus(agencyData, event);
        } else {
          this.toggleStatusButton(event, agencyData);
        }
      });
  }
  /**
   * Toggles status button
   * @param agencyData as agency data
   * @param event as cahnge ecvent
   */
  toggleStatusButton(agencyData, event) {
    if (agencyData.status === 1) {
      agencyData.status = AGENCY_STATUS.disable;
      $(event.target).prop('checked', false);
    } else {
      agencyData.status = AGENCY_STATUS.enable;
      $(event.target).prop('checked', true);
    }
  }
  /**
   * Method for pagination functionality
   * @param event as page change event
   */
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.searchFlag) {
      this.agencyListFilterForm.reset();
    }
    this.index = 1 + (20 * (this.currentPage - 1));
    this.getAgencyList();
  }
  /**
  * It creates agency listing filter group form.
  */
  createForm() {
    this.agencyListFilterForm = this.fb.group({
      commercialName: [''],
      email: [''],
      phone: ['']
    });
  }

  /**
   * Lister for enter key click on submit button
   * @param event as key event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();

    }
  }


  /**
 * It gets all search query parameters from the filter form and returns it.
 */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.AGENCY_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.AGENCY_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.searchFlag && this.agencyListFilterForm) {
      const formValues = this.agencyListFilterForm.value;
      if (formValues.commercialName) {
        params = params.append(this.AGENCY_LIST_QUERY_PARAMS.commercialName, formValues.commercialName.trim());
      }
      if (formValues.email) {
        params = params.append(this.AGENCY_LIST_QUERY_PARAMS.email, formValues.email.trim());
      }
      if (formValues.phone) {
        params = params.append(this.AGENCY_LIST_QUERY_PARAMS.phone, formValues.phone.trim());
      }
    }
    return params;
  }
  /**
 * Searches Agency list
 */
  search() {
    this.searchFlag = true;
    this.setdefaultPage();
    this.getAgencyList();
  }

  /**
   * It clears the filter form and sets it to its default values(blankvalues)
   */
  clear() {
    this.searchFlag = false;
    this.agencyListFilterForm.reset();
    this.agencyListFilterForm.patchValue({
      commercialName: '',
      email: '',
      phone: ''
    });
    this.setdefaultPage();
    this.getAgencyList();
  }

  /**
   * Sets page configuration to default
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.page = 1;
    this.index = 1 + (20 * (this.currentPage - 1));
    this.totalItems = 0;
    this.agencyList = [];
  }
}

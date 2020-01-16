import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Common, NavigationService } from '@app/common';
import {ROUTER_LINKS_FULL_PATH, CustomTableConfig } from '@app/config';
import { LeadListService } from './lead-listing.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SharedData } from '../../../../shared/shared.data';
import { LeadListData } from './lead-listing.data.model';
import { ToastrService } from 'ngx-toastr';
import { BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
const swal = require('sweetalert');

@Component({
  selector: 'app-lead-listing',
  templateUrl: './lead-listing.component.html',
  styleUrls: ['./lead-listing.component.scss']
})
export class LeadListingComponent implements OnInit {
  // breadcrumb data
  breadcrumbData: any = {
    title: 'biddings.labels.leads',
    subTitle: 'biddings.labels.leadsListSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.leads',
      link: ''
    }
    ]
  };


  leadList: any = [];
  directoryPath = 'assets/data/';

  // pagination
  public config: any = {
    paging: true,
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
  };
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  leadListFilterForm: FormGroup;
  lead_STATUS: { id: number; text: string; }[];
  LEAD_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'dealTitle': 'dealTitle',
    'brand': 'brand',
    'internationalProdCo': 'internationalProdCo',
    'agency': 'agency'
  };
  searchFlag: Boolean = false;
  currentPage: Number = CustomTableConfig.pageNumber;
  public maxSize: Number = CustomTableConfig.maxSize;
  itemsPerPage: Number = CustomTableConfig.pageSize;
  totalItems: Number = 0;
  showLoaderFlag: Boolean = true;
  leadListingArr: any = [];
  isSearchClicked: any;
  commonLabelsObj: any;
  page: Number = 1;
  swalOpenFlag: Boolean = false;

  constructor(private router: Router,
    public http: HttpClient,
    private _LeadListService: LeadListService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private sharedData: SharedData,
    private toastrService: ToastrService,
    private route: ActivatedRoute) { }

  /**
 *  It sets default user info and triggers required methods for initializing the page.
 */
  ngOnInit() {
    // this.getLeadList();
    this.createForm();
    // this.getDropdownValues();
    this.setleadListArr();
    this.setLocaleTranslation();
    // this.setPermissionsDetails();
  }
  /**
     *  Sets Manage listing role permissions
     */
  setPermissionsDetails() {
    const permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!this.swalOpenFlag) {
          this.search();
        }
      }
  }
  /**
   * It creates lead listing filter group form.
   */
  createForm() {
    this.leadListFilterForm = this.fb.group({
      dealTitle: [''],
      brand: [''],
      agency: [''],
      internationalProdCo: [''],
    });
  }
  public pageChanged(event: any): void {
    this.currentPage = event.page;
    // if (!this.searchFlag) {
      this.leadListingArr = [];
    // }
    this.setleadListArr();
  }

  /**
   * It gets dropDown values translated in required language
   */
  // getDropdownValues() {
  //   this.lead_STATUS = Common.changeDropDownValues(this.translateService, BID_STATUS);
  // }

  /**
   * It gets all search querry parameters from the filter form and returns it.
   */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.LEAD_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.LEAD_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.searchFlag && this.leadListFilterForm) {
      const formValues = this.leadListFilterForm.value;
      if (formValues.dealTitle) {
        params = params.append(this.LEAD_LIST_QUERY_PARAMS.dealTitle, formValues.dealTitle);
      }
      if (formValues.brand) {
        params = params.append(this.LEAD_LIST_QUERY_PARAMS.brand, formValues.brand);
      }
      if (formValues.agency) {
        params = params.append(this.LEAD_LIST_QUERY_PARAMS.agency, formValues.agency);
      }
      if (formValues.internationalProdCo) {
        params = params.append(this.LEAD_LIST_QUERY_PARAMS.internationalProdCo, formValues.internationalProdCo);
      }
      // if ((formValues.status || formValues.status === 0) && formValues.status !== -1) {
      //   params = params.append(this.LEAD_LIST_QUERY_PARAMS.status, formValues.status);
      // }
    }
    return params;
  }

  /**
   * It gives service call to lead listing service and gets the data as required.
   */
  setleadListArr() {
    this.showLoaderFlag = true;
    this._LeadListService.getLeadList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.totalItems = response.payload.totalItems;
          const leadListDataArr = LeadListData.getleadListDetails(response.payload.results);
          for (let leadIndex = 0; leadIndex < leadListDataArr.length; leadIndex++) {
            this.leadListingArr.push(leadListDataArr[leadIndex]);
          }
        } else {
          this.leadListingArr = [];
        }
        this.showLoaderFlag = false;
      } else {
        this.leadListingArr = [];
        this.showLoaderFlag = false;
      }
    },
      error => {
        this.showLoaderFlag = false;
      });
  }

  /**
   * It navigates to required page
   * @param id leadding ID
   */
  navigateTo(id?) {
    if (id) {
      this.navigationService.navigate([Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.manageLead, [id])]);
    } else {
      this.navigationService.navigate([Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.manageLead, [''])]);
    }
  }

  /**
   * It calles the lead listing service by setting and sending inoutted querry parameters.
   */
  search() {
    this.searchFlag = true;
    this.setdefaultPage();
    this.setleadListArr();
  }

  /**
   * It clears the filter form and sets it to its default values(blankvalues)
   */
  clear() {
    this.searchFlag = false;
    this.leadListFilterForm.reset();
    this.leadListFilterForm.patchValue({
      dealTitle: '',
      brand: '',
      agency: '',
      internationalProdCo: '',
    });
    this.setdefaultPage();
    this.setleadListArr();
  }

  /**
   * It sets required variables to its default values
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.totalItems = 0;
    this.page = 1;
    this.leadListingArr = [];
  }
  triggerBidCreation(lead) {
    if (!lead.isCreated) {
      this.swalOpenFlag = true;
      // tslint:disable-next-line:max-line-length
      const swalObj = Common.swalConfirmPopupObj(this.commonLabelsObj.labels.CreateDealAlertMessage, true, true);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          this.showLoaderFlag = true;
          const leadIdObj = {
            'leadId': lead.id
          };
          this._LeadListService.createBid(leadIdObj).subscribe((response: any) => {
            if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
              this.showLoaderFlag = false;
              this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.bids, [''])]);
              this.toastrService.success(response.header.message);
            } else {
              this.showLoaderFlag = false;
              this.toastrService.error(response.header.message);
            }
          },
            error => {
              this.showLoaderFlag = false;
              this.toastrService.error(this.commonLabelsObj.errorMessages.error);
            });
            this.swalOpenFlag = false;
        }
      });
    } else {
      // this.triggerEventToSaveData();
            this.swalOpenFlag = false;
    }
  }
  setLocaleTranslation() {
    this.translateService.get('biddings').subscribe((res: string) => {
      this.commonLabelsObj = res;
    });
  }
}

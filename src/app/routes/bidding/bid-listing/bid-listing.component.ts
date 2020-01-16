import { Component, OnInit, HostListener } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomTableConfig,
  UI_ACCESS_PERMISSION_CONST
} from '@app/config';
import { Common, NavigationService, SessionService } from '@app/common';
import { BidListData } from './bid-listing.data.model';
import { ListBiddingService } from './bidding-list.service';
import { Ibreadcrumb } from '@app/shared/components';
import { SharedData } from '@app/shared/shared.data';
import { ActivatedRoute, Router } from '@angular/router';
import { BIDDING_ROUTER_LINKS_FULL_PATH, BID_STATUS, BID_STATUS_TYPE_CONSTANT } from '../Constants'
import { ROUTER_LINKS_FULL_PATH } from '../../../config/routing.config';

@Component({
  selector: 'app-bid-listing',
  templateUrl: './bid-listing.component.html',
  styleUrls: ['./bid-listing.component.scss']
})
export class BidListingComponent implements OnInit {
  BIDDING_ROUTER_LINKS_FULL_PATH = BIDDING_ROUTER_LINKS_FULL_PATH;
  bidListFilterForm: FormGroup;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  showLoadingFlg: Boolean = true;
  showSpinnerFlag: Boolean = false;
  BUDGET_LIST_QUERY_PARAMS = {
    'pageSize': 'pageSize',
    'pageNo': 'pageNo',
    'status': 'status',
    'projectName': 'projectName',
    'clientName': 'clientName',
    'agencyName': 'agencyName'
  };
  currentPage: any = CustomTableConfig.pageNumber;
  itemsPerPage: Number = 9;
  totalItems: Number = 0;
  disableSearch: Boolean = false;
  BID_STATUS_TYPE_CONSTANT = BID_STATUS_TYPE_CONSTANT;
  BID_STATUS: { id: number; text: string; }[];

  // breadcrumbs data
  breadcrumbData: Ibreadcrumb = {
    title: 'biddings.labels.biddingList',
    subTitle: 'biddings.labels.biddingListSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.biddingListTitle',
      link: ''
    }
    ]
  };
  showLoaderFlag: Boolean = true;
  bidListingArr: any = [];
  searchFlag: Boolean = false;
  defaultStatusValue: Number = -1;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;

  constructor(private _ListBiddingService: ListBiddingService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
  ) { }

  /**
   *  It sets default user info and triggers required methods for initializing the page.
   */
  ngOnInit() {
    this.createForm();
    this.getDropdownValues();
    this.setBidListArr();
    this.setPermissionsDetails();
  }
  /**
 * Submits on enter key
 * @param event as enter key event
 */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  }
  /**
     *  Sets Manage listing role permissions
     */
  setPermissionsDetails() {
    debugger
    const permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
   * It creates bid listing filter group form.
   */
  createForm() {
    this.bidListFilterForm = this.fb.group({
      projectName: [''],
      clientName: [''],
      agencyName: [''],
      status: ['']
    });
  }

  /**
   * It gets dropDown values translated in required language
   */
  getDropdownValues() {
    this.BID_STATUS = Common.changeDropDownValues(this.translateService, BID_STATUS);
  }

  /**
   * It gets all search querry parameters from the filter form and returns it.
   */
  getSearchQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.pageSize, this.itemsPerPage.toString());
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.pageNo, this.currentPage.toString());
    if (this.searchFlag && this.bidListFilterForm) {
      const formValues = this.bidListFilterForm.value;
      if (formValues.projectName) {
        params = params.append(this.BUDGET_LIST_QUERY_PARAMS.projectName, formValues.projectName);
      }
      if (formValues.clientName) {
        params = params.append(this.BUDGET_LIST_QUERY_PARAMS.clientName, formValues.clientName);
      }
      if (formValues.agencyName) {
        params = params.append(this.BUDGET_LIST_QUERY_PARAMS.agencyName, formValues.agencyName);
      }
      if ((formValues.status || formValues.status === 0) && formValues.status !== -1) {
        params = params.append(this.BUDGET_LIST_QUERY_PARAMS.status, formValues.status);
      }
    }
    return params;
  }

  /**
   * It gives service call to bid listing service and gets the data as required.
   */
  setBidListArr() {
    this.showLoaderFlag = true;
    this.disableSearch = true;
    this._ListBiddingService.getBiddingList(this.getSearchQueryParam()).subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.showSpinnerFlag = false;
        if (response.payload && response.payload.results) {
          this.disableSearch = false;
          this.totalItems = response.payload.totalItems;
          const bidListDataArr = BidListData.getbidListDetails(response.payload.results);
          for (let bidIndex = 0; bidIndex < bidListDataArr.length; bidIndex++) {
            this.bidListingArr.push(bidListDataArr[bidIndex]);
          }
        } else {
          this.bidListingArr = [];
        }
        this.disableSearch = false;
        this.showLoaderFlag = false;
      } else {
        this.bidListingArr = [];
        this.showLoaderFlag = false;
        this.disableSearch = false;
      }
    },
      error => {
        this.showLoaderFlag = false;
        this.disableSearch = false;
      });
  }

  /**
   * It navigates to required page
   * @param url complete URL from ROUTER_LINKS_FULL_PATH in config file
   * @param id bidding ID
   */
  navigateTo(url, bidding?: any) {
    if (bidding) {
      this.sessionService.setSessionItem('disableProjectInputs', bidding.disableProjectInputs);
      if (bidding.disableProjectInputs) {
        this.navigationService.navigate(Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH['bidPasses'], [bidding.id]));
      } else {
        this.navigationService.navigate(Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH['biddingBasicInfo'], [bidding.id]));
      }
    } else {
      this.navigationService.navigate(url);
    }
  }

  /**
   * on scroll down of cursor, it called the bid listing service, which gets the next listing data.
   */
  onScrollDown() {
    if (!this.showLoaderFlag && this.totalItems > this.bidListingArr.length) {
      this.currentPage++;
      this.setBidListArr();
    }
  }

  /**
   * It calles the bid listing service by setting and sending inoutted querry parameters.
   */
  search() {
    this.searchFlag = true;
    this.setdefaultPage();
    this.setBidListArr();
  }

  /**
   * It clears the filter form and sets it to its default values(blankvalues)
   */
  clear() {
    this.searchFlag = false;
    this.bidListFilterForm.reset();
    this.bidListFilterForm.patchValue({
      locationType: '',
      projectName: '',
      clientName: '',
      agencyName: '',
      status: '',
    });
    this.setdefaultPage();
    this.setBidListArr();
  }

  /**
   * It sets required variables to its default values
   */
  setdefaultPage() {
    this.currentPage = 1;
    this.bidListingArr = [];
  }

  navigateToBiddingApprovalHierarchy() {
    this.navigationService.navigate([BIDDING_ROUTER_LINKS_FULL_PATH.biddingApprovalHierarchy]);
  }
}

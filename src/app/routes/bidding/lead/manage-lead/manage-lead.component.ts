import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Common, CustomValidators, NavigationService } from '@app/common';
import {
  ROUTER_LINKS_FULL_PATH, defaultDateRangepickerOptions,
  DEFAULT_MASTER_CONFIG_CURRENCY, defaultDatepickerOptions
} from '@app/config';
import { ManageLeadService } from './manage-lead.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDrpOptions } from 'mydaterangepicker';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SharedData } from '../../../../shared/shared.data';
import { ManageLeadDataModel } from './manage-lead.data.model';
declare var $: any;

@Component({
  selector: 'app-manage-lead',
  templateUrl: './manage-lead.component.html',
  styleUrls: ['./manage-lead.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageLeadComponent implements OnInit {
  myDateRangePickerOptions: IMyDrpOptions = defaultDateRangepickerOptions;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  isLoadingOrganizationName: Boolean = false;
  isLoadingContactPersonName: Boolean = false;
  isEmptyOrganizationName: Boolean = false;
  isEmptyContactPersonName: Boolean = false;
  // breadcrumb data
  breadcrumbData: any = {
    title: 'biddings.labels.leads',
    subTitle: 'biddings.labels.creationLeadSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.leads',
      link: ROUTER_LINKS_FULL_PATH['leads']
    },
    {
      text: 'biddings.labels.addLead',
      link: ''
    }
    ]
  };
  manageLeadForm: FormGroup;
  leadId: Number;
  MODULE_ID: string;
  uiAccessPermissionsObj: any;
  biddingLabelsObj: any;
  commonLabelsObj: any;
  currencies: any[] = [];
  dealValueMustNotBeZeroFlag: boolean = false;

  // pipelines dropdown
  pipelines: any[] = [
    { value: '0', label: 'The LIFT ADVERTISING' },
    { value: '1', label: 'The LIFT ENTERTAINMENT' },
  ];

  leadDetails: any;
  enableSaveButtonFlag: boolean;
  showLoaderOnSaveButtonFlag: boolean;
  submitManageLeadForm: Boolean = false;
  finalDealData: any;
  myDatePickerOptions: IMyDrpOptions = defaultDatepickerOptions;
  showLoaderFlag: boolean;
  agenciesList: any[];
  contactPersonsList: any[] = [];
  organizationsList: any[] = [];
  brandsList: any[];
  internationalProdCoList: any[];
  public searchTypedOrganizationName = new BehaviorSubject<string>('');
  public searchTypedContactPersonName = new BehaviorSubject<string>('');
  MANAGE_LEAD_QUERY_PARAMS = {
    'term': 'term'
  };
  organizationName = '';
  contactPersonName = '';
  orgAndContactPrIdArr: any = [];
  organizationOrContactPersonNameToAdd: any;
  organizationAndContactPersonNameConst = {
    'organizationName': 'organizationName',
    'contactPersonName': 'contactPersonName'
  };
  dropDownDataNotFoundFlag = false;
  disableDealTitleFlag = false;
  dealTitleFlag = false;
  dealTitleFlagMessage: any;
  organizationOrContactPersonNamePresentFlag: boolean;
  searchClicked: Boolean = false;

  constructor(private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private _ManageLeadService: ManageLeadService) {
  }

  /**
   * It is triggered on page initialization
   */
  ngOnInit() {
    this.setDatePickerOptions();
    this.manageLeadForm = this.createManageLeadForm();
    this.detectChangedInput();
    this.setLocaleTranslation();
    this.route.params.subscribe(params => {
      this.leadId = params.id;
      if (this.leadId) {
        this.getLeadDetails(this.leadId);
        this.disableDealTitleFlag = true;
      }
      this.getCurriencies();
    });
  }
  /**
   * Submits on enter key
   * @param event as enter key event
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.enableSaveButtonFlag && !this.showLoaderOnSaveButtonFlag) {
        this.updateLeadDetails();
      }
    }
  }
  /**
   * It sets datePicker default options.
   */
  setDatePickerOptions() {
    this.myDatePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(),
      month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1
    };
  }/**
   * It detects change in organizations and contact persons dropdoen search
   */
  detectChangedInput() {
    this.searchTypedOrganizationName
      .debounceTime(500)
      .distinctUntilChanged()
      //.filter((str: string) => str.length > 1)
      .subscribe((str) => this.getOrganizationsList(str));

    this.searchTypedContactPersonName
      .debounceTime(500)
      .distinctUntilChanged()
      //.filter((str: string) => str.length > 1)
      .subscribe((str) => this.getContactPersonsList(str));
  }
  /**
   * It adds contact person or organization name in pipedrive
   * @param NameType name of filed to be added
   */
  addOrganizationOrContactPerson(NameType) {
    const obj = {
      'name': this.organizationOrContactPersonNameToAdd
    };
    this.searchClicked = true;
    if (NameType === this.organizationAndContactPersonNameConst.organizationName) {
      this._ManageLeadService.addOrganizationName(obj).subscribe((response: any) => {
        if (response && response.header) {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            // Showing success message for new contact added successfully from UI side
            this.toastrService.success(this.biddingLabelsObj.successMessages.newOrganization);
            this.orgAndContactPrIdArr['organizationId'] = response.payload.data.id;
            // this.organizationsList = [];
            if (this.organizationsList.length >= 0) {
              this.organizationsList.shift();
            }
            const obj1 = {
              'id': response.payload.data.name,
              'text': response.payload.data.name,
              'type': ''
            };
            const tempArr = Object.assign([], this.organizationsList);
            this.organizationsList = [];
            tempArr.unshift(obj1);
            this.organizationsList = tempArr;
            const obj2 = { organizationName: obj1.id };
            this.manageLeadForm.patchValue({
              organizationName: ''
            });
            this.manageLeadForm.patchValue({ 
              organizationName: obj1.id,
              internationalProdCo: obj1.id 
            });
          } else {
            this.toastrService.error(this.commonLabelsObj.errorMessages.error);
          }
        }
        this.searchClicked = false;
      }, error => {
        this.searchClicked = false;
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });
    } else {
      this._ManageLeadService.addContactPersonName(obj).subscribe((response: any) => {
        if (response && response.header) {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            // Showing success message for new contact added successfully from UI side
            this.toastrService.success(this.biddingLabelsObj.successMessages.newContact);
            this.orgAndContactPrIdArr['contactPersonId'] = response.payload.data.id;
            // this.contactPersonsList = [];
            if (this.contactPersonsList.length >= 0) {
              this.contactPersonsList.shift();
            }
            const obj2 = {
              'id': response.payload.data.name,
              'text': response.payload.data.name,
              'type': ''
            };

            const tempArr = Object.assign([], this.contactPersonsList);
            this.contactPersonsList = [];
            tempArr.unshift(obj2);
            this.contactPersonsList = tempArr;
            const obj1 = { contactPersonName: obj2.id };
            this.manageLeadForm.patchValue({
              contactPersonName: ''
            });
            this.manageLeadForm.patchValue(obj1);



            // this.contactPersonsList.push(obj2);

            // this.manageLeadForm.patchValue({
            //   'contactPersonName': response.payload.data.name
            // });
          } else {
            this.toastrService.error(this.commonLabelsObj.errorMessages.error);
          }
        }
        this.searchClicked = false;
      }, error => {
        this.searchClicked = false;
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });
    }
  }
  /**
   * It navigates to required URL
   * @param url URL on which ti be navigated
   */
  navigateTo(url) {
    this.navigationService.navigate([Common.sprintf(url, [''])]);
  }
  /**
   * method to create basic formgroup
   */
  createManageLeadForm(): FormGroup {
    return this.fb.group({
      dealId: ['', []],
      dealTitle: ['', [CustomValidators.required]],
      dealValue: ['', [CustomValidators.required, CustomValidators.checkDecimal]],
      jobNumber: ['', [CustomValidators.required]],
      organizationName: ['', [CustomValidators.required]],
      contactPersonName: ['', [CustomValidators.required]],
      brand: ['', [CustomValidators.required]],
      client: ['', [CustomValidators.required]],
      agency: ['', [CustomValidators.required]],
      currencyId: [DEFAULT_MASTER_CONFIG_CURRENCY.id, [CustomValidators.required]],
      currencyCode: ['', []],
      internationalProdCo: [''],
      prodCoAssignedProducer: ['', [CustomValidators.required]],
      expectedCloseDate: ['', [CustomValidators.required]]
    });
  }
  /**
   * It gets role permission data and gives access to users with respect to it.
   */
  setPermissionsDetails() {
    const permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    const modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /**
   * It formayes data and sends to PUT or POST service to add or update lead
   */
  updateLeadDetails() {
    this.submitManageLeadForm = true;
    if (this.manageLeadForm.valid && !this.dealValueMustNotBeZeroFlag) {
      this.enableSaveButtonFlag = true;
      this.showLoaderOnSaveButtonFlag = true;
      this.finalDealData = ManageLeadDataModel.setLeadDetails(this.manageLeadForm.value, this.orgAndContactPrIdArr);
      if (this.leadId) {
        this._ManageLeadService.putPostLeadData(this.finalDealData, this.leadId).subscribe((response: any) => {
          this.updateAndRouteToLeadList(response);
        }, error => {
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
          this.enableSaveButtonFlag = false;
          this.showLoaderOnSaveButtonFlag = false;
        });
      } else {
        this._ManageLeadService.putPostLeadData(this.finalDealData).subscribe((response: any) => {
          this.updateAndRouteToLeadList(response);
        }, error => {
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
          this.enableSaveButtonFlag = false;
          this.showLoaderOnSaveButtonFlag = false;
        });
      }
    } else {
      this.scrollToInvalidControl();
    }
  }
  /**
   * It checks the responce and if success, navigates ti listing
   * @param response responce received from service call
   */
  updateAndRouteToLeadList(response) {
    if (response && response.header) {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.toastrService.success(response.header.message);
        this.enableSaveButtonFlag = false;
        this.showLoaderOnSaveButtonFlag = false;
        this.navigateTo(ROUTER_LINKS_FULL_PATH.leads);
      } else {
        if (response.header.statusCode === 601) {
          this.dealTitleFlag = true;
          this.dealTitleFlagMessage = response.header.message;
          this.setValidatorsAndUpdateValue();
          this.scrollToInvalidControl();
        }
        this.toastrService.error(response.header.message);
        this.enableSaveButtonFlag = false;
        this.showLoaderOnSaveButtonFlag = false;
      }
    }
  }
  /**
   * It gets list of curriencies from the server.
   */
  getLeadDetails(leadId) {
    this.showLoaderFlag = true;
    this._ManageLeadService.getLeadData(leadId).subscribe((response: any) => {
      this.setLeadDetails(response);
      this.showLoaderFlag = false;
    },
      error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });
  }
  /**
   * It checks data and formates to required structure and sets form value.
   * @param responseData responce received from service call
   */
  setLeadDetails(responseData) {
    if (responseData && responseData.header) {
      if (Common.checkStatusCode(responseData.header.statusCode)) {
        if (responseData.payload.result) {
          this.leadDetails = ManageLeadDataModel.getLeadDetails(responseData.payload.result);


          const tempDataObj = {
            'id': this.leadDetails.organizationName,
            'text': this.leadDetails.organizationName
          }

          const tempDataObj2 = {
            'id': this.leadDetails.contactPersonName,
            'text': this.leadDetails.contactPersonName
          }

          this.organizationsList.push(tempDataObj);
          this.contactPersonsList.push(tempDataObj2);
          this.manageLeadForm.setValue(this.leadDetails);
        } else {
          this.leadDetails = {};
        }
      } else {
        this.leadDetails = {};
      }
    } else {
      this.leadDetails = {};
    }
  }
  /**
   * It gets translated data from json
   */
  setLocaleTranslation() {
    this.translateService.get('biddings').subscribe((res: string) => {
      this.biddingLabelsObj = res;
    });
    this.translateService.get('common').subscribe((res: string) => {
      this.commonLabelsObj = res;
    });
  }
  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (const i in this.manageLeadForm.controls) {
      if (!this.manageLeadForm.controls[i].valid) {
        target = this.manageLeadForm.controls[i];
        break;
      }
    }
    if (target) {
      const el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /**
   * It makes dealTitle flag false on change of any inout in dealTitle
   */
  checkDealTitle() {
    this.dealTitleFlag = false;
  }
  /**
   * It gets list of curriencies from the server.
   */
  getCurriencies() {
    this._ManageLeadService.getCurrencies().subscribe((response: any) => {
      this.setCurrencies(response);
    },
      error => {
        this.currencies = [];
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      });
  }
  /**
   * checks and sets currencies to local object
   * @param response responce received from service call
   */
  setCurrencies(response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.results) {
        this.currencies = response.payload.results;
      } else {
        this.currencies = [];
      }
    } else {
      this.currencies = [];
    }
  }
  /**
   * It gets list of organization names from the server matching with str
   * @param str received string to be searched
   */
  getOrganizationsList(str) {
    if (str.length > 1) {
      this.isEmptyOrganizationName = false;
      this.isLoadingOrganizationName = true;
      this.dropDownDataNotFoundFlag = false;
      this.organizationOrContactPersonNameToAdd = str;
      this.organizationsList = [];
      this._ManageLeadService.getOrganizationsList(this.getSearchQueryParam(str)).subscribe((response: any) => {
        this.setOrganizationsList(str, response);
        this.isLoadingOrganizationName = false;
      },
        error => {
          this.organizationsList = [];
          this.isLoadingOrganizationName = false;
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        });
    } else {
      this.isEmptyOrganizationName = true;
      this.organizationsList = [];
    }
  }
  /**
   * It checkts and patches list of organization names to local dropdown variable.
   * @param response responce data
   */
  setOrganizationsList(str, response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.data) {
        this.organizationsList = [];
        const tempList = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(response.payload.data)), ['name'], ['name']);
        if (response.payload.data.length < 1) {
          this.dropDownDataNotFoundFlag = true;
          this.organizationsList = tempList;
        } else {
          const object = _.filter(tempList, (obj) => obj.text.toLowerCase() === str.toLowerCase());
          if (!object.length) {
            const arrayObject = {
              'id': 'new',
              'text': str,
              'type': 'new'
            };
            tempList.unshift(arrayObject);
            setTimeout(function () {
              $('.new-organization-name').parents('a').css('background-color', '#fff');
            }, 300);
            this.organizationOrContactPersonNamePresentFlag = false;
          } else {
            this.organizationOrContactPersonNamePresentFlag = true;
          }
          this.organizationsList = tempList;
        }
      } else {
        this.organizationsList = [];
      }
    } else {
      this.organizationsList = [];
    }
  }
  /**
   * It gets list of contact persons names from the server matching with str
   * @param str received string to be searched
   */
  getContactPersonsList(str) {
    if (str.length > 1) {
      this.isEmptyContactPersonName = false;
      this.isLoadingContactPersonName = true;
      this.dropDownDataNotFoundFlag = false;
      this.organizationOrContactPersonNameToAdd = str;
      this.contactPersonsList = [];
      this._ManageLeadService.getContactPersonsList(this.getSearchQueryParam(str)).subscribe((response: any) => {
        this.setContactPersonsList(str, response);
        this.isLoadingContactPersonName = false;
      },
        error => {
          this.isLoadingContactPersonName = false;
          this.contactPersonsList = [];
          this.toastrService.error(this.commonLabelsObj.errorMessages.error);
        });
    } else {
      this.contactPersonsList = [];
      this.isEmptyContactPersonName = true;
    }
  }
  /**
   * It checkts and patches list of contact persons names to local dropdown variable.
   * @param response responce data
   */
  setContactPersonsList(str, response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.data) {
        const tempList = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(response.payload.data)), ['name'], ['name']);
        this.contactPersonsList = [];
        if (response.payload.data.length < 1) {
          this.dropDownDataNotFoundFlag = true;
          this.contactPersonsList = tempList;
        } else {
          const object = _.filter(tempList, (obj) => obj.text.toLowerCase() === str.toLowerCase());
          if (!object.length) {
            const arrayObject = {
              'id': '1',
              'text': str,
              'type': 'new'
            };
            tempList.unshift(arrayObject);
            setTimeout(function () {
              $('.new-contactPerson-name').parents('a').css('background-color', '#fff');
            }, 300);
            this.organizationOrContactPersonNamePresentFlag = false;
          } else {
            this.organizationOrContactPersonNamePresentFlag = true;
          }
          this.contactPersonsList = tempList;
        }
      } else {
        this.contactPersonsList = [];
      }
    } else {
      this.contactPersonsList = [];
    }
  }
  /**
  * It gets all search querry parameters from the filter form and returns it.
  */
  getSearchQueryParam(str) {
    let params: HttpParams = new HttpParams();
    params = params.append(this.MANAGE_LEAD_QUERY_PARAMS.term, str.toString());
    return params;
  }
  /**
   * It disables dropDownDataNotFoundFlag flag
   */
  disableSearchFlag() {
    this.dropDownDataNotFoundFlag = false;
  }
  setValidatorsAndUpdateValue() {
    let baseControl: FormGroup;
    baseControl = <FormGroup>this.manageLeadForm.controls['dealTitle'];
    baseControl.setErrors({ 'checkRequired': true });
    baseControl.updateValueAndValidity();
    this.scrollToInvalidControl();
  }
  /**
   * It checks if input is not a number replaces it with 0
   */
  checkIntegerValue() {
    let dealvalue = this.manageLeadForm.value['dealValue'];
    this.dealValueMustNotBeZeroFlag = false;
    if (isNaN(dealvalue)) {
      const obj = { ['dealValue']: "" };
      this.manageLeadForm.patchValue(obj);
    } else if (parseFloat(dealvalue) === 0) {
      this.dealValueMustNotBeZeroFlag = true;
    }
  }
  setIntProdCompValue(organizationName) {
    if (typeof (organizationName) === "string") {
      const text = organizationName ? organizationName : "";
      this.manageLeadForm.controls["internationalProdCo"].setValue(text);
    }
  }
}

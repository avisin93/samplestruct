/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageBidData } from './manage-bid.data';
import { TranslateService } from '@ngx-translate/core';
import { ManageBid } from './manage-bid.data.model';
import { ManageBidService } from './manage-bid.service';
import { Common, NavigationService, TriggerService, SessionService } from '@app/common';
import { ROUTER_LINKS, EVENT_TYPES, UI_ACCESS_PERMISSION_CONST, ROUTER_LINKS_FULL_PATH } from '@app/config'
import { BidData } from './manage-bid';
import { SharedData } from '@app/shared/shared.data';
import { CURRENCY_CONSTANTS, DEFAULT_CURRENCY, TAB_CONST, TAB_NAME_KEYS, STATUS_CODES, BIDDING_ROUTER_LINKS_FULL_PATH } from '../Constants';
import * as _ from 'lodash';
import { EditingAndPostDataModel } from './editing-and-post/editing-and-post.data.model';

declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-manage-bid',
  templateUrl: './manage-bid.component.html',
  styleUrls: ['./manage-bid.component.scss']
})
export class ManageBidComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  ROUTER_LINKS = ROUTER_LINKS;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  BIDDING_ROUTER_LINKS_FULL_PATH = BIDDING_ROUTER_LINKS_FULL_PATH;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  TAB_NAME_KEYS = TAB_NAME_KEYS;
  TAB_CONST = TAB_CONST;
  subscription: Subscription;
  breadcrumbData: any = {
    title: 'biddings.labels.manageDealTitle',
    subTitle: 'biddings.labels.manageDealSubtitle',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.biddingListTitle',
      link: ROUTER_LINKS_FULL_PATH['bids']
    },
    {
      text: 'biddings.labels.manageDealTitle',
    }
    ]
  };
  projectId: string;
  biddingsLabelsObj: any = {};
  defaultBidData: BidData = new BidData();
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private router: Router,
    public manageBidData: ManageBidData,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private _manageBidService: ManageBidService,
    private triggerService: TriggerService,
    private toastrService: ToastrService,
    private sharedData: SharedData,
    private sessionService: SessionService
  ) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.setPermissionsDetails();
    this.setLocaleObj();
    this.route.params.subscribe(params => {
      this.manageBidData.projectId = params.id;
      this.projectId = params.id;
      // let disableProjectInputsFlag = this.route.snapshot.queryParams['disableProjectInputs'];
      let disableProjectInputsFlag = this.sessionService.getSessionItem('disableProjectInputs');
      this.manageBidData.disableProjectInputs = disableProjectInputsFlag ? JSON.parse(disableProjectInputsFlag) : false;
      // if (!this.manageBidData.disableProjectInputs) {
      this.setPageDetails();
      // }

    });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type == EVENT_TYPES.updateBidEvent) {
          const currentValue = data.event.currentValue;
          this.updateBidDetails(currentValue);
        }
        if (data.event.type == EVENT_TYPES.generateAICPEvent) {
          const currentValue = data.event.currentValue;
          this.generateAICP(currentValue);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.triggerService.clearEvent();
    this.manageBidData.bidData = this.defaultBidData;
    this.manageBidData.bidFormsData = this.defaultBidData;
    this.manageBidData.bidFormsUnsavedData = this.defaultBidData;
    this.manageBidData.currentTabId = TAB_CONST.basicInfo;
    this.manageBidData.currentTabKey = this.TAB_NAME_KEYS.basicInfo;
    this.manageBidData.disableButtonFlag = false;
    this.manageBidData.spinnerFlag = false;
    this.sessionService.removeSessionItem('disableProjectInputs');
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /**
   *  Sets  Bid module role permissions
   */
  setPermissionsDetails() {
    const permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
    const modulePermissionObj = permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  /*Sets biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.biddingsLabelsObj = res;
    });
  }

  /*Sets page details like default currencies,bid details & passes details*/
  setPageDetails() {
    this.manageBidData.showLoaderFlag = true;
    const combined = Observable.forkJoin(
      this._manageBidService.getCurrencies(),
      this._manageBidService.getBidDetails(this.projectId),
      this._manageBidService.getPassesDetails(this.projectId)
    );
    combined.subscribe((latestValues: any) => {
      let currencyResponseDetails: any = latestValues[0];
      let bidDetails: any = latestValues[1];
      let passDetails: any = latestValues[2];
      this.manageBidData.showLoaderFlag = false;
      if (currencyResponseDetails && Common.checkStatusCodeInRange(currencyResponseDetails.header.statusCode)) {
        if (currencyResponseDetails.payload && currencyResponseDetails.payload.results) {
          let currency = currencyResponseDetails.payload.results;
          this.manageBidData.currencies = Common.getMultipleSelectArr(currency, ['id'], ['code']);
          this.manageBidData.filteredCurrencies = _.filter(this.manageBidData.currencies, function (obj) { return obj.id !== DEFAULT_CURRENCY.id; });
        } else {
          this.manageBidData.currencies = [];
          this.manageBidData.filteredCurrencies = [];
        }
      } else {
        this.manageBidData.currencies = [];
        this.manageBidData.filteredCurrencies = [];
      }
      if (passDetails && Common.checkStatusCodeInRange(passDetails.header.statusCode)) {
        if (passDetails.payload) {
          this.manageBidData.latestPassDetails = passDetails.payload;
          this.manageBidData.AICPGeneratedStatus = true;
        }
      } else {
        this.manageBidData.latestPassDetails = {};
        this.manageBidData.AICPGeneratedStatus = false;
      }
      if (bidDetails && Common.checkStatusCodeInRange(bidDetails.header.statusCode)) {
        if (bidDetails.payload) {
          this.manageBidData.bidData = bidDetails.payload;
          this.manageBidData.serviceDisableProjectInputsFlag = bidDetails.payload.disableProjectInputs;
          this.manageBidData.disableProjectInputs = this.manageBidData.serviceDisableProjectInputsFlag;
          this.manageBidData.setDisableProjectInputsFlagInSessionStorage(this.manageBidData.disableProjectInputs);
          this.checkAndDisableTabs();
          this.setProjectBidCurrencyDropdown();
          this.setEventType({ type: EVENT_TYPES.bidDetailsEvent, prevValue: false, currentValue: true });
        }
      } else {
        this.manageBidData.bidData = this.defaultBidData;
        this.manageBidData.bidFormsData = this.defaultBidData;
        this.manageBidData.disableProjectInputs = false;
        this.manageBidData.serviceDisableProjectInputsFlag=false;
        this.manageBidData.setDisableProjectInputsFlagInSessionStorage(false);
      }

    }, (error) => {
      this.manageBidData.showLoaderFlag = false;
    }
    )
  }

  /*Checks & disables manage bid tabs conditionally*/
  checkAndDisableTabs() {
    let basicInfoObj = this.manageBidData.bidData.basicInfo;
    let businessTermsObj = this.manageBidData.bidData.businessTerms;
    if (basicInfoObj) {
      if (!basicInfoObj.projectName || !basicInfoObj.director || !basicInfoObj.directorOfPhotography) {
        this.manageBidData.disableTabs.businessTerms = true;
      }
    } else {
      this.manageBidData.disableTabs.businessTerms = true;
    }
    if (businessTermsObj) {
      if (businessTermsObj.exchangeRates && businessTermsObj.exchangeRates.length == 0) {
        this.manageBidData.disableTabs.productionParameters = true;
        this.manageBidData.disableTabs.talent = true;
        this.manageBidData.disableTabs.editingAndPost = true;
        this.manageBidData.disableTabs.aicp = true;
      }
    } else {
      this.manageBidData.disableTabs.productionParameters = true;
      this.manageBidData.disableTabs.talent = true;
      this.manageBidData.disableTabs.editingAndPost = true;
      this.manageBidData.disableTabs.aicp = true;
    }

  }

  /**
   * Set Exchange Currency Dropdown array within manage bid data file from where
   * we can access and set dropdown array within other modules for which exchange rate is defined
   */
  setProjectBidCurrencyDropdown() {
    // tslint:disable-next-line:max-line-length
    const businessTermsData = this.manageBidData.bidFormsData['businessTerms'] ? this.manageBidData.bidFormsData['businessTerms'] : this.manageBidData.bidData['businessTerms'];
    const currencyArr = [];
    const currencyObj = Object.assign({}, DEFAULT_CURRENCY);
    currencyObj['text'] = currencyObj['name'];
    currencyArr.push(currencyObj);
    if (businessTermsData && (businessTermsData.exchangeRates || businessTermsData.exchangeRate)) {
      const exchangeRatesArr = businessTermsData.exchangeRate ? businessTermsData.exchangeRate : businessTermsData.exchangeRates;
      for (let index = 0; index < exchangeRatesArr.length; index++) {
        // tslint:disable-next-line:max-line-length
        const tempCurrencyObj = _.filter(CURRENCY_CONSTANTS, function (obj) { return (obj.id !== DEFAULT_CURRENCY.id && obj.id === exchangeRatesArr[index]['sourceCurrencyId']); });

        if (tempCurrencyObj[0]) {
          currencyArr.push(tempCurrencyObj[0]);
        }
      }
    }
    this.manageBidData.exchangeCurrencyDropdownArr = currencyArr;
  }


  /**
   ** triggers events for child components
   ** @param event as object with type,prevValue & currentValue fields
   **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**
 ** Update bid details
 ** @param eventData as object with tabId,navigationUrl & generateAICP fields
 **/
  updateBidDetails(eventData) {
    if (this.manageBidData.currentTabId == TAB_CONST.basicInfo) {
      this.updateEditingAndPostDataObj();
    }
    const finalBidDetails = ManageBid.getWebServiceDetails(eventData.tabId, this.manageBidData.bidFormsData);
    this._manageBidService.updateBidDetails(this.projectId, finalBidDetails['details']).subscribe((responseData: any) => {

      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.manageBidData.bidData[finalBidDetails['key']] = finalBidDetails['details'][finalBidDetails['key']];
        if (eventData.generateAICP) {
          const formDetails = {};
          formDetails['projectId'] = this.projectId;
          formDetails['status'] = 1;
          formDetails['updateProjectInputs'] = 1;
          eventData['formDetails'] = formDetails;
          this.generateAICP(eventData);
        } else {
          this.getPassesDetails();
          this.toastrService.success(responseData.header.message);
          this.navigationService.navigate([Common.sprintf(eventData.navigationUrl, [this.projectId])]);

        }
      }
      else {
        this.manageBidData.disableButtonFlag = false;
        this.manageBidData.spinnerFlag = false;
        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.manageBidData.disableButtonFlag = false;
        this.manageBidData.spinnerFlag = false;
        this.toastrService.error(this.biddingsLabelsObj.errorMessages.error);
      });
  }

  /**
  ** Generate aicp with specified form details
  ** @param eventData as object with tabId,navigationUrl & formDetails fields
  **/
  generateAICP(eventData) {
    this._manageBidService.generateAICP(eventData.formDetails).subscribe((responseData: any) => {
      let formDetails = eventData.formDetails;
      this.manageBidData.disableButtonFlag = false;
      this.manageBidData.spinnerFlag = false;
      this.manageBidData.updateAICPSpinnerFlag = false;
      this.manageBidData.publishSpinnerFlag = false;
      if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.getPassesDetails(eventData.formDetails);
        this.toastrService.success(responseData.header.message);
        this.navigationService.navigate([Common.sprintf(eventData.navigationUrl, [this.projectId])]);
      } else {
        this.toastrService.error(responseData.header.message);
      }
    },
      error => {
        this.manageBidData.disableButtonFlag = false;
        this.manageBidData.spinnerFlag = false;
        this.manageBidData.updateAICPSpinnerFlag = false;
        this.manageBidData.publishSpinnerFlag = false;
      });
  }

  /**
  ** Set latest pass details & aicpgenerate status
  **/
  getPassesDetails(formDetails?: any) {
    this._manageBidService.getPassesDetails(this.projectId).subscribe((responseData: any) => {
      if (responseData && Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        if (responseData.payload) {
          if (formDetails && (formDetails.status == STATUS_CODES.PUBLISH)) {
            this.manageBidData.disableProjectInputs = true;
            this.manageBidData.serviceDisableProjectInputsFlag = true;
            this.manageBidData.setDisableProjectInputsFlagInSessionStorage(true);
          }
          this.manageBidData.latestPassDetails = responseData.payload;
          this.manageBidData.AICPGeneratedStatus = true;
        }
      } else {
        this.manageBidData.AICPGeneratedStatus = false;
      }
    },
      error => {
        this.manageBidData.AICPGeneratedStatus = false;
      });
  }

  /**
   ** Navigate to master configuration page
   ** @param url as string
   **/
  navigateToMasterConfig(url) {
    this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
  }
  /**
  ** Navigate to specified url
  ** @param url as string
  **/
  navigateTo(url) {
    this.navigationService.navigate([url]);
  }
  /**
  ** Update bidFormsData object of manageBidData
  ** @param eventData as object with tabId,navigationUrl & formDetails fields
  **/
  updateBidFormsDataObj(eventData) {
    this.manageBidData.bidFormsData[this.manageBidData.currentTabKey] = this.manageBidData.bidFormsUnsavedData[this.manageBidData.currentTabKey];
    const invertedObject = _.invert(JSON.parse(JSON.stringify(TAB_CONST)));
    this.manageBidData.disableTabs[invertedObject[eventData.tabId + 1]] = false;
    this.manageBidData.spinnerFlag = true;
    this.manageBidData.disableButtonFlag = true;
    this.updateBidDetails(eventData);
  }

  updateEditingAndPostDataObj() {
    let tempArr = [];
    let tempEditingAndPostDataObj = this.manageBidData.bidData.editingAndPost ? this.manageBidData.bidData.editingAndPost : {};
    let tempBasicInfoObj = this.manageBidData.bidFormsData.basicInfo ? this.manageBidData.bidFormsData.basicInfo : {};
    let commercialTitlesArr = _.map(tempBasicInfoObj.commercialTitle, 'title');
    if (tempEditingAndPostDataObj && tempEditingAndPostDataObj.editorAndPostCoordinator) {
      tempEditingAndPostDataObj.editorAndPostCoordinator.forEach((obj, index) => {
        if (commercialTitlesArr.includes(obj.commercialTitle)) {
          tempArr.push(obj);
        } else {
          if (tempEditingAndPostDataObj.image && tempEditingAndPostDataObj.image.imageMetaData) {
            tempEditingAndPostDataObj.image.imageMetaData.splice(index, 1);
          }
        }
      });
      tempEditingAndPostDataObj.editorAndPostCoordinator = tempArr;
    }
    this.manageBidData.bidFormsData.editingAndPost = EditingAndPostDataModel.getFormDetails(this.manageBidData.bidData.editingAndPost, this.manageBidData.defaultCurrencyId);
  }
  /**
    **  Redirect to screen with bid id
    ** @param event of type $event
    ** @param url of type String
    ** add class on which user has clicked as active
    **/
  redirectToLink(event: any, url: string, tabId: number, tabName = "") {
    // if (this.manageBidData.currentTabId > tabId) {
    if ((this.manageBidData.currentTabId != TAB_CONST.passes) && (this.manageBidData.currentTabId != TAB_CONST.aicp)) {
      this.checkCurrentTabFormIsValidOrNot(url, tabId);
    } else if (this.manageBidData.currentTabId === TAB_CONST.aicp) {
      if (!Common.isEmptyObject(this.manageBidData.passDetails) && !Common.isEmptyObject(this.manageBidData.latestPassDetails) && (this.manageBidData.viewedPassDetails['status'] != STATUS_CODES.PUBLISH)) {
        this.confirmationToUpdateAICPDetails(url);
      } else {
        this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
      }
      //this.openPopUp('Please click on Update AICP button to save the changed data');
    } else {
      this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
    }
    // } else {
    //   this.checkCurrentTabFormIsValidOrNot(url);
    // }
  }

  /**
  ** Confirmation popup to update aicp or not
  ** @param url of type String to navigate to another page
  **/
  confirmationToUpdateAICPDetails(url) {
    var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.aicpSaveConfirmationMsg, true, true, this.biddingsLabelsObj.labels.yes, this.biddingsLabelsObj.labels.cancelDelete);
    swal(swalObj, (isConfirm) => {
      if (isConfirm) {

      } else {
        this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
      }
    });
  }

  /**
   ** Checks current tab forms data is valid or invalid
   ** @param url of type String to navigate to another page
   ** @param tabId of type number 
   **/
  checkCurrentTabFormIsValidOrNot(url, tabId) {
    if (this.manageBidData.validFormFlag) {
      this.manageBidData.invalidFlag = false;
      this.checkCurrentTabDataChangedOrNot(url, tabId);
    } else {
      let invertedObject = _.invert(JSON.parse(JSON.stringify(TAB_CONST)));
      if (this.manageBidData.disableTabs[invertedObject[this.manageBidData.currentTabId + 1]]) {
        this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
      } else {
        this.manageBidData.invalidFlag = true;
        this.openPopUp(this.biddingsLabelsObj.labels.pleaseFill);
      }
    }
  }

  /**
   ** Checks current tab forms data changed or not
   ** @param url of type String to navigate to another page
   ** @param tabId of type number 
   **/
  checkCurrentTabDataChangedOrNot(url: string, tabId) {
    if (this.manageBidData.currentTabDataChangeFlag) {
      var swalObj = Common.swalConfirmPopupObj(this.biddingsLabelsObj.labels.saveConfirmationMsg, true, true, this.biddingsLabelsObj.labels.yes, this.biddingsLabelsObj.labels.cancelDelete);
      swal(swalObj, (isConfirm) => {
        if (isConfirm) {
          let eventData = {
            tabId: this.manageBidData.currentTabId,
            navigationUrl: url
          }
          this.updateBidFormsDataObj(eventData);
        } else {
          this.clearRespectiveFormDetails(this.manageBidData.currentTabId);
          this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
        }
      });
    } else {
      this.navigationService.navigate([Common.sprintf(url, [this.projectId])]);
    }
  }

  /**
   ** Clears respective tab's forms data
   ** @param tabId of type number 
   **/
  clearRespectiveFormDetails(tabId) {
    switch (tabId) {
      case TAB_CONST.basicInfo:
        delete this.manageBidData.bidFormsData['basicInfo'];
        break;
      case TAB_CONST.businessTerms:
        delete this.manageBidData.bidFormsData['businessTerms'];
        break;
      case TAB_CONST.productionParameters:
        delete this.manageBidData.bidFormsData['productionParameters'];
        break;
      case TAB_CONST.talent:
        delete this.manageBidData.bidFormsData['talent'];
        break;
      case TAB_CONST.editingAndPost:
        delete this.manageBidData.bidFormsData['editingAndPost'];
        break;
    }
  }
  /**
  ** Popup to show msg only without buttons & title
  ** @param text of type string 
  **/
  openPopUp(text) {
    swal({
      title: '',
      text: text,
      type: 'warning',
    });
  }
}

/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Common, TriggerService } from '@app/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, AnonymousSubscription } from 'rxjs/Subscription';
import { ManageBidData } from '../manage-bid.data';
import { ManageBidService } from '../manage-bid.service';
import { Configuration, EVENT_TYPES, ACTION_TYPES } from '@app/config';
import { TAB_CONST, TAB_NAME_KEYS, STATUS_CODES, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { SharedData } from '@app/shared/shared.data';
declare var $: any;

@Component({
  selector: 'app-aicp',
  templateUrl: './aicp.component.html',
  styleUrls: ['./aicp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AicpComponent implements OnInit, OnDestroy {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  PREBID_ENDPOINT: any;
  projectId: any;
  passId: any;
  passDetails: any;
  editFlag: Boolean = true;
  subscription: Subscription;
  STATUS_CODES = STATUS_CODES;
  ACTION_TYPES = ACTION_TYPES;
  iframeHeight: number;
  loaded: Boolean = false;
  permissionObject: any;
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private router: Router,
    public manageBidData: ManageBidData,
    private route: ActivatedRoute,
    private triggerService: TriggerService,
    private _manageBidService: ManageBidService,
    private sharedData: SharedData,
  ) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    Common.scrollTOTop();
    this.manageBidData.initialize(TAB_CONST.aicp, TAB_NAME_KEYS.aicp, 'aicp-tab');
    this.projectId = this.manageBidData.projectId;
    this.route.params.subscribe(params => {
      this.passId = params.passId;
    });
    this.manageBidData.showLoaderFlag = true;
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type == EVENT_TYPES.bidDetailsEvent) {
          const currentValue = data.event.currentValue;
          if (currentValue) {
            if (this.manageBidData.disableProjectInputs) {
              this.manageBidData.navigateToPassesTab();
            }
          }
        }

      }
    });
    if (!Common.isEmptyObject(this.manageBidData.passDetails)) {
      this.passDetails = this.manageBidData.passDetails;
      this.setPassDetails();
      this.manageBidData.showLoaderFlag = false;
    } else {
      this.getPassesDetails();
    }
    this.iframeHieghtAdjust();
    this.setPermissionsDetails();
  }
  setPermissionsDetails() {
    this.permissionObject = this.sharedData.getRolePermissionData();
     this.MODULE_ID = this.route.snapshot.parent.parent.parent.data['moduleID'];
     const modulePermissionObj =  this.permissionObject[this.MODULE_ID];
     if (modulePermissionObj.uiAccess) {
       this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
     }
   }
  iframeLoaded() {
    this.loaded = true;
  }

  ngOnDestroy() {
    this.manageBidData.currentTabDataChangeFlag = false;
    this.manageBidData.validFormFlag = false;
    this.manageBidData.passDetails = {};
  }

  /*all life cycle events whichever required after inicialization of constructor*/

  /**
  * method to adjust iframe height
  */
  iframeHieghtAdjust() {
    const iframeHt = $(window).height();
    this.iframeHeight = iframeHt - 370;
  }

  /**
  ** method to get pass details
  **/
  getPassesDetails() {
    this._manageBidService.getPassesDetails(this.projectId).subscribe((responseData: any) => {
      if (responseData && Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        if (responseData.payload) {
          this.manageBidData.latestPassDetails = responseData.payload;
          this.passDetails = this.manageBidData.latestPassDetails;
          this.manageBidData.passDetails = this.manageBidData.latestPassDetails;
          this.passDetails['passId'] = this.passDetails['id'];
          this.passDetails['onlyView'] = (this.passDetails['status'] == STATUS_CODES.PUBLISH) ? true : false;
          // this.passDetails['onlyView'] = (this.manageBidData.disableProjectInputs) ? true : false;
          this.manageBidData.AICPGeneratedStatus = true;
          this.setPassDetails();
        }
        this.manageBidData.showLoaderFlag = false;
      } else {
        this.manageBidData.AICPGeneratedStatus = false;
        this.manageBidData.showLoaderFlag = false;
      }
    },
      error => {
        this.manageBidData.AICPGeneratedStatus = false;
        this.manageBidData.showLoaderFlag = false;
      });
  }
  /**
  **method to set prebid endpoint url
  **/
  setPassDetails() {
    let tempURL = Configuration.PREBID_ENDPOINT;
    tempURL += '?projectId=' + this.projectId;
    if (this.passDetails['passId']) {
      tempURL += '&passId=' + this.passDetails['passId'];
    }
    if (this.passDetails['onlyView']) {
      tempURL += '&mode=readOnly';
      this.editFlag = false;
    }
    this.manageBidData.viewedPassDetails = Object.assign({}, this.passDetails);
    this.PREBID_ENDPOINT = tempURL;
  }

  /**
  **method to toggle full screen
  **/
  toggleFullScreen() {
    let elem: any = document.getElementById('aicpSheet');
    let methodToBeInvoked = elem.requestFullscreen ||
      elem.webkitRequestFullScreen || elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }
  /**
   ** Method to save changes made in aicp sheet
   ** @param status as number for setting status of aicp
   **/
  saveAICP(status = STATUS_CODES.DRAFT) {
    let formDetails = {};
    if (this.passDetails['passId']) {
      formDetails['passId'] = this.passDetails['passId'];
    }
    formDetails['projectId'] = this.projectId;
    formDetails['status'] = status;
    formDetails['updateProjectInputs'] = 0;
    if (status == STATUS_CODES.DRAFT) {
      this.manageBidData.updateAICPSpinnerFlag = true;
    } else {
      this.manageBidData.publishSpinnerFlag = true;
    }
    this.manageBidData.disableButtonFlag = true;
    this.setEventType({ type: EVENT_TYPES.generateAICPEvent, prevValue: {}, currentValue: { 'navigationUrl': BIDDING_ROUTER_LINKS_FULL_PATH.bidPasses, 'formDetails': formDetails } });
  }
  /**
  ** It triggers an event which will notify manage payment component.
  ** @param event event data to be triggered
  **/
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**
  ** Navigate to specified url
  ** @param url as string 
  **/
  navigateTo(url) {
    this.router.navigate([Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.bidPasses, [this.projectId])]);
  }

}

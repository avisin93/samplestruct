import { Injectable } from '@angular/core';
import { SessionService, HttpRequest, Common, NavigationService } from '@app/common';
import { BidData } from './manage-bid';
import { DEFAULT_CURRENCY, TAB_NAME_KEYS, TAB_CONST, BIDDING_ROUTER_LINKS_FULL_PATH } from '../Constants';
declare var $: any;

@Injectable()
export class ManageBidData {
    public projectId: any;
    public invalidFlag: boolean = false;
    public disableButtonFlag: boolean = false;
    public disableProjectInputs: boolean = false;
    public serviceDisableProjectInputsFlag: boolean = false;
    public spinnerFlag: boolean = false;
    public showLoaderFlag: boolean = false;
    public validFormFlag: boolean = false;
    public currentTabDataChangeFlag: boolean = false;
    public bidFormsData: BidData = new BidData();
    public bidFormsUnsavedData: BidData = new BidData();
    public bidData: BidData = new BidData();
    public defaultCurrencyId: string = DEFAULT_CURRENCY.id;
    public exchangeCurrencyDropdownArr: any = [];
    public currencies: any = [];
    public filteredCurrencies: any = [];
    public currentTabId: number = TAB_CONST.basicInfo;
    public currentTabKey = TAB_NAME_KEYS.basicInfo;
    public passDetails: any = {};
    public viewedPassDetails: any = {};
    public latestPassDetails: any;
    public AICPGeneratedStatus: any;
    updateAICPSpinnerFlag: boolean = false;
    publishSpinnerFlag: boolean = false;
    public disableTabs: any = {
        'basicInfo': false,
        'businessTerms': false,
        'productionParameters': false,
        'editingAndPost': false,
        'talent': false,
        'aicp': false
    }
    /**
    * constructor method is used to initialize members of class
    */
    constructor(
        private sessionService: SessionService,
        private _http: HttpRequest,
        private navigationService: NavigationService,
    ) {
        // this.initializeData(TAB_CONST.basicInfo,TAB_NAME_KEYS.basicInfo);
    }
    initialize(currentTabId: number, currentTabKey: string, tabIdName: string) {
        $('#' + tabIdName).parents('.nav-pills').find('a').removeClass('active');
        $('#' + tabIdName).addClass('active');
        this.validFormFlag = true;
        this.currentTabId = currentTabId;
        this.currentTabKey = currentTabKey;
        this.disableButtonFlag = false;
        this.spinnerFlag = false;
    }
    setDisableProjectInputsFlagInSessionStorage(disableProjectInputsFlag: boolean) {
        this.sessionService.setSessionItem('disableProjectInputs', disableProjectInputsFlag);
    }

    navigateToPassesTab() {
        this.navigationService.navigate([Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.bidPasses, [this.projectId])]);
    }
    navigateToEitherBasicInfoOrPassesTab() {
        if (this.disableProjectInputs) {
            this.navigateToPassesTab();
        } else {
            this.navigationService.navigate(Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH['biddingBasicInfo'], [this.projectId]));
        }
    }
}

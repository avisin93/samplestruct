/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharedService } from '@app/shared/shared.service';
import { Common, SessionService, CustomValidators } from '@app/common';
import { AddPOLocationData } from './add-po-location.data.model';
import { AddLocationPOService } from './add-po-location.service';
import { SharedData } from '@app/shared/shared.data';
import { ROUTER_LINKS_FULL_PATH, OPERATION_MODES, COOKIES_CONSTANTS, PURCHASE_ORDER_CONST, defaultDatepickerOptions, OPERATION_TYPES_ARR } from '@app/config';
import * as _ from 'lodash';
import { ProjectsData } from '../../../../../projects.data';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-add-po-location',
  templateUrl: './add-po-location.component.html',
  styleUrls: ['./add-po-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPoLocationComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  OPERATION_MODES = OPERATION_MODES;
  paidVia: String;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  dobDatePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  locationPOForm: FormGroup
  subLocationFormFlag: boolean = false;
  renderPage: Boolean = false;
  addsubpoArray = [];
  selectedIndex = '';
  requestedByList: any = [];
  modesOfOperation: any = [];
  budgetLineList: any = [];
  locationScouter: any = [];
  scouter: any = [];
  projectId: any;
  mode: any = [];
  subPoLocationFlag: boolean = false;
  incompleteProfileDetailsFlag: boolean = false;
  currencies: any = [];
  currency: any = [];
  locations: any = [];
  masterLocations: any = [];
  isClicked: boolean = false;
  spinnerFlag: boolean = false;
  submmitedFormFlag: boolean = false;
  totalDays: any;
  totalAmt: any;
  subTotal: any;
  isrWithholdingAmt: any;
  vatWithHoldingAmt: any;
  editLocationPOData: any;
  locationPOFormDetails: any;
  defaultValueObj: any;
  locationPOId: any;
  value: any;
  poLocations: any;
  financialDetails: boolean = false;
  selectedLocationId: any;
  budgetId: string = '';
  payableAmount: Number = 0;
  public searchLocation = new BehaviorSubject<string>('');
  searchLocationSubscription: Subscription;
  isLoadingLocationName
  QUERY_PARAMS = {
    'name': 'name'
  }
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private router: Router,
    private sharedData: SharedData,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private _fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private _sharedService: SharedService,
    private sessionService: SessionService,
    private projectsData: ProjectsData,
    private toastrService: ToastrService,
    private adLocationPOService: AddLocationPOService,
  ) {
    this.dobDatePickerOptions.disableUntil = { year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1 }
  }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.route.params.subscribe(params => {
      this.locationPOId = params['id'];
    });
    this.initializeForm();
    this.getPageDetails();
  }

  /*all life cycle events whichever required after inicialization of constructor*/

  getPageDetails() {

    this.getRequestedByList();
    this.getModesOfOperation();

    this.getCurrencies();
    this.getMasterLocations();
    this.getPODefaultValues();
    this.getPOBudgetLine(this.budgetId);
    if (this.locationPOId) {
      this.renderPage = false;
      this.getPODetailsWithLocationScouterList();
    } else {
      this.renderPage = true;
      this.getLocationScouter();
    }
    this.detectChangedInput();
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (!this.spinnerFlag) {
  //       this.addLocationPO();
  //     }
  //   }
  // }

  getPODetailsWithLocationScouterList() {
    const combined = Observable.forkJoin(
      this._sharedService.getLocationScouter(),
      this.adLocationPOService.getLocationPObyID(this.locationPOId)
    );
    combined.subscribe((latestValues: any) => {
      const locationScouterList: any = latestValues[0];
      const locationPoDetails: any = latestValues[1];

      if (locationScouterList) {
        this.setLocationScouterDetails(locationScouterList);
      } else {
        this.locationScouter = [];
      }
      if (locationPoDetails) {
        this.setEditPoDetails(locationPoDetails);
      }
      this.scouterSelected(this.locationPOFormDetails.scouterId);
      this.renderPage = true;
    });
  }


  /*method to create location po  form*/
  initializeForm() {
    this.locationPOForm = this._fb.group({
      beneficiary: [''],
      budgetLine: ['', [CustomValidators.required]],
      currencyId: ['', [CustomValidators.required]],
      dailyRate: ['', [CustomValidators.required]],
      dismantleDays: [''],
      notes: [''],
      locationId: ['', [CustomValidators.required]],
      operationId: ['', [CustomValidators.required]],
      parentLocationPoId: [''],
      percentIsrWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      percentVat: ['', [CustomValidators.checkUptoFourDecimal]],
      percentVatWithholding: ['', [CustomValidators.checkUptoFourDecimal]],
      preparationDays: [''],
      projectId: [''],
      requesteByUserId: [''],
      scouterId: ['', [CustomValidators.required]],
      shootingDays: [''],
      totalAmountRequested: [''],
      subtotal: [''],
      paymentDate: ['', [CustomValidators.required]],
      isSubLocation: [false],
      masterLocation: ['']
    })
  }
  /*method to create location po  form*/

  detectChangedInput() {
    this.searchLocationSubscription = this.searchLocation
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => this.getPOLocations(str));
  }
  /**
* It gets supplier search query parameters from the filter form and returns it.
*/
  getSupplierQueryParam(searchStr) {
    let params: HttpParams = new HttpParams();
    searchStr = searchStr.trim();
    if (searchStr) {
      params = params.append(this.QUERY_PARAMS.name, searchStr.toString());
    }
    return params;
  }
  /*
       getRequestedByList method use to get requested users from webservice
   */
  getRequestedByList() {
    this._sharedService.getReuestedByFreelancers().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let requestedByList = response.payload.results;
          this.requestedByList = Common.getMultipleSelectArr(requestedByList, ["id"], ["i18n", "name"]);
        } else {
          this.requestedByList = [];
        }
      } else {
        this.requestedByList = [];
      }
    },
      error => {
        this.requestedByList = [];
      });
  }
  /*
        getRequestedByList method use to get requested users from webservice
    */

  /*
     method to get payment modes  from webservice
   */
  getModesOfOperation() {
    this.mode = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }
  /*
     method to get payment modes  from webservice
   */

  /*
     get budgetLine from webservice of respective projectId
   */
  getPOBudgetLine(projectId) {
    this._sharedService.getPOBudgetLine(projectId, PURCHASE_ORDER_CONST.location).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let budgetLineList = response.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(budgetLineList, ['id'], ["budgetLine"]);
        } else {
          this.budgetLineList = [];
        }
      } else {
        this.budgetLineList = [];
      }
    },
      error => {
        this.budgetLineList = [];
      });
  }
  /*
      get budgetLine from webservice of respective projectId
    */

  /*
   method to set currency & mode of operations as per scouter selected
 */
  scouterSelected(id, setFormDetailsFlag = true) {
    let scouterObj = _.find(this.locationScouter, { 'id': id });
    this.paidVia = "";
    if (scouterObj && scouterObj.thirdPartyVendor) {
      this.paidVia = scouterObj.thirdPartyVendor.commercialName;
    }

    if (scouterObj && setFormDetailsFlag) {
      this.locationPOForm.patchValue({
        currencyId: scouterObj.currencyId,
        operationId: scouterObj.operationId
      });
    }
  }
  /*
    method to set currency & mode of operations as per scouter selected
  */
  /*
       getLocationScouter method use to get locationScouter from webservice
   */
  getLocationScouter() {
    this._sharedService.getLocationScouter().subscribe((response: any) => {
      this.setLocationScouterDetails(response);
    },
      error => {
        this.locationScouter = [];
      });
  }


  setLocationScouterDetails(response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      if (response.payload && response.payload.results) {
        this.locationScouter = response.payload.results;
        this.scouter = Common.getMultipleSelectArr(this.locationScouter, ['id'], ['i18n', 'displayName']);
      } else {
        this.locationScouter = [];
      }
    } else {
      this.locationScouter = [];
    }
  }



  /*
       getLocationScouter method use to get locationScouter from webservice
   */

  /*
       getCurrencies method use to get currencies from webservice
   */
  getCurrencies() {
    this._sharedService.getProjectCurrencies(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.currencies = response.payload.result;
          this.currency = Common.getMultipleSelectArr(this.currencies, ['id'], ['code']);
        } else {
          this.currencies = [];
        }
      } else {
        this.currencies = [];
      }
    },
      error => {
        this.currencies = [];
      });
  }
  /*
       getCurrencies method use to get currencies from webservice
   */

  /*
      getPOLocations method use to get PO locations from webservice
   */
  getPOLocations(str) {
    this._sharedService.getPOLocations(this.getSupplierQueryParam(str)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.poLocations = response.payload.results;
          this.locations = Common.getMultipleSelectArr(this.poLocations, ['id'], ['i18n', 'name']);
          if (this.locationPOId) {
            this.setLocationPOFormValues(this.locationPOFormDetails);
            this.checkFinancialDetails(this.selectedLocationId);
          }
        } else {
          this.locations = [];
        }
      } else {
        this.locations = [];
      }
    },
      error => {
        this.locations = [];
      });
  }
  /*
     getPOLocations method use to get PO locations from webservice
  */

  /*method to get master locations po */
  getMasterLocations() {
    this._sharedService.getMasterLocations(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          let masterLocations = response.payload.results;
          masterLocations.forEach((obj) => {
            obj['name'] = obj.location.i18n.name + " " + "(PO#" + obj.purchaseOrderNumber + ")";
          });
          this.masterLocations = Common.getMultipleSelectArr(masterLocations, ['id'], ['name']);
        } else {
          this.masterLocations = [];
        }
      } else {
        this.masterLocations = [];
      }
    },
      error => {
        this.masterLocations = [];
      });
  }
  /*method to get master locations po */

  /*method to  location's Check financial details*/
  checkFinancialDetails(selectedLocationId) {
    let locationObj = _.find(this.poLocations, { 'id': selectedLocationId });
    if (locationObj) {
      this.financialDetails = locationObj.incompleteFinancialDetails;
    }
    else {
      this.financialDetails = false;
    }
  }
  /*method to  location's Check financial details*/

  /*
      method  to add OR edit location PO
   */
  addLocationPO() {
    // this.spinnerFlag = true;
    this.submmitedFormFlag = true;
    if (this.locationPOForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      this.submmitedFormFlag = false;
      let formvalue = this.locationPOForm.value;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      let finalPOData = AddPOLocationData.getFormData(formvalue);
      finalPOData['projectId'] = this.projectId;
      finalPOData['projectBudgetId'] = this.budgetId;
      if (!this.locationPOId) {
        this.createLocationPO(finalPOData);
      } else {
        this.updateLocationPO(finalPOData);

      }

    }
    else {
      this.scrollToInvalidControl();
    }
  }
  /*
       method  to add OR edit location PO
    */

  /*method to scroll to invalid form control if validation fails*/
  scrollToInvalidControl() {
    let target;
    for (var i in this.locationPOForm.controls) {
      if (!this.locationPOForm.controls[i].valid) {
        target = this.locationPOForm.controls[i];
        break;
      }
    }
    if (target) {
      this.spinnerFlag = false;

      let el = $('.ng-invalid:not(form):first');
      $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
        el.focus();
      });
    }
  }
  /*method to scroll to invalid form control if validation fails*/

  /*method to create  location po*/
  createLocationPO(finalPOData) {
    this.adLocationPOService.postData(finalPOData).
      subscribe((responseData: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;
        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]).then(() =>
            this.toastrService.success(responseData.header.message)
          )
        } else {

          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.isClicked = false;
          this.spinnerFlag = false;
        });
  }
  /*method to create  location po*/

  /*method to update existing  location po*/
  updateLocationPO(finalPOData) {
    this.adLocationPOService.postDataById(finalPOData, this.locationPOId).
      subscribe((responseData: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;

        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]).then(() =>
            this.toastrService.success(responseData.header.message)
          )
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.spinnerFlag = false;
          this.isClicked = false;
        });
  }

  /*method to update existing  location po*/
  /*
      getEditPODetails method use to get data from webservice of
      particular ID of which you want to update the data
   */
  // getEditPODetails() {
  //   this.adLocationPOService.getLocationPObyID(this.locationPOId).subscribe((response: any) => {
  //     if (Common.checkStatusCodeInRange(response.header.statusCode)) {


  //     }
  //   });
  // }

  setEditPoDetails(response) {
    if (Common.checkStatusCodeInRange(response.header.statusCode)) {
      this.editLocationPOData = response.payload.result;
      this.locationPOFormDetails = AddPOLocationData.setWebServiceDetails(this.editLocationPOData);
      this.searchResultsWithLocationName();
    }
  }

  searchResultsWithLocationName() {
    if (this.locationPOFormDetails.locationName) {
      this.searchLocation.next(this.locationPOFormDetails.locationName.trim());
    }
  }
  /**
   * setLocationPOFormValues method use to set the the form details to form
   * @param  locationPOFormDetails as object which contains webservice data of particular ID

   */
  setLocationPOFormValues(locationPOFormDetails) {
    this.selectedLocationId = locationPOFormDetails.locationId;
    this.locationPOForm.patchValue({
      beneficiary: locationPOFormDetails.beneficiary,
      budgetLine: locationPOFormDetails.budgetLine,
      currencyId: locationPOFormDetails.currencyId,
      dailyRate: locationPOFormDetails.dailyRate,
      dismantleDays: locationPOFormDetails.dismantleDays,
      notes: locationPOFormDetails.notes,
      locationId: locationPOFormDetails.locationId,
      operationId: locationPOFormDetails.operationId,
      percentIsrWithholding: locationPOFormDetails.percentIsrWithholding,
      percentVat: locationPOFormDetails.percentVat,
      percentVatWithholding: locationPOFormDetails.percentVatWithholding,
      preparationDays: locationPOFormDetails.preparationDays,
      projectId: locationPOFormDetails.projectId,
      requesteByUserId: locationPOFormDetails.requesteByUserId,
      scouterId: locationPOFormDetails.scouterId,
      shootingDays: locationPOFormDetails.shootingDays,
      totalAmountRequested: locationPOFormDetails.totalAmountRequested,
      paymentDate: locationPOFormDetails.paymentDate,
      isSubLocation: locationPOFormDetails.isSubLocation,
      masterLocation: locationPOFormDetails.masterLocation,
    });
    this.updateAmount();
  }

  /*method to update total amount as per daily rate & no of days*/
  updateAmount() {
    let formvalue = this.locationPOForm.value;
    if (isNaN(this.locationPOForm.value.dailyRate)) {
      this.locationPOForm.controls['dailyRate'].setValue(0);
    }
    this.totalDays = (formvalue.preparationDays ? parseInt(formvalue.preparationDays) : 0) + (formvalue.shootingDays ? parseInt(formvalue.shootingDays) : 0) + (formvalue.dismantleDays ? parseInt(formvalue.dismantleDays) : 0);
    this.totalAmt = this.totalDays * parseFloat(this.locationPOForm.value.dailyRate);
    this.locationPOForm.patchValue({
      totalAmountRequested: this.totalAmt
    })
    this.updateSubtotal();
  }
  /*method to update total amount as per daily rate & no of days*/

  /*method to autofill 0 value if field is blank*/
  checkField(controlName) {
    let formvalue = this.locationPOForm.value;
    if (isNaN(formvalue[controlName]) || formvalue[controlName] === '.') {
      this.locationPOForm.controls[controlName].setValue(0);
    }
  }
  /*method to autofill 0 value if field is blank*/

  /*method to calculate sub total value*/
  updateSubtotal() {
    let formvalue = this.locationPOForm.value;
    if (isNaN(formvalue.percentVat) || formvalue.percentVat === '.') {
      this.locationPOForm.controls['percentVat'].setValue(0);
    }
    if (formvalue.percentVat == 0) {
      this.subTotal = parseFloat(formvalue.percentVat) + parseFloat(this.totalAmt);
    }
    // if (formvalue.percentVat && this.totalAmt) {
      let calculatedValue: any = (parseFloat(this.totalAmt) * parseFloat(formvalue.percentVat)) / 100;
      this.subTotal = ( calculatedValue ? parseFloat(calculatedValue) : 0) + (this.totalAmt ? parseFloat(this.totalAmt) : 0 );
    // }
    this.updatePayableAmount();
  }
  /*method to calculate sub total value*/
  updatePayableAmount() {
    if (this.subTotal) {
      // tslint:disable-next-line:max-line-length
      this.payableAmount = (this.subTotal - (((this.totalAmt * this.locationPOForm.value.percentVatWithholding) / 100) + ((this.totalAmt * this.locationPOForm.value.percentIsrWithholding) / 100)));
    } else {
      this.payableAmount = 0;
    }
  }

  /*method to set or remove dynamic validations based on sub location field*/
  subLocationCheckSelected(value) {
    if (value) {
      this.locationPOForm.controls['masterLocation'].setValidators([CustomValidators.required]);
    }
    else {
      this.locationPOForm.controls['masterLocation'].setValidators([]);
    }
    this.locationPOForm.controls['masterLocation'].updateValueAndValidity();
  }
  /*method to set or remove dynamic validations based on sub location field*/

  /*method to set default PO values*/
  getPODefaultValues() {
    this._sharedService.getPODefaultValues().subscribe((response: any) => {

      if (Common.checkStatusCode(response.header.statusCode)) {
        let defaultValueObj = response.payload.result;
        if (!this.locationPOId) {
          this.locationPOForm.patchValue({
            percentVat: defaultValueObj.vat,
            percentIsrWithholding: defaultValueObj.isrWithHolding,
            percentVatWithholding: defaultValueObj.vatWithHolding
          })
        }
      }
    },
      error => {
      });
  }
  /*method to set default PO values*/

  /*method to navigate back to PO listing*/
  navigateTo() {
    this.router.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]);
  }

  setValueZero(field) {
    const formvalue = this.locationPOForm.value;
    if (!formvalue[field]) {
      this.locationPOForm.controls[field].setValue(0);
    }
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';
import { CustomValidators, Common, SessionService, NavigationService, TriggerService } from '@app/common';
import { ROUTER_LINKS_FULL_PATH, LOCAL_STORAGE_CONSTANTS, EVENT_TYPES, ACTION_TYPES } from '@app/config';
import { CurrenciesService } from './currencies.service';
import { ToastrService } from 'ngx-toastr';
import { ManageCurrenciesData } from './currencies.data.model';
import * as _ from 'lodash';
import { SharedData } from '@app/shared/shared.data';
import { ProjectsData } from '../../../projects.data';
@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {
  currenciesForm: FormGroup;
  currencies: any = [];
  projectId: any;
  isClicked = false;
  value: any;
  error: any;
  spinnerFlag = false;
  submmitedFormFlag = false;
  sourceCurrencyId: any;
  sourceCurrencyCode: any;
  sourceUnit: any;
  showLoadingFlg = false;
  budgetId: any;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  permissionObj: any = {};
  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _currenciesService: CurrenciesService,
    private toastrService: ToastrService,
    private navigationService: NavigationService,
    private triggerService: TriggerService,
    private route: ActivatedRoute,
    private sharedData: SharedData,
    private projectsData: ProjectsData) { }

  ngOnInit() {
    this.showLoadingFlg = true;
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setPermissionsDetails();
    this.createCurrenciesForm();
    this.getCurrencies();


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
  checkRate(currencyConversionGroup: FormGroup) {
    if (isNaN(currencyConversionGroup.value.targetUnit)) {
      currencyConversionGroup.controls['targetUnit'].setValue(0);
    }
  }
  createCurrenciesForm() {
    this.currenciesForm = this.fb.group({
      currencyConversionArr: this.fb.array([])
    });
  }
  getCurrencyConversionsData() {
    this._currenciesService.getCurrencyConversionsData(this.budgetId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const currencyConversionArr = response.payload.result.conversionRates;
          if (currencyConversionArr.length > 0) {

            this.sourceCurrencyCode = currencyConversionArr[0].sourceCode;
            this.sourceCurrencyId = currencyConversionArr[0].sourceCurrencyId;
            this.sourceUnit = currencyConversionArr[0].sourceUnit;
          }
          this.createCurrencyConversionArr(currencyConversionArr);
        }
      } else {
        // this.currencies = [];
      }
    },
      error => {
        this.showLoadingFlg = false;
      }
    );
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.spinnerFlag) {
        this.updateCurrencyConversions();
      }
    }
  }
  createCurrencyConversionArr(currencyConversionDataArr) {
    const currencyConversionArr = <FormArray>this.currenciesForm.get('currencyConversionArr');
    currencyConversionArr.controls = [];
    for (let i = 0; i < currencyConversionDataArr.length; i++) {
      const currencyConversionGroup = this.createCurrencyConversionGroup(currencyConversionDataArr[i]);
      this.currencyChanged(currencyConversionGroup.value.targetCurrencyId);
      currencyConversionArr.push(currencyConversionGroup);
    }
  }
  createCurrencyConversionGroup(data) {
    return this.fb.group({
      isEditable: [data.isEditable ? data.isEditable : false],
      sourceCurrencyId: [data.sourceCurrencyId ? data.sourceCurrencyId : ''],
      targetCurrencyId: [data.targetCurrencyId ? data.targetCurrencyId : '', [CustomValidators.required]],
      sourceCurrencyName: [data.sourceCurrencyName ? data.sourceCurrencyName : ''],
      targetCurrencyName: [data.targetCurrencyName ? data.targetCurrencyName : ''],
      sourceCode: [data.sourceCode ? data.sourceCode : ''],
      targetCode: [data.targetCode ? data.targetCode : ''],
      sourceUnit: [data.sourceUnit ? data.sourceUnit : ''],
      targetUnit: [(data.targetUnit || data.targetUnit == 0) ? data.targetUnit : '', [CustomValidators.required, CustomValidators.checkDecimal]],
      currencies: [this.getFilteredCurrencies()]
    });
  }
  getCurrencies() {
    this._sharedService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.currencies = response.payload.results;
          this.getCurrencyConversionsData();
        } else {
          this.currencies = [];
          this.showLoadingFlg = false;
        }
      } else {
        this.currencies = [];
        this.showLoadingFlg = false;
      }
    }, error => {
      this.currencies = [];
      this.showLoadingFlg = false;
    });
  }

  getFilteredCurrencies() {
    const formValue = this.currenciesForm.value;
    const selectedCurrencyIds = _.map(formValue.currencyConversionArr, 'targetCurrencyId');
    const currencies = JSON.parse(JSON.stringify(this.currencies));
    let filteredCurrencyIds = [];
    if (selectedCurrencyIds.length > 0) {
      currencies.forEach((obj, index) => {
        if (!selectedCurrencyIds.includes(obj.id)) {
          obj['text'] = obj.code;
          filteredCurrencyIds.push(obj);
        }
      });
    }
    else {
      filteredCurrencyIds = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(currencies)), ['id'], ['code']);
    }
    return filteredCurrencyIds;
  }
  currencyChanged(value) {
    const currencyConversionArr = <FormArray>this.currenciesForm.get('currencyConversionArr');
    for (let i = 0; i < currencyConversionArr.length; i++) {
      const formGroup = <FormGroup>currencyConversionArr.controls[i];
      if (value !== formGroup.value.targetCurrencyId) {
        const currencies: any = JSON.parse(JSON.stringify(formGroup.value.currencies));
        _.remove(currencies, { 'id': value });
        formGroup.controls['currencies'].setValue(currencies);
      }

    }
  }
  deleteRow(index) {
    if (index !== 0) {
      const currencyConversionArr = <FormArray>this.currenciesForm.controls['currencyConversionArr'];
      currencyConversionArr.removeAt(index);
    }
  }
  addRow(row: FormGroup) {
    const formValue = row.value;
    if (formValue.targetCurrencyId && formValue.targetUnit) {
      this.submmitedFormFlag = false;
      const obj = {
        sourceCurrencyId: this.sourceCurrencyId,
        sourceCode: this.sourceCurrencyCode,
        sourceUnit: this.sourceUnit,
        isEditable: true
      };
      const currencyConversionArr = <FormArray>this.currenciesForm.controls['currencyConversionArr'];
      const currencyConversionGroup = this.createCurrencyConversionGroup(obj);
      currencyConversionArr.push(currencyConversionGroup);
    }
    else {
      this.submmitedFormFlag = true;
    }

  }
  showOption(currencyId) {
    const currencyConversionArr = this.currenciesForm.value.currencyConversionArr;
    if (currencyConversionArr.length > 0) {
      const obj = _.find(currencyConversionArr, { 'targetCurrencyId': currencyId });
      if (obj) {
        return false;
      } else {
        return true;
      }
    }
    else {
      return true;
    }
  }
  updateCurrencyConversions() {
    this.submmitedFormFlag = true;
    if (this.currenciesForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      const formvalue = this.currenciesForm.value;
      const obj = {};
      const finalData = ManageCurrenciesData.getWebServiceDetails(formvalue.currencyConversionArr);
      obj['conversionRates'] = finalData;
      this._currenciesService.updataData(this.budgetId, obj).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.submmitedFormFlag = false;
          this.spinnerFlag = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.triggerService.setEvent({ type: EVENT_TYPES.currencyConversionEvent, prevValue: false, currentValue: true });
            // tslint:disable-next-line:max-line-length
            this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectsData.projectId, this.budgetId])]).then(() =>
              this.toastrService.success(responseData.header.message)
            );
          } else {
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.isClicked = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });
    }
  }
  navigateTo() {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectsData.projectId, this.budgetId])]);
  }
}

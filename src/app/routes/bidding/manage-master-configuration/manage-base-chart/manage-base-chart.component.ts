import { Component, OnInit, ViewEncapsulation, OnDestroy, HostListener, Optional } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators, Common, NavigationService } from '@app/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageMasterConfigService } from '../manage-master-configuration.services';
import { ManageRateData } from '../manage-master-configuration.data.model';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { DEFAULT_MASTER_CONFIG_CURRENCY, ROUTER_LINKS_FULL_PATH } from '@app/config';
import * as _ from 'lodash';
import { DEFAULT_CURRENCY } from '../../Constants';
import { BiddingService } from '../../bidding.service';
import { ManageBidData } from '../../manage-bid/manage-bid.data';

@Component({
  selector: 'app-manage-base-chart',
  templateUrl: './manage-base-chart.component.html',
  styleUrls: ['./manage-base-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageBaseChartComponent implements OnInit, OnDestroy {
  add1stCameraAsstFocusPullerFlag: Boolean;
  addCameraOperatorFlag: Boolean;
  addDirectorOfPhotographyFlag: Boolean;
  addScriptSupervisorFlag: Boolean;
  add2ndADFlag: Boolean;
  isBiddingListParentPath: Boolean = false;
  submitBaseForm: Boolean = false;
  addProducerFlag: Boolean;
  showLoadingFlg: Boolean = false;
  dealsBaseRateForm: FormGroup;
  isClicked: Boolean = false;
  spinnerFlag: Boolean = false;
  subFormArr: any = [];
  tempViewArray: any = [];
  tempPostArray: any = [];
  count: any = 0;
  defaultCurrency = ['1'];
  currencies: any[];
  baseChartList: any;
  baseRatesatesArray: FormArray;
  projectId: any;
  error: any;
  DEFAULT_MASTER_CONFIG_CURRENCY = DEFAULT_MASTER_CONFIG_CURRENCY;
  renderPage: Boolean = false;
  BASE_LIST_QUERY_PARAMS = {
    'projectId': 'projectId',
  };
  POST_ARR_CONSTANT = {
    'section': 'B',
    'sectionName': 'Shooting Crew',
    'budgetLine': 50
  };
  currencyDropdown: any = [];
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private _baseRateListService: ManageMasterConfigService,
    private toastrService: ToastrService,
    @Optional() public manageBidData: ManageBidData,
    private _biddingService: BiddingService,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.route.parent.parent.parent.parent.params.subscribe(params => {
      this.projectId = params.id;
    });
    this.setCurrencies();
    this.createDealsBaseRateForm();
    this.isBiddingListParentPath = this.route.snapshot.parent.parent.data['isBiddingList'];
    this.getBaseChartList();
  }

  ngOnDestroy() {
    this.projectId = '';
  }
  /**
   * Creates Base rate list form group
   */
  createDealsBaseRateForm() {
    this.dealsBaseRateForm = this.dealsBaseRateFormGroup();
  }
  /**
   * Creates parent form array in Parent Form group
   */
  dealsBaseRateFormGroup(): FormGroup {
    return this.fb.group({
      baseRateArr: this.fb.array([]),
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
      if (!this.spinnerFlag) {
        this.saveBaseRateChart();
      }
    }
  }
  /**
   * Creates form gorup in form array structure and binds web service data
   * @param addCategoryFlag as to check whethe category is added manually or bound by web service
   * @param baseRatelist as web service data instance
   */
  dealsArr(addCategoryFlag, baseRatelist, extraBudgetLine): FormGroup {
    return this.fb.group({
      section: addCategoryFlag ? 'A' : [baseRatelist.section],
      sectionName: addCategoryFlag ? 'PRE-PRO & WRAP CREW' : [baseRatelist.sectionName],
      budgetLineNo: addCategoryFlag ? (extraBudgetLine + 1).toString() : [baseRatelist.budgetLineNo],
      headName: [baseRatelist.headName, [CustomValidators.required]],
      currencyId: [this.DEFAULT_MASTER_CONFIG_CURRENCY.id],
      description: baseRatelist.description ? [baseRatelist.description] : '',
      rate: [baseRatelist.rate, [CustomValidators.checkDecimal]],
      extra: addCategoryFlag
    });
  }
  /**
* Sets deal currency dropdown
*/
  setCurrency() {
    // const defaultCurrencyObj = DEFAULT_CURRENCY;
    // defaultCurrencyObj['code'] = defaultCurrencyObj['name'];
    // this.currencyDropdown.push(DEFAULT_CURRENCY);
  }
  setCurrencies() {
    this._biddingService.getCurrencies().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.currencyDropdown = response.payload.results;
        } else {
          this.currencyDropdown = [];
        }
      } else {
        this.currencyDropdown = [];
      }
    },
      error => {
        this.currencyDropdown = [];
      });
  }
  /**
   *
   * @param addCategoryFlag Checks Manually added categories
   * @param baseRatelist Sets default categories and patches manually added categories
   * @param index To check validation at particular index
   */
  addDeals(addCategoryFlag, baseRatelist, index = 0) {
    const dealsObj = <FormArray>this.dealsBaseRateForm.controls['baseRateArr'];
    if (addCategoryFlag) {
      const dealFormGrp = dealsObj.controls[index];
      if (dealFormGrp.value.headName !== null) {
        const tempindex = index + 1;
        const lastIndexObj = dealsObj.value[dealsObj.value.length - 1];

        dealsObj.push(this.dealsArr(addCategoryFlag, '', tempindex));
        this.submitBaseForm = false;
        this.count++;
      } else {
        this.submitBaseForm = true;
      }
    } else {
      dealsObj.push(this.dealsArr(addCategoryFlag, baseRatelist, index));
    }
  }
  /**
   * Removes manually added category
   * @param index as at which index the category needs to be removed
   */
  removeDeals(index) {
    const dealsObj = <FormArray>this.dealsBaseRateForm.controls['baseRateArr'];
    dealsObj.removeAt(index);
    this.tempPostArray.splice(index, 1);
    for (let i = index; i < this.tempPostArray.length; i++) {
      this.tempPostArray[i].budgetLineNo = this.tempPostArray[i].budgetLineNo - 1;
    }
    this.count--;
  }
  /**
   * Gets Base rate list from web sevicethis.postBudgetLine.toString(),
   */
  getBaseChartList() {
    this.showLoadingFlg = true;
    this._baseRateListService.getMasterConfigList(this.projectId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.baseChartList = response.payload.result;
          if (this.baseChartList.baseRate.categories.length > 0) {
            const arrLength = this.baseChartList.baseRate.categories.length / 2;
            const tempArr = this.baseChartList.baseRate.categories.splice(0, arrLength);
            this.tempViewArray = tempArr;
            this.setFormArrayData(this.tempViewArray);
          } else {
            this.renderPage = true;
          }
        } else {
          this.baseChartList = [];
          this.showLoadingFlg = false;
        }
      }
    },
      error => {
        this.showLoadingFlg = false;
      }
    );
  }

  /**
   * Sets Web service data in Form Array structre
   * @param baseRatelist as webservice data to be set in the form array
   */
  setFormArrayData(baseRatelist) {
    if (baseRatelist) {
      this.count = 0;
      this.baseRatesatesArray = <FormArray>this.dealsBaseRateForm.controls['baseRateArr'];
      for (let i = 0; i < baseRatelist.length; i++) {
        this.addDeals(false, baseRatelist[i]);
        this.baseRatesatesArray.controls[i].patchValue({
          'currencyId': baseRatelist[i].currencyId
        });
        if (this.projectId) {
          this.baseRatesatesArray.controls[i].patchValue({
            'extra': !baseRatelist[i].extra ? false : true,

          });
          if (baseRatelist[i].extra) {
            this.count++;
          }
        }
      }
    }
    this.renderPage = true;
  }

  /**
   * Posts Master configuration data to web service
   */
  saveBaseRateChart() {
    this.submitBaseForm = true;
    this.spinnerFlag = true;
    this.isClicked = true;
    this.subFormArr = [];
    if (this.dealsBaseRateForm.valid) {
      const formObj = this.dealsBaseRateForm.value;
      for (let i = 0; i < formObj.baseRateArr.length; i++) {
        this.subFormArr.push(formObj.baseRateArr[i]);
      }
      const totalBaseRateArr = _.cloneDeep(this.subFormArr);

      for (let index = 0; index < totalBaseRateArr.length; index++) {
        totalBaseRateArr[index]['section'] = this.POST_ARR_CONSTANT.section;
        totalBaseRateArr[index]['sectionName'] = this.POST_ARR_CONSTANT.sectionName;
        totalBaseRateArr[index]['budgetLineNo'] = this.POST_ARR_CONSTANT.budgetLine + (index + 1);
        this.subFormArr.push(totalBaseRateArr[index]);
      }
      const formvalue = ManageRateData.setManageRateData(this.subFormArr, this.projectId, true);
      this._baseRateListService.putBaseChartList(this.projectId, formvalue).subscribe((response: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.toastrService.success(response.header.message);
        } else {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.toastrService.error(response.header.message);
        }
      }, error => {
        this.spinnerFlag = false;
        this.isClicked = false;
        this.toastrService.error(this.error.errorMessages.responseError);
      });
    } else {
      this.isClicked = false;
      this.spinnerFlag = false;
    }
  }

  /**
   * Cancel button navigation
   */
  navigateTo() {
    if (this.isBiddingListParentPath) {
      this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.bidding]);
    } else {
      this.manageBidData.navigateToEitherBasicInfoOrPassesTab();
    }
  }
  updateRate(index) {
    const formvalue = this.dealsBaseRateForm.value;
    if (isNaN(formvalue.baseRateArr[index].rate)) {
      const baseRateArray = <FormArray>this.dealsBaseRateForm.controls['baseRateArr'];
      const dealFormGrp = <FormGroup>baseRateArray.controls[index];
      dealFormGrp.patchValue({
        'rate': 0
      });
    }
  }
}

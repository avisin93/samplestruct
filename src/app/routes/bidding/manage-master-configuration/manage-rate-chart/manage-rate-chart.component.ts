import { Component, OnInit, ViewEncapsulation, OnDestroy, HostListener, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Common, CustomValidators, NavigationService } from '@app/common';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ManageMasterConfigService } from '../manage-master-configuration.services';
import { ManageRateData } from '../manage-master-configuration.data.model';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_MASTER_CONFIG_CURRENCY, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { DEFAULT_CURRENCY, BIDDING_ROUTER_LINKS_FULL_PATH } from '../../Constants';
import { BiddingService } from '../../bidding.service';
import { ManageBidData } from '../../manage-bid/manage-bid.data';
declare var $: any;

@Component({
  selector: 'app-manage-rate-chart',
  templateUrl: './manage-rate-chart.component.html',
  styleUrls: ['./manage-rate-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageRateChartComponent implements OnInit, OnDestroy {
  ratesBaseRateForm: FormGroup;
  subRatesFormGroup: FormGroup;
  subForm: FormGroup;
  showLoadingFlg: Boolean = false;
  renderPage: Boolean = false;
  rateList: any;
  tempRateListArr: any = [];
  isClicked: Boolean = false;
  spinnerFlag: Boolean = false;
  showNoRecord: Boolean = false;
  submitRateForm: Boolean = false;
  filteredData: Array<any>;
  defaultCurrency = ['1'];
  isBiddingListParentPath: Boolean = false;
  showAdditionalColumns: Boolean = false;
  subFormArr: any = [];
  DEFAULT_MASTER_CONFIG_CURRENCY = DEFAULT_MASTER_CONFIG_CURRENCY;
  currencies: any;
  RATE_LIST_QUERY_PARAMS = {
    'projectId': 'projectId',
  };
  ratesArray: any;
  ratesFormGroup: FormGroup;
  subRatesArray: FormArray;
  currencyDropdown: any = [];
  currencyArr: any[];
  count: any = 0;
  tempObj: { section: any; sectionName: any, subCategoryArr: any[]; };
  typeKeyArr: any;
  projectId: any;
  error: any;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private _rateListService: ManageMasterConfigService,
    private toastrService: ToastrService,
    private _biddingService: BiddingService,
    @Optional() public manageBidData: ManageBidData,
    private navigationService: NavigationService) { }

  ngOnInit() {
    this.route.parent.parent.parent.parent.params.subscribe(params => {
      this.projectId = params.id;
    });
    this.isBiddingListParentPath = this.route.snapshot.parent.parent.data['isBiddingList'];
    this.setCurrencies();
    this.getRateChartList();
    this.createRateBaseRateForm();
    this.addRatesFormGroup();
  }
  ngOnDestroy() {
    this.projectId = '';
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
        this.saveRateChart();
      }
    }
  }
  /**
  * Creates Rate rate list form group
  */
  createRateBaseRateForm() {
    this.ratesBaseRateForm = this.rateBaseRateFormGroup();
  }
  /**
  * Creates parent form array in Parent Form group
  */
  rateBaseRateFormGroup(): FormGroup {
    return this.fb.group({
      ratesArr: this.fb.array([])
    });
  }
  /**
 * Creates form gorup in form array structure
 */
  createRatesArr(): FormGroup {
    return this.fb.group({
      dealName: [''],
      section: [''],
      isSubCategoryOpen: false,
      subRatesArr: this.fb.array([])
    });
  }
  /**
* Creates form group sub form array structure
*/
  createSubRatesArray(): FormGroup {
    return this.fb.group({
      category: [''],
      categoryName: [''],
      budgetLine: [''],
      subBudgetLine: [''],
      subDealName: [''],
      description: [''],
      currency: [this.DEFAULT_MASTER_CONFIG_CURRENCY.id],
      rate: ['', [CustomValidators.checkDecimal]],
      placeHolder: [''],
      isVisible: [''],
      budgetLineNoToShow: [''],
      reference: ['']
    });
  }
  /**
* Sets deal currency dropdown
*/
  setCurrency() {
    const defaultCurrencyObj = DEFAULT_CURRENCY;
    defaultCurrencyObj['code'] = defaultCurrencyObj['name'];
    this.currencyDropdown.push(DEFAULT_CURRENCY);
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
  // Get Rate list data from webservice
  getRateChartList() {
    this._rateListService.getMasterConfigList(this.projectId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.rateList = response.payload.result;
          const tempList = this.rateList.rateChart.categories;
          if (this.rateList.rateChart.categories.length > 0) {
            this.showNoRecord = false;
            for (let i = 0; i < tempList.length; i++) {
              const tempCategoryArr = _.filter(tempList, { 'section': tempList[0].section });
              this.tempObj = {
                section: tempList[0].section,
                sectionName: tempList[0].sectionName,
                subCategoryArr: tempCategoryArr
              };
              this.tempRateListArr.push(this.tempObj);
              _.remove(tempList, { 'section': tempList[0].section });
            }
            this.setVisiblity(this.tempRateListArr);
            this.setFormArrayData(this.tempRateListArr);
          } else {
            this.showNoRecord = true;
            this.renderPage = true;
          }
        } else {
          this.rateList = [];
          this.ratesArray = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
          this.ratesArray.controls = [];
        }
      }
    }, error => {
      this.showLoadingFlg = false;
      this.rateList = [];
      this.ratesArray = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
      this.ratesArray.controls = [];
    });
  }
  setVisiblity(ratelist) {
    if (ratelist) {
      for (let i = 0; i < ratelist.length; i++) {
        for (let j = 0; j < ratelist[i].subCategoryArr.length; j++) {
          ratelist[i].subCategoryArr[j]['isVisible'] = true;
        }
        for (let j = 0; j < ratelist[i].subCategoryArr.length; j++) {
          if (ratelist[i].subCategoryArr[j].reference) {
            ratelist[i].subCategoryArr[j]['budgetLineNoToShow'] = ratelist[i].subCategoryArr[j].budgetLineNo;
            const referenceArr = ratelist[i].subCategoryArr[j].reference;
            for (let referenceIndex = 0; referenceIndex < referenceArr.length; referenceIndex++) {
              ratelist[i].subCategoryArr[j]['budgetLineNoToShow'] = ratelist[i].subCategoryArr[j]['budgetLineNoToShow'] + ' ,' + referenceArr[referenceIndex];
              const index1 = _.findIndex(ratelist[i].subCategoryArr, { 'budgetLineNo': referenceArr[referenceIndex] });
              ratelist[i].subCategoryArr[index1]['isVisible'] = false;
            }
          }
        }
      }
    }
  }

  /**
   * Adds form group in form array
   */
  addRatesFormGroup() {
    const ratesArr = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
    ratesArr.push(this.createRatesArr());

  }
  /**
 * Adds form group in sub form array
 */
  addSubRatesFormGroup(index) {
    const ratesArr = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
    this.subForm = <FormGroup>this.ratesArray.controls[index];
    const subFormArray = <FormArray>this.subForm.controls['subRatesArr'];
    subFormArray.push(this.createSubRatesArray());
  }
  /**
   * Sets Rate list data in form array structure
   * @param ratelist as Ratelist data
   */
  setFormArrayData(ratelist) {
    if (ratelist) {
      this.ratesArray = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
      for (let i = 0; i < ratelist.length; i++) {
        if (i && ratelist[i].section) {
          this.addRatesFormGroup();
        }
        this.ratesFormGroup = <FormGroup>this.ratesArray.controls[i];
        this.ratesArray.controls[i].patchValue({
          'section': ratelist[i].section,
          'dealName': ratelist[i].sectionName,
          'isSubCategoryOpen': false
        });
        this.subRatesArray = <FormArray>this.ratesFormGroup.controls['subRatesArr'];
        for (let j = 0; j < ratelist[i].subCategoryArr.length; j++) {
          if (ratelist[i].subCategoryArr[j].budgetLineNo) {
            this.addSubRatesFormGroup(i);
          }
          this.subRatesArray.controls[j].patchValue({
            'category': ratelist[i].subCategoryArr[j].section,
            'categoryName': ratelist[i].subCategoryArr[j].sectionName,
            'budgetLine': ratelist[i].subCategoryArr[j].budgetLineNo,
            'subCategoryId': ratelist[i].subCategoryArr[j].budgetLineNo,
            'subBudgetLine': ratelist[i].subCategoryArr[j].budgetLineNo,
            'subDealName': ratelist[i].subCategoryArr[j].headName,
            'description': ratelist[i].subCategoryArr[j].description,
            'currency': ratelist[i].subCategoryArr[j].currencyId,
            'rate': ratelist[i].subCategoryArr[j].rate,
            'placeHolder': ratelist[i].subCategoryArr[j].placeHolder,
            'isVisible': ratelist[i].subCategoryArr[j].isVisible,
            'budgetLineNoToShow': ratelist[i].subCategoryArr[j].budgetLineNoToShow ? ratelist[i].subCategoryArr[j].budgetLineNoToShow : '',
            'reference': ratelist[i].subCategoryArr[j].reference ? ratelist[i].subCategoryArr[j].reference : ''
          });
        }
        this.renderPage = true;
      }
    } else {
      this.rateList = [];
      this.ratesArray = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
      this.ratesArray.controls = [];
    }
  }
  /**
   * Toggles '+' '-' functionality
   * @param category as which category to show or hide
   * @param type as display or hide
   * @param e as event
   */
  showHideCategoryDetails(category, type, e) {
    e.stopPropagation();
    if (type === 'show') {
      $('.sub-category_' + category.value.section).show();
      $('.category-plus.category_' + category.value.section).hide();
      $('.category-minus.category_' + category.value.section).show();
      category.controls['isSubCategoryOpen'].setValue(true);
      this.showAdditionalColumns = true;
      this.count++;
    } else {
      $('.sub-category_' + category.value.section).hide();
      $('.category-plus.category_' + category.value.section).show();
      $('.category-minus.category_' + category.value.section).hide();
      category.controls['isSubCategoryOpen'].setValue(false);
      this.count--;
    }
    if (this.count === 0) {
      this.showAdditionalColumns = false;
    }
  }
  /**
   * Posts Rate list data to web service
   */
  saveRateChart() {
    this.submitRateForm = true;
    this.spinnerFlag = true;
    this.isClicked = true;
    this.subFormArr = [];
    if (this.ratesBaseRateForm.valid) {
      const formObj = this.ratesBaseRateForm.value;
      for (let i = 0; i < formObj.ratesArr.length; i++) {
        for (let j = 0; j < formObj.ratesArr[i].subRatesArr.length; j++) {
          if (formObj.ratesArr[i].subRatesArr[j].reference) {
            const referenceArr = formObj.ratesArr[i].subRatesArr[j].reference;
            for (let referenceIndex = 0; referenceIndex < referenceArr.length; referenceIndex++) {
              const index1 = _.findIndex(formObj.ratesArr[i].subRatesArr, { 'budgetLine': referenceArr[referenceIndex] });
              formObj.ratesArr[i].subRatesArr[index1].rate = formObj.ratesArr[i].subRatesArr[j].rate;
            }
          }
          this.subFormArr.push(formObj.ratesArr[i].subRatesArr[j]);
        }
      }
      const formvalue = ManageRateData.setManageRateData(this.subFormArr, this.projectId, false);
      if (this.projectId) {
        formvalue['projectId'] = this.projectId;
      }
      this._rateListService.putBaseChartList(this.projectId, formvalue).subscribe((response: any) => {
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
      this.spinnerFlag = false;
      this.isClicked = false;
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
  updateRate(categoryIndex, subCategoryIndex) {
    const formvalue = this.ratesBaseRateForm.value;
    if (isNaN(formvalue.ratesArr[categoryIndex].subRatesArr[subCategoryIndex].rate)) {
      const rateChartArray = <FormArray>this.ratesBaseRateForm.controls['ratesArr'];
      const dealFormGrp = <FormGroup>rateChartArray.controls[categoryIndex];
      const subrateChartArray = <FormArray>dealFormGrp.controls['subRatesArr'];
      const subratedealFormGrp = <FormGroup>subrateChartArray.controls[subCategoryIndex];
      subratedealFormGrp.patchValue({
        'rate': 0
      });
    }
  }
}

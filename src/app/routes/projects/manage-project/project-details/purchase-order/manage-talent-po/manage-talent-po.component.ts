import { Component, OnInit, HostListener, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '@app/routes/projects/projects.data';
import { Common, NavigationService, CustomValidators, SessionService } from '@app/common';
import { ROUTER_LINKS_FULL_PATH, TALENT_TYPES, OPERATION_TYPES_ARR, COOKIES_CONSTANTS, defaultDatepickerOptions } from '@app/config';
import { SharedService } from '@app/shared/shared.service';
import { ManageTalentPoService } from './manage-talent-po.service';
import { ManageTalentPoDataModel } from './manage-talent-po.data.model';
import { YEARS, MONTHS, WEEKS } from '../purchase-order.constants';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-manage-talent-po',
  templateUrl: './manage-talent-po.component.html',
  styleUrls: ['./manage-talent-po.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageTalentPoComponent implements OnInit, OnDestroy {
  manageTalentPOForm: FormGroup;
  showLoadingFlag: Boolean = true;
  submmitedFormFlag: Boolean = false;
  budgetId: String = '';
  projectId: String = '';
  modes: any = [];
  currencies: any = [];
  budgetLineList: any = [];
  individualList: any = [];
  agencyList: any = [];
  territoryList: any = [];
  rolesList: any = [];
  categoriesList: any = [];
  servicesList: any = [];
  mediaList: any = [];
  TALENT_TYPES = TALENT_TYPES;
  YEARS = YEARS;
  MONTHS = MONTHS;
  WEEKS = WEEKS;
  submittedTermsFlag: boolean = false;
  TALENT_TYPES_OBJ: any = Common.keyValueDropdownArr(TALENT_TYPES, 'text', 'id');
  public searchTypedAgencyName = new BehaviorSubject<string>('');
  public searchTypedIndividualName = new BehaviorSubject<string>('');
  agencyNameSubscription: Subscription;
  individualNameSubscription: Subscription;
  isLoadingIndividualName: boolean;
  isLoadingAgencyName: boolean;
  disableButtonFlag: boolean = false;
  spinnerFlag: boolean = false;
  talentPoId: string = '';
  talentPoDetails: any = {};
  selectedBudgetLineId: string = '';
  totalAmount: any = 0;
  agencyFeeAmount: any = 0;
  cost: any = 0;
  ivaAmount: any = 0;
  markupAmount: any = 0;
  defaultCurrency: any = {};
  commonLocaleObj: any;
  settings = {
    singleSelection: false,
    text: 'Select',
    labelKey: 'childName',
    primaryKey: 'childId',
    selectAllText: 'Select All',
    enableFilterSelectAll: false,
    enableCheckAll: false,
    badgeShowLimit: 5,
    groupBy: 'parentName'
  };
  commonLabelsObj: any = {};
  datePickerOptions = JSON.parse(JSON.stringify(defaultDatepickerOptions));
  constructor(private navigationService: NavigationService,
    private projectsData: ProjectsData,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private _manageTalentPoService: ManageTalentPoService,
    private _sharedService: SharedService,
    private translateService: TranslateService) {
    this.datePickerOptions.disableUntil = {
      year: Common.getTodayDate().getFullYear(), month: Common.getTodayDate().getMonth() + 1, day: Common.getTodayDate().getDate() - 1
    };
  }

  ngOnInit() {
    Common.scrollTOTop();
    this.setLocaleObj();
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.createManageTalentPOForm();
    // this.checkTermsFieldValidation();
    this.setLocaleTranslation();

    this.route.params.subscribe(params => {
      this.talentPoId = params['talentPoId'];
      if (this.talentPoId) {
        this.setTalentPODetails();
      } else {
        this.getPageDetails();
        this.detectChangedInput();
      }
    });

  }

  ngOnDestroy() {
    if (this.individualNameSubscription) {
      this.individualNameSubscription.unsubscribe();
    }
    if (this.agencyNameSubscription) {
      this.agencyNameSubscription.unsubscribe();
    }
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  // @HostListener('document:keydown', ['$event'])
  // onKeyDownHandler(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (!this.spinnerFlag && !this.disableButtonFlag) {
  //       this.saveTalentPODetails();
  //     }
  //   }
  // }
  createManageTalentPOForm() {
    this.manageTalentPOForm = this.fb.group({
      talentType: [this.TALENT_TYPES_OBJ.agency],
      budgetLine: ['', [CustomValidators.required]],
      itemDescription: ['', [CustomValidators.required]],
      modeOfOperation: [''],
      agency: ['', [CustomValidators.required]],
      talent: ['', [CustomValidators.required]],
      agencyName: [''],
      talentName: [''],
      currencyId: ['', [CustomValidators.required]],
      service: ['', [CustomValidators.required]],
      category: ['', [CustomValidators.required]],
      role: ['', [CustomValidators.required]],
      media: ['', [CustomValidators.required]],
      territory: ['', [CustomValidators.required]],
      termsSelected: [false],
      years: ['', CustomValidators.required],
      months: ['', CustomValidators.required],
      weeks: ['', CustomValidators.required],
      amount: ['', [CustomValidators.requiredWithout0, CustomValidators.checkDecimal]],
      agencyFee: ['0', [CustomValidators.required, CustomValidators.checkUptoFourDecimal]],
      markup: ['0', [CustomValidators.checkUptoFourDecimal]],
      iva: ['0', [CustomValidators.required, CustomValidators.checkUptoFourDecimal]],
      notes: ['', [CustomValidators.required]],
      paymentDate: ['', [CustomValidators.required]]
    });
  }
  /*Sets biddings labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('common').subscribe(res => {
      this.commonLabelsObj = res;
    });
  }
  checkTermsFieldValidation() {
    this.submittedTermsFlag = true;
    let formValue = this.manageTalentPOForm.value;
    if (formValue.years || formValue.months || formValue.weeks) {
      this.manageTalentPOForm.controls['termsSelected'].setValue(true);
      this.manageTalentPOForm.controls['years'].clearValidators();
      this.manageTalentPOForm.controls['months'].clearValidators();
      this.manageTalentPOForm.controls['weeks'].clearValidators();
    } else {
      this.manageTalentPOForm.controls['termsSelected'].setValue(false);
      this.manageTalentPOForm.controls['years'].setValidators([CustomValidators.requiredWithout0]);
      this.manageTalentPOForm.controls['months'].setValidators([CustomValidators.requiredWithout0]);
      this.manageTalentPOForm.controls['weeks'].setValidators([CustomValidators.requiredWithout0]);
    }
    this.manageTalentPOForm.controls['years'].updateValueAndValidity();
    this.manageTalentPOForm.controls['months'].updateValueAndValidity();
    this.manageTalentPOForm.controls['weeks'].updateValueAndValidity();
  }
  onCurrencyChange(currencyId) {
    this.defaultCurrency.id = currencyId;
    const currencyobj = _.find(this.currencies, { 'id': currencyId });
    if (currencyobj) {
      this.defaultCurrency.name = currencyobj.text;
    } else {
      this.defaultCurrency.name = '';
    }
  }
  getPageDetails() {
    this.setModesOfOperation();
    if (!this.talentPoId) {
      this.setIndividualList();
    }
    const combined = Observable.forkJoin(
      this._manageTalentPoService.getTalentBudgetLines(this.budgetId),
      this._sharedService.getProjectCurrencies(this.budgetId),
      this._manageTalentPoService.getTalentMedia(),
      this._manageTalentPoService.getTalentRole(),
      this._manageTalentPoService.getTalentServices(),
      this._manageTalentPoService.getTalentCategories(),
      this._manageTalentPoService.getTalentTerritory()
    );
    combined.subscribe((latestValues: any) => {
      this.showLoadingFlag = false;
      let budgetLinesResponse: any = latestValues[0];
      let currenciesResponse: any = latestValues[1];
      let mediaResponse: any = latestValues[2];
      let rolesResponse: any = latestValues[3];
      let servicesResponse: any = latestValues[4];
      let categoriesResponse: any = latestValues[5];
      let territoryResponse: any = latestValues[6];
      if (budgetLinesResponse && Common.checkStatusCodeInRange(budgetLinesResponse.header.statusCode)) {
        if (budgetLinesResponse.payload && budgetLinesResponse.payload.results) {
          const budgetLineList = budgetLinesResponse.payload.results;
          this.budgetLineList = Common.getMultipleSelectArr(budgetLineList, ['id'], ['budgetLine']);
        } else {
          this.budgetLineList = [];
        }
      }
      if (currenciesResponse && Common.checkStatusCodeInRange(currenciesResponse.header.statusCode)) {
        if (currenciesResponse.payload && currenciesResponse.payload.result) {
          let currencies = currenciesResponse.payload.result;
          this.currencies = Common.getMultipleSelectArr(currencies, ['id'], ['code']);
        } else {
          this.currencies = [];
        }
      }
      if (mediaResponse && Common.checkStatusCodeInRange(mediaResponse.header.statusCode)) {
        if (mediaResponse.payload && mediaResponse.payload.results) {
          const mediaList = mediaResponse.payload.results;
          this.mediaList = this.changeMediaListStructure(mediaList);
          if (this.talentPoId) {
            this.setSelectedMediaItems();
          }

        } else {
          this.mediaList = [];
        }
      }
      if (rolesResponse && Common.checkStatusCodeInRange(rolesResponse.header.statusCode)) {
        if (rolesResponse.payload && rolesResponse.payload.results) {
          const rolesList = rolesResponse.payload.results;
          this.rolesList = Common.getMultipleSelectArr(rolesList, ['id'], ['i18n', 'name']);
        } else {
          this.rolesList = [];
        }
      }
      if (categoriesResponse && Common.checkStatusCodeInRange(categoriesResponse.header.statusCode)) {
        if (categoriesResponse.payload && categoriesResponse.payload.results) {
          const categoriesList = categoriesResponse.payload.results;
          this.categoriesList = Common.getMultipleSelectArr(categoriesList, ['id'], ['i18n', 'name']);
        } else {
          this.categoriesList = [];
        }
      }
      if (servicesResponse && Common.checkStatusCodeInRange(servicesResponse.header.statusCode)) {
        if (servicesResponse.payload && servicesResponse.payload.results) {
          const servicesList = servicesResponse.payload.results;
          this.servicesList = Common.getMultipleSelectArr(servicesList, ['id'], ['i18n', 'name']);
        } else {
          this.servicesList = [];
        }
      }
      if (territoryResponse && Common.checkStatusCodeInRange(territoryResponse.header.statusCode)) {
        if (territoryResponse.payload && territoryResponse.payload.results) {
          const territoryList = territoryResponse.payload.results;
          this.territoryList = Common.getMultipleSelectArr(territoryList, ['id'], ['i18n', 'name']);
        } else {
          this.territoryList = [];
        }
      }
    }, (error) => {
      this.showLoadingFlag = false;
    }
    )
  }
  searchResultsWithSelectedAgencyOrIndividualName() {
    let formValue = this.manageTalentPOForm.value;
    if (formValue.agencyName) {
      this.searchTypedAgencyName.next(formValue.agencyName.trim());
    }
    if (formValue.talentName) {
      this.searchTypedIndividualName.next(formValue.talentName.trim());
    }
  }
  setTalentPODetails() {
    this._manageTalentPoService.getTalentPODetails(this.talentPoId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        let talentPoDetails = response.payload.result;
        this.talentPoDetails = ManageTalentPoDataModel.getFormDetails(talentPoDetails);
        this.setFormValues(this.talentPoDetails);
        this.updateAgencyValidation();
        this.getPageDetails();
        this.searchResultsWithSelectedAgencyOrIndividualName();
        this.detectChangedInput();
        // this.getAllDependentLists(this.manageTalentPOForm.value.budgetLine);
        this.calculateAllAmounts();
      } else {
        this.showLoadingFlag = false;
        this.talentPoDetails = {};
        this.toastrService.error(this.commonLabelsObj.errorMessages.error);
      }
    },
      error => {
        this.showLoadingFlag = false;
        this.talentPoDetails = {};
      });
  }
  setFormValues(talentPoDetails) {
    this.manageTalentPOForm.setValue(talentPoDetails);
    this.selectedBudgetLineId = talentPoDetails.budgetLine;
  }
  /**Calculate talent po taxation amount */
  calculateAllAmounts() {
    this.updateAgencyFeeAmount();
    this.updateIvaAmount();
    this.updateMarkupAmount();
    this.updateTotalAmount();
  }
  getSearchQueryParam(canSetParam, str?: any) {
    let params: HttpParams = new HttpParams();
    if (canSetParam) {
      params = params.append('projectBudgetConfigId', this.selectedBudgetLineId);
    }
    if (str) {
      params = params.append('name', str ? str.toString() : str);
    }

    return params;
  }
  getAllDependentLists(budgetLineId) {
    if (typeof budgetLineId === 'string') {
      this.selectedBudgetLineId = budgetLineId;
      this.setTalentDropdownLists();
    }
  }
  updateAgencyValidation() {
    let formValue = this.manageTalentPOForm.value;
    if (formValue.talentType == this.TALENT_TYPES_OBJ.individual) {
      this.manageTalentPOForm.controls["agency"].clearValidators();
    } else {
      this.manageTalentPOForm.controls["agency"].setValidators([CustomValidators.required]);
    }
    this.manageTalentPOForm.controls["agency"].updateValueAndValidity();
  }
  setTalentDropdownLists() {
    let formValue = this.manageTalentPOForm.value;
    this.resetTalentDropdownLists(false);
    if (formValue.talentType == this.TALENT_TYPES_OBJ.agency) {
      if (this.selectedBudgetLineId) {
        this.setAgencyList(true);
      }
      this.setIndividualList(false);
    } else if (formValue.talentType == this.TALENT_TYPES_OBJ.individual) {
      this.setAgencyList(false);
      if (this.selectedBudgetLineId) {
        this.setIndividualList(true);
      }
    }
  }
  resetTalentDropdownLists(clearSelectedBudgetLine: boolean) {
    this.agencyList = [];
    this.individualList = [];
    this.manageTalentPOForm.patchValue({
      agency: '',
      talent: ''
    })
    if (clearSelectedBudgetLine) {
      this.selectedBudgetLineId = "";
    }
  }

  /**
   * It detects change in organizations and contact persons dropdoen search
   */
  detectChangedInput() {
    this.agencyNameSubscription = this.searchTypedAgencyName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => {
        this.getListByBudgetConfigId(str, 'agency');
      });

    this.individualNameSubscription = this.searchTypedIndividualName
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((str) => {
        this.getListByBudgetConfigId(str, 'individual');

      });
  }

  /**
  * Translates component side text messages
  */
  setLocaleTranslation() {
    this.translateService.get('common').subscribe(res => {
      this.commonLocaleObj = res;
      if (this.commonLocaleObj) {
        this.settings.text = this.commonLocaleObj.labels.select;
      }
    });
  }


  getListByBudgetConfigId(searchStr, dropdownType) {
    const formValue = this.manageTalentPOForm.value;
    if (dropdownType === 'agency') {
      if (formValue.talentType == this.TALENT_TYPES_OBJ.agency) {
        if (this.selectedBudgetLineId) {
          this.setAgencyList(true, searchStr);
        }
      } else {
        this.setAgencyList(false, searchStr);
      }
    } else {
      if (formValue.talentType == this.TALENT_TYPES_OBJ.individual) {
        if (this.selectedBudgetLineId) {
          this.setIndividualList(true, searchStr);
        }
      } else {
        this.setIndividualList(false, searchStr);
      }
    }
  }



  setIndividualList(canSetParam: boolean = false, searchStr: any = '') {
    this.isLoadingIndividualName = true;
    this.individualList = [];
    this._manageTalentPoService.getIndividualList(this.getSearchQueryParam(canSetParam, searchStr)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const individualList = response.payload.results;
          this.individualList = Common.getMultipleSelectArr(individualList, ['id'], ['i18n', 'name']);
        } else {
          this.individualList = [];
        }
        this.isLoadingIndividualName = false;
      } else {
        this.individualList = [];
        this.isLoadingIndividualName = false;
      }
    },
      error => {
        this.individualList = [];
        this.isLoadingIndividualName = false;
      });
  }

  setAgencyList(canSetParam: boolean = false, searchStr: any = '') {
    this.isLoadingAgencyName = true;
    this.agencyList = [];

    this._manageTalentPoService.getTalentAgencies(this.getSearchQueryParam(canSetParam, searchStr)).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          const agencyList = response.payload.results;
          this.agencyList = Common.getMultipleSelectArr(agencyList, ['id'], ['i18n', 'name']);
        } else {
          this.agencyList = [];
        }
        this.isLoadingAgencyName = false;
      } else {
        this.agencyList = [];
        this.isLoadingAgencyName = false;
      }
    },
      error => {
        this.agencyList = [];
        this.isLoadingAgencyName = false;
      });
  }

  setSelectedMediaItems() {
    let selectedMediaArr = this.manageTalentPOForm.value.media;
    selectedMediaArr.forEach((obj) => {
      let mediaObj = _.find(this.mediaList, { 'childId': obj.childId, 'parentId': obj.parentId });
      if (mediaObj) {
        obj['childName'] = mediaObj.childName;
        obj['parentName'] = mediaObj.parentName;
      }
    });
    this.manageTalentPOForm.controls['media'].setValue(selectedMediaArr);
  }
  changeMediaListStructure(mediaList) {
    const dataArr = [];
    mediaList.forEach((parentObj: any) => {
      if (parentObj) {
        parentObj.childrens.forEach((childObj) => {
          if (childObj) {
            const newObj = {
              childId: childObj.id,
              childName: (childObj.i18n && childObj.i18n.name) ? childObj.i18n.name : '',
              parentId: parentObj.id,
              parentName: (parentObj.i18n && parentObj.i18n.name) ? parentObj.i18n.name : ''
            };
            dataArr.push(newObj);
          }

        });
      }
    });
    return dataArr;
  }

  setModesOfOperation() {
    this.modes = Common.changeDropDownValues(this.translateService, OPERATION_TYPES_ARR);
  }

  saveTalentPODetails() {
    this.submmitedFormFlag = true;
    this.submittedTermsFlag = true;
    const formvalue = this.manageTalentPOForm.value;
    this.checkTermsFieldValidation();


    if (this.manageTalentPOForm.valid && formvalue.termsSelected) {

      this.disableButtonFlag = true;
      this.spinnerFlag = true;
      formvalue['langCode'] = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
      const finalPOData = ManageTalentPoDataModel.getWebServiceDetails(formvalue);
      finalPOData['projectId'] = this.projectId;
      finalPOData['projectBudgetId'] = this.budgetId;
      if (!this.talentPoId) {
        this._manageTalentPoService.addTalentPO(finalPOData).
          subscribe((responseData: any) => {
            this.submmitedFormFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.toastrService.success(responseData.header.message);
              this.navigateTo();
            } else {

              this.toastrService.error(responseData.header.message);
            }
            this.disableButtonFlag = false;
            this.spinnerFlag = false;
          },
            error => {
              this.disableButtonFlag = false;
              this.spinnerFlag = false;
              this.toastrService.error(this.commonLocaleObj.errorMessages.error);
            });
      } else {
        this._manageTalentPoService.updateTalentPO(this.talentPoId, finalPOData).
          subscribe((responseData: any) => {
            this.disableButtonFlag = false;
            this.spinnerFlag = false;
            this.submmitedFormFlag = false;
            if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
              this.toastrService.success(responseData.header.message);
              this.navigateTo();
            } else {
              this.toastrService.error(responseData.header.message);
            }
          },
            error => {
              this.spinnerFlag = false;
              this.disableButtonFlag = false;
              this.toastrService.error(this.commonLocaleObj.errorMessages.error);
            });
      }
    }
    else {
      Common.scrollToInvalidControl(this, this.manageTalentPOForm, 'spinnerFlag');
    }
  }
  /**
** Checks entered value is integer or not for markup insurance & exchange rate formgroups
** @param formGroup as FormGroup  to get form value
** @param formControlName as string 
**/
  checkIntegerValue(formControlName: string) {
    const formvalue = this.manageTalentPOForm.value;
    let value = formvalue[formControlName];
    if (isNaN(formvalue[formControlName])) {
      value = 0;
    } else if ((formControlName != 'amount') && formvalue[formControlName] > 100) {
      value = 100;
    }
    this.manageTalentPOForm.controls[formControlName].setValue(value);
  }

  /**
  * Updates blank input to 0
  * @param formControlName as control name
  */
  updateInput(formControlName: string) {
    const formvalue = this.manageTalentPOForm.value;
    let value = formvalue[formControlName];
    if (!formvalue[formControlName]) {
      value = 0;
    }
    this.manageTalentPOForm.controls[formControlName].setValue(value);
  }
  /**
   * Calulates totAal amount
   */
  updateTotalAmount() {
    const formValue = this.manageTalentPOForm.value;
    this.totalAmount = 0;
    const amount = (formValue.amount) ? parseFloat(formValue.amount) : 0;
    const agencyFee = (this.agencyFeeAmount) ? parseFloat(this.agencyFeeAmount) : 0;
    const iva = (this.ivaAmount) ? parseFloat(this.ivaAmount) : 0;
    const markup = (this.markupAmount) ? parseFloat(this.markupAmount) : 0;
    this.totalAmount = amount + agencyFee + iva + markup;
  }
  /**
   * Calculates markup amount
   */
  updateMarkupAmount() {
    const formValue = this.manageTalentPOForm.value;
    this.markupAmount = 0;
    this.markupAmount = ((( formValue.amount ? parseFloat(formValue.amount) : 0) + ( this.agencyFeeAmount ? parseFloat(this.agencyFeeAmount) : 0)) * ((formValue.markup ? parseFloat(formValue.markup) : 0) / 100));
  }
  /**
   * Calculates agency fee amount
   */
  updateAgencyFeeAmount() {
    const formValue = this.manageTalentPOForm.value;
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = ((formValue.amount ? parseFloat(formValue.amount) : 0) * (( formValue.agencyFee ? parseFloat(formValue.agencyFee) : 0 ) / 100));
  }
  /**
   * Calculates IVA amount
   */
  updateIvaAmount() {
    const formValue = this.manageTalentPOForm.value;
    this.cost = (parseFloat(formValue.amount) + parseFloat(this.agencyFeeAmount));
    this.ivaAmount = 0;
    this.ivaAmount = ((this.cost ? parseFloat(this.cost) : 0 ) * (( formValue.iva ? parseFloat(formValue.iva) : 0 ) / 100));

  }

  navigateTo() {
    this.navigationService.navigate(Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId]));
  }

}

import { Component, OnInit, HostListener } from '@angular/core';
import { ROUTER_LINKS_FULL_PATH, LOCAL_STORAGE_CONSTANTS, ACTION_TYPES } from '@app/config';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, Common, NavigationService, SessionService } from '@app/common';
import { PaymentTermsService } from './payment-terms.service';
import { ManagePaymentTermsData } from './payment-terms.data.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SharedData } from '@app/shared/shared.data';
import { ProjectsData } from '../../../projects.data';
@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss']
})
export class PaymentTermsComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  submmitedFormFlag = false;
  isClicked = false;
  paymentTermsForm: FormGroup;
  paymentTermsDetails: any;
  projectId: any;
  value: any;
  error: any;
  spinnerFlag = false;
  showLoadingFlg = false;
  permissionObj:any={};
  rows: any = [{
    name: 'freelancer'
  },
  {
    name: 'vendor'
  },
  {
    name: 'location'
  },
  {
    name: 'talentDayRate'
  },
  {
    name: 'talentBuyOut'
  }
  ];
  budgetId: any;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  constructor(private fb: FormBuilder,
    private _paymentTermsService: PaymentTermsService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private sharedData: SharedData,
    private projectsData: ProjectsData,
    private toastrService: ToastrService,
     private translate: TranslateService) { }

  ngOnInit() {
    this.showLoadingFlg = true;
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setPermissionsDetails();
    this.createPaymentTermsForm();
    this.getPaymentTermData();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
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
  createPaymentTermsForm() {
    this.paymentTermsForm = this.fb.group({
      dayRates: this.fb.array([])
    });
    this.createDayRatesArr();
  }
  createDayRatesArr() {
    const dayRatesData = this.paymentTermsForm.get('dayRates') as FormArray;
    dayRatesData.controls = [];
    for (let i = 0; i < this.rows.length; i++) {
      const dayRatesDataFormGroup = this.createDayRateGroup();
      dayRatesDataFormGroup.controls['name'].setValue(this.rows[i].name);
      dayRatesDataFormGroup.controls['value'].disable();
      dayRatesData.push(dayRatesDataFormGroup);
    }
  }
  createDayRateGroup() {
    return this.fb.group({
      name: [''],
      check: [''],
      value: ['']
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
    this.updatePaymentTerms();
    }
  }
}
  getPaymentTermData() {
    this._paymentTermsService.getPaymentTermData(this.budgetId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const paymentTermsDetails = response.payload.result;
          this.paymentTermsDetails = ManagePaymentTermsData.getFormDetails(paymentTermsDetails);
          this.setFormValues(this.paymentTermsDetails);
        } else {
          this.paymentTermsDetails = {};
        }
      } else {
        this.paymentTermsDetails = {};
      }
    },
      error => {
        this.paymentTermsDetails = {};
        this.showLoadingFlg = false;
      });
  }
  setFormValues(paymentTermsDetails) {
    const dayRatesDataArr = this.paymentTermsForm.get('dayRates') as FormArray;
    const freelancerFrmGrp = <FormGroup>dayRatesDataArr.controls[0];
    const vendorFrmGrp = <FormGroup>dayRatesDataArr.controls[1];
    const locationFrmGrp = <FormGroup>dayRatesDataArr.controls[2];
    const talentDayRateFrmGrp = <FormGroup>dayRatesDataArr.controls[3];
    const talentBuyOutFrmGrp = <FormGroup>dayRatesDataArr.controls[4];
    freelancerFrmGrp.controls['value'].setValue(paymentTermsDetails.freelancer);
    vendorFrmGrp.controls['value'].setValue(paymentTermsDetails.vendor);
    locationFrmGrp.controls['value'].setValue(paymentTermsDetails.location);
    talentDayRateFrmGrp.controls['value'].setValue(paymentTermsDetails.talentDayRate);
    talentBuyOutFrmGrp.controls['value'].setValue(paymentTermsDetails.talentBuyOut);
    if (paymentTermsDetails.freelancer) {
      freelancerFrmGrp.controls['value'].enable();
      freelancerFrmGrp.controls['check'].setValue(true);
      freelancerFrmGrp.controls['value'].setValidators([CustomValidators.required]);
    }
    if (paymentTermsDetails.vendor) {
      vendorFrmGrp.controls['value'].enable();
      vendorFrmGrp.controls['check'].setValue(true);
      vendorFrmGrp.controls['value'].setValidators([CustomValidators.required]);
    }
    if (paymentTermsDetails.location) {
      locationFrmGrp.controls['value'].enable();
      locationFrmGrp.controls['check'].setValue(true);
      locationFrmGrp.controls['value'].setValidators([CustomValidators.required]);
    }
    if (paymentTermsDetails.talentDayRate) {
      talentDayRateFrmGrp.controls['value'].enable();
      talentDayRateFrmGrp.controls['check'].setValue(true);
      talentDayRateFrmGrp.controls['value'].setValidators([CustomValidators.required]);
    }
    if (paymentTermsDetails.talentBuyOut) {
      talentBuyOutFrmGrp.controls['value'].enable();
      talentBuyOutFrmGrp.controls['check'].setValue(true);
      talentBuyOutFrmGrp.controls['value'].setValidators([CustomValidators.required]);
    }
  }
  rowChecked(value, dayRateFormGroup: FormGroup) {
    if (value) {
      dayRateFormGroup.controls['value'].enable();
      dayRateFormGroup.controls['value'].setValidators([CustomValidators.required]);
    }
    else {
      dayRateFormGroup.controls['value'].disable();
      dayRateFormGroup.controls['value'].markAsUntouched();
      dayRateFormGroup.controls['value'].setValidators([]);
    }
    dayRateFormGroup.controls['value'].updateValueAndValidity();
  }
  updatePaymentTerms() {
    this.submmitedFormFlag = true;
    if (this.paymentTermsForm.valid) {
      this.isClicked = true;
      this.spinnerFlag = true;
      const formvalue = this.paymentTermsForm.value;
      const finalData = ManagePaymentTermsData.getWebServiceDetails(formvalue.dayRates);
      this._paymentTermsService.updataData(this.budgetId, finalData).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.submmitedFormFlag = false;
          this.spinnerFlag = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
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

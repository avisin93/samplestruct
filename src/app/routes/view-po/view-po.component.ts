import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewPOService } from './view-po.service';
import { Common, SessionService, CustomValidators } from '../../common';
import { ViewPOData } from './view-po.data.model';
import { PAYMENT_FOR, CFDI_CONST, DATE_FORMATS, PAYEE_ACCOUNT_INFO } from '../../config/constants';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../projects/projects.data';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-po',
  templateUrl: './view-po.component.html',
  styleUrls: ['./view-po.component.scss']
})
export class ViewPoComponent implements OnInit {
  POId: any;
  PODetails: any = {};
  PAYMENT_FOR = PAYMENT_FOR;
  vatAmount = 0;
  totalPOAmount: any;
  supplierDetails: any = {};
  supplierDetailsType: any = '';
  showLoadingFlg = false;
  actualPurchaseOrderFor: any;
  poLabels: any = {};
  projectDetails: any;
  showIsrOrVatWithholdingAmount: Boolean = false;
  amountObj = {
    vatAmount: 0,
    isrWithHoldingAmount: 0,
    vatWithHoldingAmount: 0
  };
  DATE_FORMATS = DATE_FORMATS;
  downloadPoUrl = '';
  downloadPoURLFlag = false;
  markupAmount: any;
  totalTalentPOAmount: any;
  agencyFeeAmount: any;
  ivaAmount: any;
  constructor(
    private route: ActivatedRoute,
    private _ViewPOService: ViewPOService,
    private projectsData: ProjectsData,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.translateFunc();
    this.route.params.subscribe(params => {
      this.POId = params['id'];
      this.showLoadingFlg = true;
      this.getDownloadPOUrl();
      this._ViewPOService.getPObyID(this.POId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.PODetails = ViewPOData.setWebServiceDetails(response.payload.result);
          this.projectDetails = this.projectsData.getProjectsData();
          this.showIsrOrVatWithholdingFields();
          if (this.PODetails.thirdPartyVendor) {
            this.supplierDetailsType = PAYMENT_FOR.vendor;
            this.supplierDetails.name = this.PODetails.thirdPartyVendor.name;
            this.supplierDetails.address = this.PODetails.thirdPartyVendor.address;
            this.supplierDetails.phoneNumber = this.PODetails.thirdPartyVendor.phoneNumber;
          } else {
            this.supplierDetails.name = this.PODetails.purchaseOrderForName;
            this.supplierDetails.address = this.PODetails.purchaseOrderForaddress;
            this.supplierDetails.phoneNumber = this.PODetails.phoneNumber;
          }
          this.supplierDetails.taxId = this.PODetails.taxId;
          switch (this.PODetails.purchaseOrderFor) {
            case PAYMENT_FOR.freelancer:
              if (this.PODetails.thirdPartyVendor) {
                this.supplierDetailsType = PAYMENT_FOR.vendor;
              } else {
                this.supplierDetailsType = PAYMENT_FOR.freelancer;
              }
              this.actualPurchaseOrderFor = this.poLabels.freelancer;
              break;
            case PAYMENT_FOR.vendor:
              this.supplierDetailsType = PAYMENT_FOR.vendor;
              this.actualPurchaseOrderFor = this.poLabels.vendor;
              break;
       
            case PAYMENT_FOR.location:
              this.actualPurchaseOrderFor = this.poLabels.location;
              if (this.PODetails.supplierType === PAYMENT_FOR.location) {
                this.supplierDetailsType = PAYMENT_FOR.location;
              } else if (this.PODetails.supplierType === PAYMENT_FOR.freelancer && !this.PODetails.thirdPartyVendor) {
                this.supplierDetailsType = PAYMENT_FOR.freelancer;
              }
              break;
            case PAYMENT_FOR.advance:
              if (this.PODetails.supplierType === PAYMENT_FOR.freelancer) {
                if (this.PODetails.thirdPartyVendor) {
                  this.supplierDetailsType = PAYMENT_FOR.vendor;
                } else {
                  this.supplierDetailsType = PAYMENT_FOR.freelancer;
                }
                this.actualPurchaseOrderFor = this.poLabels.freelancer;
              } else if (this.PODetails.supplierType === PAYMENT_FOR.vendor) {
                this.supplierDetailsType = PAYMENT_FOR.vendor;
                this.actualPurchaseOrderFor = this.poLabels.vendor;
              } else {
                this.actualPurchaseOrderFor = this.poLabels.productionCoordinator;
              }
              break;

            case PAYMENT_FOR.adjustment:
              if (this.PODetails.supplierType === PAYMENT_FOR.freelancer) {
                if (this.PODetails.thirdPartyVendor) {
                  this.supplierDetailsType = PAYMENT_FOR.vendor;
                } else {
                  this.supplierDetailsType = PAYMENT_FOR.freelancer;
                }
                this.actualPurchaseOrderFor = this.poLabels.freelancer;
              } else if (this.PODetails.supplierType === PAYMENT_FOR.vendor) {
                this.supplierDetailsType = PAYMENT_FOR.vendor;
                this.actualPurchaseOrderFor = this.poLabels.vendor;
              } else {
                this.actualPurchaseOrderFor = this.poLabels.productionCoordinator;
              }
              break;

            case PAYMENT_FOR.talent:
                this.supplierDetailsType = PAYMENT_FOR.talent;
                break;
          }
          if (this.PODetails.percentVAT && this.PODetails.percentVAT !== 0) {
            this.vatAmount = (parseFloat(this.PODetails.totalAmountRequested) * parseFloat(this.PODetails.percentVAT)) / 100;
            // this.amountObj['vatAmount'] = this.vatAmount + this.PODetails.totalAmountRequested;
          } else {
            this.vatAmount = 0;
            // this.amountObj['vatAmount'] = this.PODetails.totalAmountRequested;
            this.PODetails.percentVAT = 0;
          }
          this.showLoadingFlg = false;

          if (this.PODetails.supplierType == PAYEE_ACCOUNT_INFO.individual) {
            this.actualPurchaseOrderFor = this.poLabels.capsIndividual;
          } else if (this.PODetails.supplierType == PAYEE_ACCOUNT_INFO.agency) {
            this.actualPurchaseOrderFor = this.poLabels.capsAgency;
          }
        }
      });
    });
  }
  /*method to show or hide vat/isr withholding fields depending on cfdi type*/
  showIsrOrVatWithholdingFields() {
    if (this.PODetails.cfdiType !== CFDI_CONST.factura) {
      this.calculateAmounts();
      this.showIsrOrVatWithholdingAmount = true;
    }
  }
/**
 * Calculate taxation amounts
 */
  calculateAmounts() {
    this.calculateWithHoldingAmount(this.PODetails.percentISRWithholding, 'isrWithHoldingAmount');
    this.calculateWithHoldingAmount(this.PODetails.percentVATWithholding, 'vatWithHoldingAmount');
    this.updateAgencyFeeAmount();
    this.updateMarkupAmount();
    this.updateIVAAmount();
    this.updateTotalAmount();
  }
 /**
  * Calculate Talent total amount
  */
  updateTotalAmount() {
    this.totalTalentPOAmount = 0;
    this.totalTalentPOAmount = parseFloat(this.PODetails.totalAmountRequested) + parseFloat(this.agencyFeeAmount) + parseFloat(this.markupAmount) + parseFloat(this.ivaAmount);
  }
  /**
   * Calculate IVA amount
   */
  updateIVAAmount() {
    this.ivaAmount = 0;
    this.ivaAmount = ((parseFloat(this.PODetails.totalAmountRequested) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.PODetails.iva) / 100));
  }
  /**
   * Calculate markup amount
   */
  updateMarkupAmount() {
    this.markupAmount = 0;
    this.markupAmount = ((parseFloat(this.PODetails.totalAmountRequested) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.PODetails.percentMarkup) / 100));
  }
  /**
   * Calculate agency amount
   */
  updateAgencyFeeAmount() {
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = (parseFloat(this.PODetails.totalAmountRequested) * (parseFloat(this.PODetails.percentAgencyFee) / 100));
  }


  /**
   *method to calculate vatWithholding amount & isrWithholding amount
   @param percentValue as vat or isr Withholding %
   @param key as name of field which is to be calculated
   */
  calculateWithHoldingAmount(percentValue, key) {
    if (percentValue && this.PODetails.totalAmountRequested) {
      if (!isNaN(this.PODetails.totalAmountRequested) && !isNaN(percentValue)) {
        this.amountObj[key] = (parseFloat(this.PODetails.totalAmountRequested) * parseFloat(percentValue)) / 100;

      } else {
        this.amountObj[key] = 0;
      }
    }
  }
  translateFunc() {
    this.translateService.get('common.labels').subscribe((res: string) => {
      this.poLabels['freelancer'] = res['capsFreelancer'];
      this.poLabels['vendor'] = res['capsVendor'];
      this.poLabels['advance'] = res['capsAdvance'];
      this.poLabels['location'] = res['capsLocation'];
      this.poLabels['talent'] = res['capsTalent'];
      this.poLabels['capsIndividual'] = res['capsIndividual'];
      this.poLabels['capsAgency'] = res['capsAgency'];
      this.poLabels['productionCoordinator'] = res['capsProductionCoordinator'];
    });

  }

  getDownloadPOUrl() {
    this._ViewPOService.downloadPo(this.POId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload.result) {
          this.downloadPoUrl = response.payload.result;
          this.downloadPoURLFlag = true;
        } else {
          this.downloadPoURLFlag = false;
        }
      } else {
        this.downloadPoURLFlag = false;
      }
    });
  }
}

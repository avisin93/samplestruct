/** 1.Import third party components
2. Import created modules
3. Import crated services
4. Import created classes
5. Import created constants **/
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ViewInvoicesService } from './view-invoice.service';
import { ViewInvoiceData } from './view-invoice.data.model';
import { Common } from '@app/common';
import { CFDI_CONST, DATE_FORMATS, PAYMENT_FOR, PAYEE_ACCOUNT_INFO } from '@app/config';
import { PURCHASE_ORDER_CONST } from '../projects/manage-project/project-details/purchase-order/purchase-order.constants';



declare var $: any;
@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/
  invoiceId: any;
  invoiceDetails: any = {};
  poDetails: any = {};
  amountObj = {
    vatAmount: 0,
    isrWithHoldingAmount: 0,
    vatWithHoldingAmount: 0
  };
  PAYMENT_FOR = PAYMENT_FOR;
  showIsrOrVatWithholdingAmount: Boolean = false;
  supplierDetails: any = {};
  showLoadingFlg: Boolean = false;
  invoiceForLabel: any;
  commonLabels: any = {};
  DATE_FORMATS = DATE_FORMATS;
  supplierDetailsType: any = '';
  PURCHASE_ORDER_CONST = PURCHASE_ORDER_CONST;
  downloadInvoiceUrl: any;
  downloadInvoiceURLFlag = false;
  totalTalentPOAmount: any;
  markupAmount: any;
  agencyFeeAmount: any;
  ivaAmount: any;
  /*declare variables above constructor in sequence -imported constants,public variable,private variables*/

  /*inicialize constructor after declaration of all variables*/
  constructor(
    private route: ActivatedRoute,
    private _viewInvoiceService: ViewInvoicesService,
    private translateService: TranslateService) { }
  /*inicialize constructor after declaration of all variables*/

  /*all life cycle events whichever required after inicialization of constructor*/
  ngOnInit() {
    this.setCommonLabels();
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      this.showLoadingFlg = true;
      this.getDownloadInvoiceUrl();
      this.setInvoiceDetails();
    });
  }
  /*all life cycle events whichever required after inicialization of constructor*/

  /*method to set invoiceDetails object*/
  setInvoiceDetails() {
    this._viewInvoiceService.getInvoiceById(this.invoiceId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.invoiceDetails = ViewInvoiceData.getInvoiceWebServiceDetails(response.payload.result);
        this.setPODetails(this.invoiceDetails.purchaseOrderId);
        this.calculateVatAmount();
      }
    },
      (error) => {
        this.invoiceDetails = {};
        this.showLoadingFlg = false;
      });
  }
  /*method to set invoiceDetails object*/

  /**
    *method to set poDetails object
    @param poId as purchase order Id
    */
  setPODetails(poId) {
    this._viewInvoiceService.getPObyId(poId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.poDetails = ViewInvoiceData.getPOWebServiceDetails(response.payload.result);
        this.showIsrOrVatWithholdingFields();
        if (this.poDetails.thirdPartyVendor) {
          this.supplierDetailsType = PURCHASE_ORDER_CONST.vendor;
          this.supplierDetails.name = this.poDetails.thirdPartyVendor.name;
          this.supplierDetails.phoneNumber = this.poDetails.thirdPartyVendor.phoneNumber;
          this.supplierDetails.address = this.poDetails.thirdPartyVendor.address;
          this.supplierDetails.taxId = this.poDetails.taxId;
        } else {
          this.supplierDetails.name = this.poDetails.purchaseOrderForName;
          this.supplierDetails.phoneNumber = this.poDetails.phoneNumber;
          this.supplierDetails.address = this.poDetails.purchaseOrderForaddress;
          this.supplierDetails.taxId = this.invoiceDetails.taxId;
        }
        switch (this.poDetails.purchaseOrderFor) {
          case PURCHASE_ORDER_CONST.freelancer:
            if (this.poDetails.thirdPartyVendor) {
              this.supplierDetailsType = PURCHASE_ORDER_CONST.vendor;
            } else {
              this.supplierDetailsType = PURCHASE_ORDER_CONST.freelancer;
            }
            this.invoiceForLabel = this.commonLabels.capsFreelancer;
            break;
          case PURCHASE_ORDER_CONST.vendor:
            this.supplierDetailsType = PURCHASE_ORDER_CONST.vendor;
            this.invoiceForLabel = this.commonLabels.capsVendor;
            break;
          case PURCHASE_ORDER_CONST.location:
            this.supplierDetailsType = PURCHASE_ORDER_CONST.location;
            this.invoiceForLabel = this.commonLabels.capsLocation;
            break;
            case PURCHASE_ORDER_CONST.talent:{
            this.supplierDetailsType = PURCHASE_ORDER_CONST.talent;
            if (this.poDetails.supplierType == PAYEE_ACCOUNT_INFO.individual) {
              this.invoiceForLabel = this.commonLabels.capsIndividual;
            } else if (this.poDetails.supplierType == PAYEE_ACCOUNT_INFO.agency) {
              this.invoiceForLabel = this.commonLabels.capsAgency;
            }}
            break;
        }
      }
    },
      (error) => {
        this.poDetails = {};
        this.showLoadingFlg = false;
      });
  }
  /*method to show or hide vat/isr withholding fields depending on cfdi type*/
  showIsrOrVatWithholdingFields() {
    if (this.poDetails.cfdiType !== CFDI_CONST.factura) {
      this.calculateAmounts();
      this.showIsrOrVatWithholdingAmount = true;
    }
    this.updateAgencyFeeAmount();
    this.updateMarkupAmount();
    this.updateIVAAmount();
  }
  /*method to show or hide vat/isr withholding fields depending on cfdi type*/

  /*methods to calculate all taxation amount for talent PO */
  calculateAmounts() {
    this.calculateWithHoldingAmount(this.invoiceDetails.percentISRWithholding, 'isrWithHoldingAmount');
    this.calculateWithHoldingAmount(this.invoiceDetails.percentVATWithholding, 'vatWithHoldingAmount');
    this.updateAgencyFeeAmount();
    this.updateIVAAmount();
    this.updateMarkupAmount();
    this.updateTotalAmount();
  }
/**
 * Calculate talent total amount
 */
  updateTotalAmount() {
    this.totalTalentPOAmount = 0;
    this.totalTalentPOAmount = parseFloat(this.invoiceDetails.invoiceAmount) + parseFloat(this.agencyFeeAmount) + parseFloat(this.markupAmount) + parseFloat(this.ivaAmount);
  }
  /**
   * Calculate IVA amount
   */
  updateIVAAmount() {
    this.ivaAmount = 0;
    this.ivaAmount = ((parseFloat(this.invoiceDetails.invoiceAmount) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.invoiceDetails.iva) / 100));
  }
  /**
   * Calculate markup amount
   */
  updateMarkupAmount() {
    this.markupAmount = 0;
    this.markupAmount = ((parseFloat(this.invoiceDetails.invoiceAmount) + parseFloat(this.agencyFeeAmount)) * (parseFloat(this.invoiceDetails.percentMarkup) / 100));
  }
  /**
   * Calculate agency amount
   */
  updateAgencyFeeAmount() {
    this.agencyFeeAmount = 0;
    this.agencyFeeAmount = (parseFloat(this.invoiceDetails.invoiceAmount) * (parseFloat(this.invoiceDetails.percentAgencyFee) / 100));
  }

  /**
    *method to calculate vatWithholding amount & isrWithholding amount
    @param percentValue as vat or isr Withholding %
    @param key as name of field which is to be calculated
    */
  calculateWithHoldingAmount(percentValue, key) {
    if (percentValue && this.invoiceDetails.invoiceAmount) {
      if (!isNaN(this.invoiceDetails.invoiceAmount) && !isNaN(percentValue)) {
        this.amountObj[key] = (parseFloat(this.invoiceDetails.invoiceAmount) * parseFloat(percentValue)) / 100;

      } else {
        this.amountObj[key] = 0;
      }
    }
  }

  calculateVatAmount() {
    if (this.invoiceDetails.percentVAT) {
      const calculatedValue: any = (parseFloat(this.invoiceDetails.invoiceAmount) * parseFloat(this.invoiceDetails.percentVAT)) / 100;
      this.amountObj['vatAmount'] = parseFloat(calculatedValue);
    }
  }
  /*methods to calculate all amounts-vatAmount,isrWithHoldingAmount,vatWithHoldingAmount*/

  /*method to set common labels*/
  setCommonLabels() {
    this.translateService.get('common.labels').subscribe((res: string) => {
      this.commonLabels = res;
    });
  }

  getDownloadInvoiceUrl() {
    this._viewInvoiceService.downloadInvoice(this.invoiceId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload.result) {
          this.downloadInvoiceUrl = response.payload.result;
          this.downloadInvoiceURLFlag = true;
        } else {
          this.downloadInvoiceURLFlag = false;
        }
      } else {
        this.downloadInvoiceURLFlag = false;
      }
    });
  }
}

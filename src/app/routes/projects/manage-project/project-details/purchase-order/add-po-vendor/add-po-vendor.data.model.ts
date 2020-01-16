import { Common } from '../../../../../../common';

export class ManageVendorPOData {
  /**
  Returns vendor details data as per formcontrol
  @param vendorDetails as Object
  **/
  static setFormData(vendorDetails: any, tabledata) {
    let vendorFormData;

    if (vendorDetails) {
      let paymentDate;
      if (vendorDetails.paymentDate) {
        const payment = Common.setOffsetToUTC(vendorDetails.paymentDate, '');
        paymentDate = payment['fromDate'];
      }

      vendorFormData = {
        'currencyId': vendorDetails.currencyId ? vendorDetails.currencyId : '',
        'isrWithHolding': vendorDetails.isrWithholding ? parseFloat(vendorDetails.isrWithholding) : 0,
        'operationId': vendorDetails.mode ? vendorDetails.mode : '',
        // "requestedById":vendorDetails.requestedBy ? vendorDetails.requestedBy : "",
        'vat': vendorDetails.vat ? parseFloat(vendorDetails.vat) : 0,
        'vatWithHolding': vendorDetails.vatWithholding ? parseFloat(vendorDetails.vatWithholding) : 0,
        'vendorId': vendorDetails.vendorName ? vendorDetails.vendorName : [],
        'cfdiType': (vendorDetails.typeSelection || vendorDetails.typeSelection === 0) ? vendorDetails.typeSelection : '',
        'paymentDate': paymentDate ? paymentDate : '',
        'i18n': {
          'notes': vendorDetails.notes ? vendorDetails.notes : '',
          'langCode': vendorDetails.langCode ? vendorDetails.langCode : '',
        },
        'budgetLines': tabledata ? ManageVendorPOData.setBudgetLines(tabledata) : [],
      };
    }
    return vendorFormData;
  }
  /**
     Returns vendor details data as per formcontrol
   * @param vendorDetails as Object
   */
  static getFormData(vendorDetails: any) {
    let vendorFormData;
    let paymentDate;
    if (vendorDetails) {
      if (vendorDetails.paymentDate) {
        const payment = Common.removeOffsetFromUTC(vendorDetails.paymentDate);
        paymentDate = Common.getDateObjData(payment);
      }
      vendorFormData = {
        'currencyId': vendorDetails.currencyId ? vendorDetails.currencyId : '',
        // tslint:disable-next-line:max-line-length
        'isrWithHolding': (vendorDetails.percentISRWithholding || vendorDetails.percentISRWithholding === 0) ? parseFloat(vendorDetails.percentISRWithholding) : '',
        'mode': vendorDetails.operationId ? vendorDetails.operationId : '',
        'projectId': vendorDetails.projectId ? vendorDetails.projectId : '',
        // tslint:disable-next-line:max-line-length
        'totalAmount': (vendorDetails.totalAmountRequested || vendorDetails.totalAmountRequested === 0) ? parseFloat(vendorDetails.totalAmountRequested) : '',
        // tslint:disable-next-line:triple-equals
        'vat': (vendorDetails.percentVAT || vendorDetails.percentVAT == 0) ? parseFloat(vendorDetails.percentVAT) : '',
        // tslint:disable-next-line:max-line-length
        'vatWithHolding': (vendorDetails.percentVATWithholding || vendorDetails.percentVATWithholding === 0) ? parseFloat(vendorDetails.percentVATWithholding) : '',
        'vendorName': vendorDetails.vendorId ? vendorDetails.vendorId : '',
        'typeSelection': (vendorDetails.cfdiType || vendorDetails.cfdiType == 0) ? vendorDetails.cfdiType : '',
        'paymentDate': paymentDate ? paymentDate : '',

        'i18n': {
          'notes': vendorDetails.i18n.notes ? vendorDetails.i18n.notes : '',
          'langCode': vendorDetails.i18n.langCode ? vendorDetails.i18n.langCode : '',
        },
        'tabledata': vendorDetails.budgetLines ? ManageVendorPOData.getBudgetLines(vendorDetails.budgetLines) : [],
      };
    }
    return vendorFormData;
  }
  /**
   *Returns Budgetline table data as per formcontrol
   * @param budgetlinedata as Object
   */
  static getBudgetLines(budgetlinedata) {
    const budgetlineArr = [];
    for (let i = 0; i < budgetlinedata.length; i++) {
      budgetlineArr.push({
        'amount': budgetlinedata[i].amount ? parseFloat(budgetlinedata[i].amount) : '',
        'description': budgetlinedata[i].itemDescription ? budgetlinedata[i].itemDescription : '',
        'budgetline': budgetlinedata[i].projectBudgetConfigurationId ? budgetlinedata[i].projectBudgetConfigurationId : '',
        // tslint:disable-next-line:radix
        'quantity': budgetlinedata[i].quantity ? parseInt(budgetlinedata[i].quantity) : ''
      });
    }
    return budgetlineArr;
  }
  /**
       *Returns Budgetline table data as per formcontrol
   * @param budgetlinedata as Object
   */
  static setBudgetLines(budgetlinedata) {
    const budgetlineArr = [];
    for (let i = 0; i < budgetlinedata.length; i++) {
      budgetlineArr.push({
        'amount': budgetlinedata[i].amount ? parseFloat(budgetlinedata[i].amount) : '',
        'itemDescription': budgetlinedata[i].description ? budgetlinedata[i].description : '',
        'projectBudgetConfigurationId': budgetlinedata[i].budgetline ? budgetlinedata[i].budgetline : '',
        // tslint:disable-next-line:radix
        'quantity': budgetlinedata[i].quantity ? parseInt(budgetlinedata[i].quantity) : ''
      });
    }
    return budgetlineArr;
  }
}

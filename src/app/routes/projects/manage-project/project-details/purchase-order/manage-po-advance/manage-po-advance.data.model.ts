import { Common } from '../../../../../../common';

export class ManageAdvancePOData {
  /**
  Returns vendor details data as per formcontrol
  @param advanceDetails as Object
  **/
  static setFormData(advanceDetails: any, tabledata) {
    let advancePOData;

    if (advanceDetails) {
      let paymentDate;
      if (advanceDetails.paymentDate) {
        const payment = Common.setOffsetToUTC(advanceDetails.paymentDate, '');
        paymentDate = payment['fromDate'];
      }
      advancePOData = {
        // tslint:disable-next-line:triple-equals
        'supplierType': (advanceDetails.supplierType || advanceDetails.supplierType == 0) ? advanceDetails.supplierType : '',
        'currencyId': advanceDetails.currencyId ? advanceDetails.currencyId : '',
        'operationId': advanceDetails.modeOfOperation ? advanceDetails.modeOfOperation : '',
        // tslint:disable-next-line:max-line-length
        'supplierId': (advanceDetails.vendorId || advanceDetails.freelancerId) ? (advanceDetails.vendorId || advanceDetails.freelancerId) : '',
        'paymentDate': paymentDate ? paymentDate : '',
        'services': tabledata ? ManageAdvancePOData.setBudgetLines(tabledata) : []
      };
    }
    return advancePOData;
  }
  /**
     Returns advance po details data as per formcontrol
   * @param advanceDetails as Object
   */
  static getFormData(advanceDetails: any) {
    let advancePOData;
    let paymentDate;
    if (advanceDetails) {
      if (advanceDetails.paymentDate) {
        const payment = Common.removeOffsetFromUTC(advanceDetails.paymentDate);
        paymentDate = Common.getDateObjData(payment);
      }
      advancePOData = {
        'supplierType': (advanceDetails.supplierType || advanceDetails.supplierType == 0) ? advanceDetails.supplierType : '',
        'currencyId': advanceDetails.currencyId ? advanceDetails.currencyId : '',
        'operationId': advanceDetails.operationId ? advanceDetails.operationId : '',
        // tslint:disable-next-line:max-line-length
        'supplierId': advanceDetails ? advanceDetails.supplierId : '',
        'paymentDate': paymentDate ? paymentDate : '',
        'services': advanceDetails ? ManageAdvancePOData.getBudgetLines(advanceDetails.services) : [],
        'totalAmountRequested': advanceDetails.totalAmountRequested ? advanceDetails.totalAmountRequested : ''
      };
    }
    return advancePOData;
  }
  /**
   *Returns Budgetline table data as per formcontrol
   * @param budgetlinedata as Object
   */
  static getBudgetLines(budgetlinedata) {
    const budgetlineArr = [];
    for (let i = 0; i < budgetlinedata.length; i++) {
      const tempObj = {
        'description': budgetlinedata[i].itemDescription ? budgetlinedata[i].itemDescription : '',
        'budgetline': budgetlinedata[i].projectBudgetConfigurationId ? budgetlinedata[i].projectBudgetConfigurationId : '',
      };
      if (budgetlinedata[i].amount) {
        tempObj['amount'] = budgetlinedata[i].amount ? parseFloat(budgetlinedata[i].amount) : '';
      }

      budgetlineArr.push(tempObj);
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
      const tempObj = {
        'itemDescription': budgetlinedata[i].description ? budgetlinedata[i].description : '',
        'projectBudgetConfigurationId': budgetlinedata[i].budgetline ? budgetlinedata[i].budgetline : '',
      };
      if (budgetlinedata[i].amount) {
        tempObj['amount'] = budgetlinedata[i].amount ? parseFloat(budgetlinedata[i].amount) : '';
      }

      budgetlineArr.push(tempObj);
    }
    return budgetlineArr;
  }
}

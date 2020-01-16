import { Common,DatePickerMethods } from '../../../../../../common'
import { PAID_TYPES_CONST } from '../../../../../../config'
import * as _ from 'lodash';

export class ManageFreelancerAdvanceData {
  /**
  return Role details data as per formcontrol
  @param advanceDetails as Object
  **/
  static getFormDetails(advanceDetails: any) {
    var advanceFormData;

    if (advanceDetails) {
      let i18nValues = advanceDetails.i18n;
      let paymentDate;
      if (advanceDetails.paymentDate) {
        let tempPaymentDate = DatePickerMethods.getDateWithTimezoneAdding(advanceDetails.paymentDate);
        paymentDate = Common.getDateObjData(tempPaymentDate);
      }
      advanceFormData = {
        "budgetLine": advanceDetails.projectConfigurationId ? advanceDetails.projectConfigurationId : "",
        "freelancerId": advanceDetails.freelancerId ? advanceDetails.freelancerId : "",
        "currencyId":advanceDetails.currencyId ? advanceDetails.currencyId:"",
        "amount": advanceDetails.amount ? parseFloat(advanceDetails.amount) : "",
        "modeOfPayment": advanceDetails.operationId ? advanceDetails.operationId : "",
        "paymentDate": paymentDate ? paymentDate : "",
        "purpose": i18nValues.purpose ? i18nValues.purpose : ""
}
    }
    return advanceFormData;
  }

  static getWebServiceDetails(advanceDetails: any) {


    var advanceFormData;
    if (advanceDetails) {
      let paymentDate;
      if (advanceDetails.paymentDate) {
         paymentDate = DatePickerMethods.getIsoDateFromDateObj(advanceDetails.paymentDate);
      }
      advanceFormData = {
        "i18n": {
          "langCode": advanceDetails.langCode ? advanceDetails.langCode : "",
          "purpose": advanceDetails.purpose ? advanceDetails.purpose : "",
        },
        "projectConfigurationId": advanceDetails.budgetLine ? advanceDetails.budgetLine : "",
        "freelancerId": advanceDetails.freelancerId ? advanceDetails.freelancerId : "",
        "currencyId":advanceDetails.currencyId ? advanceDetails.currencyId:"",
        "amount": advanceDetails.amount ? parseFloat(advanceDetails.amount) : 0,
        "operationId": advanceDetails.modeOfPayment ? advanceDetails.modeOfPayment : "",
        "paymentDate": paymentDate ? paymentDate : ""
      }
      return advanceFormData;
    }
  }

}

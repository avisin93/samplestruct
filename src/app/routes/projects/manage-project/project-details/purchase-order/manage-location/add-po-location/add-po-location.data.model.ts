import { Common } from '../../../../../../../common'

export class AddPOLocationData {
  /**
   * getFormData method use to get form values and set to data model
   * @param  locationDetails as object which contain form values
   * @return         locationFormData as object
   */
  static getFormData(locationDetails: any) {
    var locationFormData;

    if (locationDetails) {
      let paymentDate;
      if (locationDetails.paymentDate) {
        let payment = Common.setOffsetToUTC(locationDetails.paymentDate, '');
        paymentDate = payment['fromDate'];
      }
      locationFormData = {
        "beneficiary": locationDetails.beneficiary ? locationDetails.beneficiary : "",
        "budgetLine": {
          "projectBudgetConfigurationId": locationDetails.budgetLine ? locationDetails.budgetLine : "",
        },
        "currencyId": locationDetails.currencyId ? locationDetails.currencyId : "",
        "dailyRate": locationDetails.dailyRate ? parseFloat(locationDetails.dailyRate) : 0,
        "dismantleDays": locationDetails.dismantleDays ? parseInt(locationDetails.dismantleDays) : 0,
        "i18n": {
          "langCode": locationDetails.langCode ? locationDetails.langCode : "",
          "notes": locationDetails.notes ? locationDetails.notes : "",
        },
        "locationId": locationDetails.locationId ? locationDetails.locationId : "",
        "operationId": locationDetails.operationId ? locationDetails.operationId : "",
        "parentLocationPoId": locationDetails.parentLocationPoId ? locationDetails.parentLocationPoId : "",
        "percentIsrWithholding": locationDetails.percentIsrWithholding ? parseFloat(locationDetails.percentIsrWithholding) : 0,
        "percentVat": locationDetails.percentVat ? parseFloat(locationDetails.percentVat) : 0,
        "percentVatWithholding": locationDetails.percentVatWithholding ? parseFloat(locationDetails.percentVatWithholding) : 0,
        "preparationDays": locationDetails.preparationDays ? parseInt(locationDetails.preparationDays) : 0,
        "projectId": locationDetails.projectId ? locationDetails.projectId : "",
        "requesteByUserId": locationDetails.requesteByUserId ? locationDetails.requesteByUserId : "",
        "scouterId": locationDetails.scouterId ? locationDetails.scouterId : "",
        "shootingDays": locationDetails.shootingDays ? parseInt(locationDetails.shootingDays) : 0,
        "totalAmountRequested": locationDetails.totalAmountRequested ? parseFloat(locationDetails.totalAmountRequested) : 0,
        "paymentDate": paymentDate ? paymentDate : "",
        "isSublocation": locationDetails.isSubLocation ? locationDetails.isSubLocation : false
      }
      if (locationFormData.isSublocation) {
        locationFormData['parentLocationPoId'] = locationDetails.masterLocation ? locationDetails.masterLocation : ""
      }
    }
    return locationFormData;
  }

  /**
   * setWebServiceDetails method use to set values of form to dada model
   * @param  locationDetails as object which contain PO details of particular Id
   * which get from webservice
   * @return           locationFormData      as object
   */
  static setWebServiceDetails(locationDetails: any) {
    var locationFormData;
    let paymentDate;
    if (locationDetails) {
      if (locationDetails.paymentDate) {
        let payment = Common.removeOffsetFromUTC(locationDetails.paymentDate);
        paymentDate = Common.getDateObjData(payment);
      }
      locationFormData = {
        "beneficiary": locationDetails.beneficiary ? locationDetails.beneficiary : "",
        "budgetLine": locationDetails.budgetLine.projectBudgetConfigurationId ? locationDetails.budgetLine.projectBudgetConfigurationId : "",
        "currencyId": locationDetails.currencyId ? locationDetails.currencyId : "",
        "dailyRate": locationDetails.dailyRate ? parseFloat(locationDetails.dailyRate) : 0,
        "dismantleDays": locationDetails.dismantleDays ? parseInt(locationDetails.dismantleDays) : 0,
        "notes": locationDetails.i18n.notes ? locationDetails.i18n.notes : "",
        "locationId": locationDetails.locationId ? locationDetails.locationId : "",
        "locationName": (locationDetails.i18n && locationDetails.i18n.name) ? locationDetails.i18n.name : "",
        "operationId": locationDetails.operationId ? locationDetails.operationId : "",
        "parentLocationPoId": locationDetails.parentLocationPoId ? locationDetails.parentLocationPoId : "",
        "percentIsrWithholding": locationDetails.percentIsrWithholding ? parseFloat(locationDetails.percentIsrWithholding) : 0,
        "percentVat": locationDetails.percentVat ? parseFloat(locationDetails.percentVat) : 0,
        "percentVatWithholding": locationDetails.percentVatWithholding ? parseFloat(locationDetails.percentVatWithholding) : 0,
        "preparationDays": locationDetails.preparationDays ? parseInt(locationDetails.preparationDays) : 0,
        "projectId": locationDetails.projectId ? locationDetails.projectId : "",
        "requesteByUserId": locationDetails.requesteByUserId ? locationDetails.requesteByUserId : "",
        "scouterId": locationDetails.scouterId ? locationDetails.scouterId : "",
        "shootingDays": locationDetails.shootingDays ? parseInt(locationDetails.shootingDays) : 0,
        "totalAmountRequested": locationDetails.totalAmountRequested ? parseFloat(locationDetails.totalAmountRequested) : 0,
        "subtotal": locationDetails.subtotal ? locationDetails.subtotal : "",
        "paymentDate": paymentDate ? paymentDate : "",
        "isSubLocation": locationDetails.isSublocation ? locationDetails.isSublocation : false,
        "masterLocation": locationDetails.parentLocationPoId ? locationDetails.parentLocationPoId : ""
      }
    }
    return locationFormData;
  }


}

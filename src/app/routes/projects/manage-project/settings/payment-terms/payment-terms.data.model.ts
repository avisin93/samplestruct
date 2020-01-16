export class ManagePaymentTermsData {
  /**
  return Role details data as per formcontrol
  @param paymentTermDetails as Object
  **/

  static getFormDetails(paymentTermDetails: any) {
    var paymentTermData;
    if (paymentTermDetails) {
      paymentTermData = {
        "freelancer": paymentTermDetails.freelancer ? paymentTermDetails.freelancer : "",
        "vendor": paymentTermDetails.vendor ? paymentTermDetails.vendor : "",
        "location": paymentTermDetails.location ? paymentTermDetails.location : "",
        "talentDayRate": paymentTermDetails.talentDayRate ? paymentTermDetails.talentDayRate : "",
        "talentBuyOut": paymentTermDetails.talentBuyOut ? paymentTermDetails.talentBuyOut : ""
      }

    }
    return paymentTermData;
  }

  static getWebServiceDetails(paymentTermDetails: any) {
    var paymentTermData;
    if (paymentTermDetails && paymentTermDetails.length > 0) {
      paymentTermData = {
        "freelancer": paymentTermDetails[0].value ? paymentTermDetails[0].value : 0,
        "vendor": paymentTermDetails[1].value ? paymentTermDetails[1].value : 0,
        "location": paymentTermDetails[2].value ? paymentTermDetails[2].value : 0,
        "talentDayRate": paymentTermDetails[3].value ? paymentTermDetails[3].value : 0,
        "talentBuyOut": paymentTermDetails[4].value ? paymentTermDetails[4].value : 0,
      }

    }
    return paymentTermData;
  }

}

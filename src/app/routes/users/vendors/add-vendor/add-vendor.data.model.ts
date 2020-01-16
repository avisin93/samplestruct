export class ManageVendorData {
  /**
  return Role details data as per formcontrol
  @param vendorDetails as Object
  **/
  static getFormDetailsData(vendorDetails: any) {
    var vendorFormData;

    if (vendorDetails) {
      vendorFormData = {
        "emailId": vendorDetails.email ? vendorDetails.email.toLowerCase().trim() : "",
        "classification": vendorDetails.classification ? vendorDetails.classification : "",
        "operationId": vendorDetails.mode ? vendorDetails.mode : "",
        "currencyId": vendorDetails.currency ? vendorDetails.currency : "",
        "acceptThirdPartyPayment": vendorDetails.thirdParty ? vendorDetails.thirdParty : false,
        "commercial": vendorDetails.commercial ? vendorDetails.commercial : [],
        "corporate": vendorDetails.corporate ? vendorDetails.corporate : [],
        "entertainment": vendorDetails.entertainment ? vendorDetails.entertainment : [],
        "i18n": {
          "commercialName": vendorDetails.companyName ? vendorDetails.companyName : "",
          "langCode": vendorDetails.langCode
        },
      }
    }
    return vendorFormData;
  }
}

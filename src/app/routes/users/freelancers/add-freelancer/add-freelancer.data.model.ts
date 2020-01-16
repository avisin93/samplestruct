export class ManageUserData {
  /**
  return Role details data as per formcontrol
  @param userDetails as Object
  **/

  static getFinalUserData(userDetails: any) {
    var userFormData;
    if (userDetails) {
      userFormData = {
        "i18n": {
          "langCode": userDetails.langCode,
          "firstName": userDetails.firstName ? userDetails.firstName : "",
          "lastName": userDetails.lastName ? userDetails.lastName : "",
        },
        "emailId": userDetails.email ? userDetails.email.toLowerCase().trim() : "",
        "operationId": userDetails.mode ? userDetails.mode : "",
        "currencyId": userDetails.currency ? userDetails.currency : "",
        "commercial": userDetails.commercial ? userDetails.commercial : [],
        "corporate": userDetails.corporate ? userDetails.corporate : [],
        "entertainment": userDetails.entertainment ? userDetails.entertainment : [],
        "roleIds":userDetails.roleIds ? userDetails.roleIds : []
      }
    }
    return userFormData;
  }

}

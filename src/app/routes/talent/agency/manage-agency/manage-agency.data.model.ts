export class ManageAgencyData {
  /**
  return Role details data as per formcontrol
  @param agencyDetails as Object
  **/
  static getFormDetailsData(agencyDetails: any) {
    let agencyFormData;
    let i18nObj = agencyDetails.i18n ? agencyDetails.i18n : {};
    if (agencyDetails) {
      agencyFormData = {
        'email': agencyDetails.emailId ? agencyDetails.emailId.trim() : '',
        'mode': agencyDetails.operation ? agencyDetails.operation.trim() : '',
        'phone': agencyDetails.phoneNo ? agencyDetails.phoneNo.trim() : '',
        'taxID': agencyDetails.taxId ? agencyDetails.taxId.trim() : '',
        'accNumber': agencyDetails.accountNumber ? agencyDetails.accountNumber.trim() : '',
        'bankName': agencyDetails.bankName ? agencyDetails.bankName.trim() : '',
        'branch': agencyDetails.branch ? agencyDetails.branch.trim() : '',
        'currency': agencyDetails.currencyId ? agencyDetails.currencyId : '',
        'clabe': agencyDetails.clabe ? agencyDetails.clabe.trim() : '',
        'bankaddress': agencyDetails.bankAddress ? agencyDetails.bankAddress.trim() : '',
        'commercial': agencyDetails.commercial ? agencyDetails.commercial : [],
        'entertainment': agencyDetails.entertainment ? agencyDetails.entertainment : [],
        'accountName': agencyDetails.accountName ? agencyDetails.accountName : '',
        'selectedCommercialCategories': agencyDetails.commercial ? ManageAgencyData.setCategoryIds(JSON.parse(JSON.stringify(agencyDetails.commercial))) : [],
        'selectedEntertainmentCategories': agencyDetails.entertainment ? ManageAgencyData.setCategoryIds(JSON.parse(JSON.stringify(agencyDetails.entertainment))) : [],
        'address': i18nObj.address ? i18nObj.address.trim() : '',
        'companyName': i18nObj.commercialName ? i18nObj.commercialName.trim() : '',
        'legalName': i18nObj.legalName ? i18nObj.legalName.trim() : '',
        'contracts': agencyDetails.contracts ? agencyDetails.contracts : []
      };
    }
    return agencyFormData;
  }

  static setCategoryIds(categories) {
    const selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }


  static getWebServiceDetailsData(agencyDetails: any, contractFileArray) {
    let agencyFormData;
    if (agencyDetails) {
      agencyFormData = {
        'emailId': agencyDetails.email ? agencyDetails.email.trim() : '',
        'operation': agencyDetails.mode ? agencyDetails.mode.trim() : '',
        'phoneNo': agencyDetails.phone ? agencyDetails.phone.trim() : '',
        'taxId': agencyDetails.taxID ? agencyDetails.taxID.trim() : '',
        'accountNumber': agencyDetails.accNumber ? agencyDetails.accNumber.trim() : '',
        'bankName': agencyDetails.bankName ? agencyDetails.bankName.trim() : '',
        'branch': agencyDetails.branch ? agencyDetails.branch.trim() : '',
        'currencyId': agencyDetails.currency ? agencyDetails.currency : '',
        'clabe': agencyDetails.clabe ? agencyDetails.clabe.trim() : '',
        'bankAddress': agencyDetails.bankaddress ? agencyDetails.bankaddress.trim() : '',
        'commercial': agencyDetails.commercial ? agencyDetails.commercial : [],
        'entertainment': agencyDetails.entertainment ? agencyDetails.entertainment : [],
        'accountName': agencyDetails.accountName ? agencyDetails.accountName : '',
        'i18n': {
          'address': agencyDetails.address ? agencyDetails.address.trim() : '',
          'commercialName': agencyDetails.companyName ? agencyDetails.companyName.trim() : '',
          'legalName': agencyDetails.legalName ? agencyDetails.legalName.trim() : '',
          'langCode': agencyDetails.langCode
        },
        'contracts': contractFileArray ? contractFileArray : []
      };
    }
    return agencyFormData;
  }
}

import { Common } from '@app/common';

export class ManageFreelancerActivationData {
  /**
  return Role details data as per formcontrol
  @param userDetails as Object
  **/

  static getFormDetails(userDetails: any) {
    let userFormData;

    if (userDetails) {
      userFormData = {
        'firstName': userDetails.firstName ? userDetails.firstName : '',
        'lastName': userDetails.lastName ? userDetails.lastName : '',
        'email': userDetails.email ? userDetails.email : '',
        'currency': userDetails.currency ? userDetails.currency : '',
        'phone': userDetails.phone ? userDetails.phone : '',
        'dateOfBirth': userDetails.dateOfBirth ? userDetails.dateOfBirth : '',
        'ssn': userDetails.ssn ? userDetails.ssn : '',
        'selfPaid': userDetails.selfPaid ? userDetails.selfPaid : '1',
        'uprc': userDetails.uprc ? userDetails.uprc : '',
        'taxId': userDetails.taxId ? userDetails.taxId : '',
        'accNumber': userDetails.accNumber ? userDetails.accNumber : '',
        'bankName': userDetails.bankName ? userDetails.bankName : '',
        'branchName': userDetails.branchName ? userDetails.branchName : '',
        'clabe': userDetails.clabe ? userDetails.clabe : '',
        'address': userDetails.address ? userDetails.address : '',
      }
    }
    return userFormData;
  }

  static getWebServiceDetails(userDetails: any, documents) {
    let userFormData;
    if (userDetails) {
      let dob;
      if (userDetails.dateOfBirth) {
        const dobObj = Common.setOffsetToUTC(userDetails.dateOfBirth, '');
        dob = dobObj['fromDate'];
      }
      userFormData = {
        'emailId': userDetails.email ? userDetails.email : '',
        'phoneNo': userDetails.phone ? userDetails.phone : '',
        'roleIds': userDetails.roleIds ? userDetails.roleIds : [],
        'i18n': {
          'langCode': userDetails.langCode ? userDetails.langCode : '',
          'firstName': userDetails.firstName ? userDetails.firstName : '',
          'lastName': userDetails.lastName ? userDetails.lastName : '',
          'eventDates': userDetails.eventDates ? userDetails.eventDates : []
        },
        'electronicIDNumber': userDetails.electronicId ? userDetails.electronicId : '',
        'operationId': userDetails.mode ? userDetails.mode : '',
        'birthDate': dob ? dob : '',
        'selfPaid': (userDetails.selfPaid == '1') ? true : false,
        'currencyId': userDetails.currency ? userDetails.currency : '',
        'profilePicFileId': userDetails.profilePicFileId ? userDetails.profilePicFileId : '',
        'ssn': userDetails.ssn ? userDetails.ssn : '',
        'taxId': userDetails.taxId ? userDetails.taxId : '',
        'uprc': userDetails.uprc ? userDetails.uprc : '',
        'contracts': userDetails.contracts ? userDetails.contracts : [],
        'identityDocs': documents ? ManageFreelancerActivationData.setIdentityDocuments(documents) : [],
        'commercial': userDetails.commercial ? userDetails.commercial : [],
        'corporate': userDetails.corporate ? userDetails.corporate : [],
        'entertainment': userDetails.entertainment ? userDetails.entertainment : []
      }
      if (userFormData.selfPaid) {
        userFormData['accountNumber'] = userDetails.accNumber ? userDetails.accNumber : '',
          userFormData['bankName'] = userDetails.bankName ? userDetails.bankName : '',
          userFormData['branch'] = userDetails.branchName ? userDetails.branchName : '',
          userFormData['clabe'] = userDetails.clabe ? userDetails.clabe : '',
          userFormData['rfcCode'] = userDetails.taxId ? userDetails.taxId : '',
          userFormData['i18n']['address'] = userDetails.address ? userDetails.address : ''
      }
      else {
        userFormData['vendorId'] = userDetails.vendorId ? userDetails.vendorId : ''
      }
      return userFormData;
    }
  }

  static setIdentityDocuments(documents) {
    let identityDocuments = [];
    const constanciaObj = {
      documentType: 'Constancia',
      files: documents.selectedConstantiaDocs
    };
    const ttDObj = {
      documentType: '32D',
      files: documents.selected32DDocs
    };
    const passportObj = {
      documentType: 'Passport/IFE',
      files: documents.selectedPassportDocs
    };
    identityDocuments = [constanciaObj, ttDObj, passportObj];
    documents.selectedOtherDocs.forEach((obj, index) => {
      const othersObj = {
        documentType: 'Others',
        files: [obj],
        name: obj.name
      };
      identityDocuments.push(othersObj);
    });
    return identityDocuments;

  }
}

/**
* Data Model     : ManageIndividualDataModel
 
* Creation Date : 19th April, 2019
*/

import { Common } from '@app/common';
import { TALENT_TYPES } from '@app/config';


export class ManageIndividualDataModel {
  static TALENT_TYPES_OBJ: any = Common.keyValueDropdownArr(TALENT_TYPES, 'text', 'id');
  /**
  return Role details data as per formcontrol
  @param individualDetails as Object
  **/
  static getFormDetailsData(individualDetails: any) {
    const individualFormData = {};
    if (individualDetails) {
      individualFormData['mainDetails'] = {
        'id': individualDetails.id ? individualDetails.id : '',
        'firstName': individualDetails.i18n && individualDetails.i18n.firstName ? individualDetails.i18n.firstName : '',
        'lastName': individualDetails.i18n && individualDetails.i18n.lastName ? individualDetails.i18n.lastName : '',
        'address': individualDetails.i18n && individualDetails.i18n.address ? individualDetails.i18n.address : '',
        'email': individualDetails.emailId ? individualDetails.emailId : '',
        'referredBy': individualDetails.referer && individualDetails.referer[0].referType ? individualDetails.referer[0].referType : '',
        'modeOfOperation': individualDetails.operation ? individualDetails.operation : '',
        // tslint:disable-next-line:max-line-length
        'referredAgencyName': individualDetails.referer && individualDetails.referer[0].referType && individualDetails.referer[0].referType === ManageIndividualDataModel.TALENT_TYPES_OBJ.agency && individualDetails.referer[0].refererId ? individualDetails.referer[0].refererId : '',
        // tslint:disable-next-line:max-line-length
        'referredIndividualName': individualDetails.referer && individualDetails.referer[0].referType && individualDetails.referer[0].referType === ManageIndividualDataModel.TALENT_TYPES_OBJ.individual && individualDetails.referer[0].refererId ? individualDetails.referer[0].refererId : '',
        'referredAgencyDisplayName': individualDetails.referer && individualDetails.referer[0].referType && individualDetails.referer[0].referType === ManageIndividualDataModel.TALENT_TYPES_OBJ.agency && individualDetails.referer[0].displayName ? individualDetails.referer[0].displayName : '',
        // tslint:disable-next-line:max-line-length
        'referredIndividualDisplayName': individualDetails.referer && individualDetails.referer[0].referType && individualDetails.referer[0].referType === ManageIndividualDataModel.TALENT_TYPES_OBJ.individual && individualDetails.referer[0].displayName ? individualDetails.referer[0].displayName : '',

        'phone': individualDetails.phoneNo ? individualDetails.phoneNo : '',
        'taxId': individualDetails.taxId ? individualDetails.taxId : '',
        'accountName': individualDetails.accountName ? individualDetails.accountName : '',
        'accNumber': individualDetails.accountNumber ? individualDetails.accountNumber : '',
        'bankName': individualDetails.bankName ? individualDetails.bankName : '',
        'branch': individualDetails.branch ? individualDetails.branch : '',
        'clabe': individualDetails.clabe ? individualDetails.clabe : '',
        'bankAddress': individualDetails.bankAddress ? individualDetails.bankAddress : '',
        'currency': individualDetails.currencyId ? individualDetails.currencyId : ''
      };
      individualFormData['otherData'] = {
        'contractAttachments': individualDetails.contracts ? individualDetails.contracts : [], /////////////
        'commercial': individualDetails.commercial ? individualDetails.commercial : [],
        'entertainment': individualDetails.entertainment ? individualDetails.entertainment : [],
        'selectedCommercialCategories': individualDetails.commercial ? ManageIndividualDataModel.setCategoryIds(JSON.parse(JSON.stringify(individualDetails.commercial))) : [],
        'selectedEntertainmentCategories': individualDetails.entertainment ? ManageIndividualDataModel.setCategoryIds(JSON.parse(JSON.stringify(individualDetails.entertainment))) : []
      };
      if (individualDetails.contracts) {
        const contractAttachmentsIds = [];
        for (let contractIndex = 0; contractIndex < individualDetails.contracts.length; contractIndex++) {
          if (individualDetails.contracts[contractIndex] && individualDetails.contracts[contractIndex].fileId) {
            const contract = individualDetails.contracts[contractIndex].fileId;
            contractAttachmentsIds.push(contract);
          }
        }
        individualFormData['otherData']['contractAttachmentsIds'] = contractAttachmentsIds;
      } else {
        individualFormData['otherData']['contractAttachmentsIds'] = [];
      }
      // if ( individualDetails.referer && (individualDetails.referer.refererType === 0)) {
      //   individualFormData['referredAgencyName'] = individualDetails.referer.refererId;
      // } else if (individualDetails.referer && (individualDetails.referer.refererType === 1)) {
      //   individualFormData['referredIndividualName'] = individualDetails.referer.refererId;
      // }
    }
    return individualFormData;
  }

  static getWebServiceDetailsData(individualDetails: any, documents) {
    let individualFormData;
    if (individualDetails) {
      individualFormData = {
        'id': individualDetails.id ? individualDetails.id.trim() : '',
        'i18n': {
          'langCode': individualDetails.langCode ? individualDetails.langCode.trim() : '',
          'address': individualDetails.address ? individualDetails.address : '',
          'firstName': individualDetails.firstName ? individualDetails.firstName.trim() : '',
          'lastName': individualDetails.lastName ? individualDetails.lastName.trim() : ''
        },
        'emailId': individualDetails.email ? individualDetails.email.trim() : '',
        'phoneNo': individualDetails.phone ? individualDetails.phone.trim() : '',
        'taxId': individualDetails.taxId ? individualDetails.taxId.trim() : '',
        'accountName': individualDetails.accountName ? individualDetails.accountName.trim() : '',
        'accountNumber': individualDetails.accNumber ? individualDetails.accNumber.trim() : '',
        'bankName': individualDetails.bankName ? individualDetails.bankName.trim() : '',
        'bankAddress': individualDetails.bankAddress ? individualDetails.bankAddress.trim() : '',
        'currencyId': individualDetails.currency ? individualDetails.currency.trim() : '',
        'branch': individualDetails.branch ? individualDetails.branch.trim() : '',
        'clabe': individualDetails.clabe ? individualDetails.clabe.trim() : '',
        'operationId': individualDetails.modeOfOperation ? individualDetails.modeOfOperation.trim() : '',
        'referer': [{
          'refererType': individualDetails.referredBy ? individualDetails.referredBy : '',
          'refererId': individualDetails.referredAgencyName ? individualDetails.referredAgencyName.trim() : individualDetails.referredIndividualName ? individualDetails.referredIndividualName.trim() : '',
        }],
        'commercial': individualDetails.commercial ? individualDetails.commercial : [],
        'entertainment': individualDetails.entertainment ? individualDetails.entertainment : []
      };
      const contracts = [];
      for (let contractIndex = 0; contractIndex < documents.length; contractIndex++) {
        const contract = {
          'fileId': documents[contractIndex]
        };
        contracts.push(contract);
      }
      individualFormData['contracts'] = contracts;
    }
    return individualFormData;
  }
  static setCategoryIds(categories) {
    const selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }
}

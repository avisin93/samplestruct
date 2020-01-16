import { Common } from '../../../../common'
import { PAID_TYPES_CONST } from '../../../../config'
import * as _ from 'lodash';

export class EditUserData {
  /**
  return Role details data as per formcontrol
  @param userDetails as Object
  **/
  static getUserFormDetails(userDetails: any) {
    var userFormData;

    if (userDetails) {
      let i18nValues = userDetails.i18n;
      let birthDate;
      if (userDetails.birthDate) {
        let tempBirthDate = Common.removeOffsetFromUTC(userDetails.birthDate);
        birthDate = Common.getDateObjData(tempBirthDate);
      }
      userFormData = {
        "roleIds": (userDetails.roleIds && userDetails.roleIds.length > 0) ? userDetails.roleIds : [],
        "firstName": i18nValues.firstName ? i18nValues.firstName : "",
        "lastName": i18nValues.lastName ? i18nValues.lastName : "",
        "email": userDetails.emailId ? userDetails.emailId : "",
        "electronicId": userDetails.electronicIDNumber ? userDetails.electronicIDNumber : "",
        "mode": userDetails.operationId ? userDetails.operationId : "",
        "currency": userDetails.currencyId ? userDetails.currencyId : "",
        "phone": userDetails.phoneNo ? userDetails.phoneNo : "",
        "dateOfBirth": birthDate ? birthDate : "",
        "ssn": userDetails.ssn ? userDetails.ssn : "",
        "uprc": userDetails.uprc ? userDetails.uprc : "",
        "profilePicFileId": userDetails.profilePicFileId ? userDetails.profilePicFileId : "",
        "profilePicUrl": userDetails.profilePicUrl ? userDetails.profilePicUrl : "",
        "taxId": userDetails.taxId ? userDetails.taxId : "",
        "accNumber": userDetails.accountNumber ? userDetails.accountNumber : "",
        "bankName": userDetails.bankName ? userDetails.bankName : "",
        "branchName": userDetails.branch ? userDetails.branch : "",
        "clabe": userDetails.clabe ? userDetails.clabe : "",
        "rfcCode": userDetails.taxId ? userDetails.taxId : "",
        'vendorId': userDetails.vendorId ? userDetails.vendorId : "",
        "address": i18nValues.address ? i18nValues.address : "",
        "contractId": (userDetails.contracts && userDetails.contracts.length > 0) ? userDetails.contracts[0].id : "",
        "contractUrl": (userDetails.contracts && userDetails.contracts.length > 0) ? userDetails.contracts[0].fileUrl : "",
        "contractStatus": (userDetails.contracts && userDetails.contracts.length > 0) ? userDetails.contracts[0].status : "",
        "contractRejectionReason": (userDetails.contracts && userDetails.contracts.length > 0) ? userDetails.contracts[0].rejectionReason : "",
        "commercial": userDetails.commercial ? userDetails.commercial : [],
        "entertainment": userDetails.entertainment ? userDetails.entertainment : [],
        "corporate": userDetails.corporate ? userDetails.corporate : [],
        "selectedCommercialCategories": userDetails.commercial ? EditUserData.setCategoryIds(JSON.parse(JSON.stringify(userDetails.commercial))) : [],
        "selectedEntertainmentCategories": userDetails.entertainment ? EditUserData.setCategoryIds(JSON.parse(JSON.stringify(userDetails.entertainment))) : [],
        "selectedCorporateCategories": userDetails.corporate ? EditUserData.setCategoryIds(JSON.parse(JSON.stringify(userDetails.corporate))) : [],
        "identityDocs": userDetails.identityDocs ? userDetails.identityDocs : [],
        "documents": userDetails.identityDocs ? EditUserData.getIdentityDocuments(JSON.parse(JSON.stringify(userDetails.identityDocs))) : [],
        "importantDates": (i18nValues.eventDates && i18nValues.eventDates.length > 0) ? EditUserData.getImportantdates(i18nValues.eventDates) : []
      }
      if (userDetails.hasOwnProperty("selfPaid")) {
        userFormData["selfPaid"] = userDetails.selfPaid ? PAID_TYPES_CONST.selfPaid : PAID_TYPES_CONST.thirdParty
        if (userFormData["selfPaid"] == PAID_TYPES_CONST.thirdParty)
          userFormData['vendorId'] = userDetails.vendorId ? userDetails.vendorId : "";
        else
          userFormData['vendorId'] = "";
      }
      else {
        userFormData["selfPaid"] = PAID_TYPES_CONST.selfPaid;
      }
    }
    return userFormData;
  }
  static setCategoryIds(categories) {
    let selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }

  static getWebServiceDetails(userDetails: any, documents) {
    var userFormData;
    if (userDetails) {
      let dob;
      if (userDetails.dateOfBirth) {
        let dobObj = Common.setOffsetToUTC(userDetails.dateOfBirth, '');
        dob = dobObj['fromDate'];
      }
      userFormData = {
        "emailId": userDetails.email ? userDetails.email : "",
        "phoneNo": userDetails.phone ? userDetails.phone : "",
        "roleIds":  userDetails.roles ? userDetails.roles : "",
        "i18n": {
          "langCode": userDetails.langCode ? userDetails.langCode : "",
          "firstName": userDetails.firstName ? userDetails.firstName : "",
          "lastName": userDetails.lastName ? userDetails.lastName : "",
          "eventDates": (userDetails.importantDates && userDetails.importantDates.length > 0) ? EditUserData.setImportantdates(userDetails.importantDates) : [],
        },
        "electronicIDNumber": userDetails.electronicId ? userDetails.electronicId : "",
        "operationId": userDetails.mode ? userDetails.mode : "",
        "birthDate": dob ? dob : "",
        "selfPaid": (userDetails.selfPaid == '1') ? true : false,
        "currencyId": userDetails.currency ? userDetails.currency : "",
        "profilePicFileId": userDetails.profilePicFileId ? userDetails.profilePicFileId : "",
        "ssn": userDetails.ssn ? userDetails.ssn : "",
        "taxId": userDetails.taxId ? userDetails.taxId : "",
        "uprc": userDetails.uprc ? userDetails.uprc : "",
        "contracts": userDetails.contracts ? userDetails.contracts : [],
        "identityDocs": documents ? EditUserData.setIdentityDocuments(documents) : [],
        "commercial": userDetails.commercial ? userDetails.commercial : [],
        "corporate": userDetails.corporate ? userDetails.corporate : [],
        "entertainment": userDetails.entertainment ? userDetails.entertainment : []
      }
      // userFormData.roleIds[0] = userDetails.roleIds ? userDetails.roleIds : "";
      if (userFormData.selfPaid) {
        userFormData["accountNumber"] = userDetails.accNumber ? userDetails.accNumber : "",
          userFormData["bankName"] = userDetails.bankName ? userDetails.bankName : "",
          userFormData["branch"] = userDetails.branchName ? userDetails.branchName : "",
          userFormData["clabe"] = userDetails.clabe ? userDetails.clabe : "",
          userFormData["i18n"]["address"] = userDetails.address ? userDetails.address : ""
      }
      else {
        userFormData['vendorId'] = userDetails.vendorId ? userDetails.vendorId : ""
      }
      return userFormData;
    }
  }

  static setIdentityDocuments(documents) {
    let identityDocuments = [];
    let constanciaObj = {
      documentType: "Constancia",
      files: documents.selectedConstantiaDocs
    };
    let ttDObj = {
      documentType: "32D",
      files: documents.selected32DDocs
    };
    let passportObj = {
      documentType: "Passport/IFE",
      files: documents.selectedPassportDocs
    };
    identityDocuments = [constanciaObj, ttDObj, passportObj];
    documents.selectedOtherDocs.forEach((obj, index) => {
      let othersObj = {
        documentType: "Others",
        files: [obj],
        name: obj.name
      };
      identityDocuments.push(othersObj);
    });

    return identityDocuments;

  }
  static getIdentityDocuments(documents) {
    let tempDocuments = {
      selectedConstantiaDocs: [],
      selected32DDocs: [],
      selectedPassportDocs: [],
      selectedOtherDocs: []
    }
    let constanciaObj = _.find(documents, { "documentType": "Constancia" });
    let ttdObj = _.find(documents, { "documentType": "32D" });
    let passportObj = _.find(documents, { "documentType": "Passport/IFE" });
    // let othersObj = _.find(identityDocs, { "documentType": "Others" });
    let othersObjArr = _.filter(documents, { "documentType": "Others" });
    if (constanciaObj && constanciaObj.files) {
      let filesArr = constanciaObj.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedConstantiaDocs.push({ 'fileId': filesArr[i].fileId })
      }

    }
    if (ttdObj && ttdObj.files) {
      let filesArr = ttdObj.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selected32DDocs.push({ 'fileId': filesArr[i].fileId })
      }

    }
    if (passportObj && passportObj.files) {
      let filesArr = passportObj.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedPassportDocs.push({ 'fileId': filesArr[i].fileId })
      }

    }
    // if (othersObj && othersObj.files) {
    //   let filesArr = othersObj.files;
    //   for (let i = 0; i < filesArr.length; i++) {
    //     tempDocuments.selectedOtherDocs.push({ 'fileId': filesArr[i].fileId, 'name': filesArr[i].name })
    //   }
    //
    // }
    if (othersObjArr && othersObjArr.length > 0) {
      othersObjArr.forEach((obj, index) => {
        if (obj.files && obj.files.length > 0)
          tempDocuments.selectedOtherDocs.push({ 'fileId': obj.files[0].fileId, 'name': obj.name })
      })
    }
    return tempDocuments;
  };


  static setImportantdates(impDatesData) {
    var impDatesDataArr = [];
    for (var i = 0; i < impDatesData.length; i++) {
      let date;
      if (impDatesData[i].dateOfBirth) {
        let dateObj = Common.setOffsetToUTC(impDatesData[i].dateOfBirth, '');
        date = dateObj['fromDate'];
      }
      if (impDatesData[i].eventName && date) {
        impDatesDataArr.push({
          "name": impDatesData[i].eventName ? impDatesData[i].eventName : "",
          'date': date ? date : ''
        });
      }

    }
    return impDatesDataArr;
  }
  static getImportantdates(impDatesData) {
    var impDatesDataArr = [];

    for (var i = 0; i < impDatesData.length; i++) {
      let date;
      let tempDate = Common.removeOffsetFromUTC(impDatesData[i].date);
      date = Common.getDateObjData(tempDate)
      impDatesDataArr.push({
        "eventName": impDatesData[i].name ? impDatesData[i].name : "",
        'dateOfBirth': date ? date : ''
      });
    }
    return impDatesDataArr;
  }
}

import * as _ from 'lodash';

export class ManageVendorData {
  /**
  return Role details data as per formcontrol
  @param vendorDetails as Object
  **/
  static getFormDetailsData(vendorDetails: any) {
    var vendorFormData;

    if (vendorDetails) {
      vendorFormData = {

        "classification": vendorDetails.classification ? vendorDetails.classification : "",
        "vendorType": vendorDetails.type ? vendorDetails.type : "",
        "electronic": vendorDetails.electronicIdNumber ? vendorDetails.electronicIdNumber : "",
        "phone": vendorDetails.phoneNo ? vendorDetails.phoneNo : "",
        "taxId": vendorDetails.taxId ? vendorDetails.taxId : "",
        "paymentType": vendorDetails.paymentType ? vendorDetails.paymentType : "",
        "accNumber": vendorDetails.paymentType == 1 ? vendorDetails.accountNumber : "",
        "acname": vendorDetails.paymentType == 1 ? vendorDetails.accountName : "",
        "bankName": vendorDetails.paymentType == 1 ? vendorDetails.bankName : "",
        "branchName": vendorDetails.paymentType == 1 ? vendorDetails.branch : "",
        "internationalACname": vendorDetails.paymentType == 2 ? vendorDetails.accountName: "",
        "internationalACnumber": vendorDetails.paymentType == 2 ? vendorDetails.accountNumber : "",
        "internationalbankName": vendorDetails.paymentType == 2 ? vendorDetails.bankName : "",
        "internationalbranchName": vendorDetails.paymentType == 2 ? vendorDetails.branch : "",
        "clabe": vendorDetails.paymentType == 1 ? vendorDetails.clabe : "",
        "rfcCode": vendorDetails.paymentType == 1 ? vendorDetails.taxId : "",
        "sortCode": vendorDetails.paymentType == 1 ? vendorDetails.sortCode : "",
        "ABAcode": vendorDetails.paymentType == 2 ? vendorDetails.abaCode : "",
        "swiftCode": vendorDetails.paymentType == 2 ? vendorDetails.swiftCode : "",
        "email": vendorDetails.emailId ? vendorDetails.emailId : "",
        "mode": vendorDetails.operationId ? vendorDetails.operationId : "",
        "currency": vendorDetails.currencyId ? vendorDetails.currencyId : "",
        "acceptThirdPartyPayment": vendorDetails.acceptThirdPartyPayment ? vendorDetails.acceptThirdPartyPayment : "",
        "commercial": vendorDetails.commercial ? vendorDetails.commercial : [],
        "corporate": vendorDetails.corporate ? vendorDetails.corporate : [],
        "contracts": vendorDetails.contracts ? vendorDetails.contracts : [],
        "entertainment": vendorDetails.entertainment ? vendorDetails.entertainment : [],
        "identityDocs": vendorDetails.identityDocs ? vendorDetails.identityDocs : [],
        "profilePicFileId": vendorDetails.profilePicFileId ? vendorDetails.profilePicFileId : "",
        "address": vendorDetails.i18n.address ? vendorDetails.i18n.address : "",
        "commercialName": vendorDetails.i18n.commercialName ? vendorDetails.i18n.commercialName : "",
        "legalName": vendorDetails.i18n.legalName ? vendorDetails.i18n.legalName : "",
        "documents": vendorDetails.identityDocs ? ManageVendorData.getIdentityDocuments(JSON.parse(JSON.stringify(vendorDetails.identityDocs))) : [],
        "langCode": "en-US",
        "selectedCommercialCategories": vendorDetails.commercial ? ManageVendorData.setCategoryIds(JSON.parse(JSON.stringify(vendorDetails.commercial))) : [],
        "selectedEntertainmentCategories": vendorDetails.entertainment ? ManageVendorData.setCategoryIds(JSON.parse(JSON.stringify(vendorDetails.entertainment))) : [],
        "selectedCorporateCategories": vendorDetails.corporate ? ManageVendorData.setCategoryIds(JSON.parse(JSON.stringify(vendorDetails.corporate))) : [],
        "representatives": vendorDetails.i18n.representatives ? ManageVendorData.getRepresentatives(vendorDetails.i18n.representatives) : [],
        "contractStatus": (vendorDetails.contracts && vendorDetails.contracts.length > 0) ? vendorDetails.contracts[0].status : "",
        "contractRejectionReason": (vendorDetails.contracts && vendorDetails.contracts.length > 0) ? vendorDetails.contracts[0].rejectionReason : "",
      }
    }
    return vendorFormData;
  }
  static setCategoryIds(categories) {
    let selectedCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let mappingId = categories[i].mappingIds[0];
      selectedCategories.push(mappingId);
    }
    return selectedCategories;
  }

  static getWebServiceDetailsData(vendorDetails: any,documents) {
    var vendorFormData;
    if (vendorDetails) {
      vendorFormData = {
        // "classification": "1",
        "classification": vendorDetails.classification ? vendorDetails.classification : "",
        "type": vendorDetails.vendorType ? vendorDetails.vendorType : "",
        "electronicIdNumber": vendorDetails.electronicIdNumber ? vendorDetails.electronicIdNumber : "",
        "phoneNo": vendorDetails.phone ? vendorDetails.phone : "",
        "sortCode": vendorDetails.paymentType == "1" ? vendorDetails.sortCode : "",
        "taxId": vendorDetails.taxId ? vendorDetails.taxId : "",
        "clabe": vendorDetails.paymentType == "1" ? vendorDetails.clabe : "",
        "rfcCode": vendorDetails.paymentType == "1" ? vendorDetails.taxId : "",
        "abaCode": vendorDetails.paymentType == "2" ? vendorDetails.ABAcode : "",
        "swiftCode": vendorDetails.paymentType == "2" ? vendorDetails.swiftCode : "",
        "currency": vendorDetails.currency ? vendorDetails.currency : "",
        "emailId": vendorDetails.emailId ? vendorDetails.emailId : "",
        "operationId": vendorDetails.mode ? vendorDetails.mode : "",
        "currencyId": vendorDetails.currency ? vendorDetails.currency : "",
        "acceptThirdPartyPayment": vendorDetails.thirdParty ? vendorDetails.thirdParty : false,
        "commercial": vendorDetails.commercial ? vendorDetails.commercial : [],
        "corporate": vendorDetails.corporate ? vendorDetails.corporate : [],
        "entertainment": vendorDetails.entertainment ? vendorDetails.entertainment : [],
        "identityDocs": documents ? ManageVendorData.saveIdentityDocs(documents) : [],

        "id": "",
        "profilePicFileId": vendorDetails.profilePicFileId ? vendorDetails.profilePicFileId : "",
        "paymentType": vendorDetails.paymentType ? vendorDetails.paymentType : "",
        "accountNumber": vendorDetails.paymentType == "1" ? vendorDetails.accNumber : vendorDetails.internationalACnumber,
        "accountName": vendorDetails.paymentType == "1" ? vendorDetails.acname : vendorDetails.internationalACname,
        "bankName": vendorDetails.paymentType == "1" ? vendorDetails.bankName : vendorDetails.internationalbankName,
        "branch": vendorDetails.paymentType == "1" ? vendorDetails.branchName : vendorDetails.internationalbranchName,
        // "type": vendorDetails.selfPaid ? vendorDetails.selfPaid : "",
        "i18n": {

          "address": vendorDetails.address ? vendorDetails.address : "",
          "commercialName": vendorDetails.companyName ? vendorDetails.companyName : "",
          "legalName": vendorDetails.legalName ? vendorDetails.legalName : "",
          "langCode": "en-US",
          "representatives": vendorDetails.representatives ? ManageVendorData.setRepresentatives(vendorDetails.representatives) : [],
        },
        "roles": []
      },
        vendorFormData.roles[0] = vendorDetails.roles ? vendorDetails.roles : "";
    }
    return vendorFormData;
  }
  static setRepresentatives(representativeData) {
    var representativeArr = [];
    for (var i = 0; i < representativeData.length; i++) {
      representativeArr.push({
        "name": representativeData[i].repName ? representativeData[i].repName : "",
        "email": representativeData[i].repEmail ? representativeData[i].repEmail : "",
        "phoneNo": representativeData[i].repPhone ? representativeData[i].repPhone : ""
      });
    }
    return representativeArr;
  }
  static getRepresentatives(representativeData) {
    var representativeArr = [];

    for (var i = 0; i < representativeData.length; i++) {
      representativeArr.push({
        "repName": representativeData[i].name ? representativeData[i].name : "",
        "repEmail": representativeData[i].email ? representativeData[i].email : "",
        "repPhone": representativeData[i].phoneNo ? representativeData[i].phoneNo : ""
      });
    }
    return representativeArr;
  }
  static saveIdentityDocs(documents) {
    let identityDocuments = [];
    let constanciaObj = {
      documentType: "Constancia",
      files: documents.selectedConstantiaDocs
    };
    let ttDObj = {
      documentType: "32D",
      files: documents.selected32DDocs
    };
    let legalObj = {
      documentType: "LegalRep",
      files: documents.selectedRepID
    };
    let byLawObj = {
      documentType: "byLaw",
      files: documents.selectedBylaw
    };
    let addressObj = {
      documentType: "Address Confirmation",
      files: documents.selectedAddress
    };
    let imssObj = {
      documentType: "IMSS",
      files: documents.selectedIMSS
    };

    identityDocuments = [constanciaObj, ttDObj, legalObj, byLawObj, addressObj, imssObj];
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
      selectedRepID: [],
      selectedBylaw: [],
      selectedAddress: [],
      selectedIMSS: [],
      selectedOtherDocs: []
    }
    let constanciaObj = _.find(documents, { "documentType": "Constancia" });
    let ttdObj = _.find(documents, { "documentType": "32D" });
    let legalrep = _.find(documents, { "documentType": "LegalRep" });
    let byLaw = _.find(documents, { "documentType": "byLaw" });
    let IMSS = _.find(documents, { "documentType": "IMSS" });
    let address = _.find(documents, { "documentType": "Address Confirmation" });
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
    if (legalrep && legalrep.files) {
      let filesArr = legalrep.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedRepID.push({ 'fileId': filesArr[i].fileId })
      }

    }
    if (byLaw && byLaw.files) {
      let filesArr = byLaw.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedBylaw.push({ 'fileId': filesArr[i].fileId })
      }

    }
    if (IMSS && IMSS.files) {
      let filesArr = IMSS.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedIMSS.push({ 'fileId': filesArr[i].fileId })
      }

    }
    if (address && address.files) {
      let filesArr = address.files;
      for (let i = 0; i < filesArr.length; i++) {
        tempDocuments.selectedAddress.push({ 'fileId': filesArr[i].fileId })
      }

    }

    if (othersObjArr && othersObjArr.length > 0) {
      othersObjArr.forEach((obj, index) => {
        tempDocuments.selectedOtherDocs.push({ 'fileId': obj.files[0].fileId, 'name': obj.name })
      })
    }
    return tempDocuments;
  };
}

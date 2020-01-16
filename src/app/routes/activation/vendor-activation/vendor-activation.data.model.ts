import { debug } from "util";

export class VendorActivationData {
  /**
  return Role details data as per formcontrol
  @param vendorDetails as Object
  **/
  static getFormDetailsData(vendorDetails: any) {
    var vendorFormData;
    if (vendorDetails) {
      vendorFormData = {
        "classification": vendorDetails.classification ? vendorDetails.classification : "",
        "electronicIdNumber": vendorDetails.electronicIdNumber ? vendorDetails.electronicIdNumber : "",
        "address": vendorDetails.address ? vendorDetails.address : "",
        "emailId": vendorDetails.emailId ? vendorDetails.emailId : "",
        "operationId": vendorDetails.operationId ? vendorDetails.operationId : "",
        "currencyId": vendorDetails.currencyId ? vendorDetails.currencyId : "",
        "commercial": [],
        "corporate": [],
        "entertainment": [],
        "identityDocs": [],
        "contracts": [],
        "i18n": {
          "commercialName": vendorDetails.commercialName ? vendorDetails.commercialName : "",
          "langCode": "en-US",
          "representatives": vendorDetails.representatives ? VendorActivationData.setRepresentatives(vendorDetails.representatives) : [],
        },
        "roles": [],
      }
    }
    return vendorFormData;
  }

  static getWebServiceDetailsData(vendorDetails: any,documents) {
    var vendorFormData;
    if (vendorDetails) {
      vendorFormData = {
        // "classification":"1",
        "classification": vendorDetails.classification ? vendorDetails.classification : "",
        "type": vendorDetails.vendorType ? vendorDetails.vendorType : "",
        "electronicIdNumber": vendorDetails.electronic ? vendorDetails.electronic : "",
        "phoneNo": vendorDetails.phone ? vendorDetails.phone : "",
        "sortCode": vendorDetails.sortCode ? vendorDetails.sortCode : "",
        "taxId": vendorDetails.taxId ? vendorDetails.taxId : "",
        "accountNumber": vendorDetails.accNumber ? vendorDetails.accNumber : "",
        "accountName": vendorDetails.acname ? vendorDetails.acname : "",
        "bankName": vendorDetails.bankName ? vendorDetails.bankName : "",
        "branch": vendorDetails.branchName ? vendorDetails.branchName : "",
        "clabe": vendorDetails.clabe ? vendorDetails.clabe : "",
        "rfcCode": vendorDetails.rfcCode ? vendorDetails.taxId : "",
        "abaCode": vendorDetails.ABAcode ? vendorDetails.ABAcode : "",
        "swiftCode": vendorDetails.swiftCode ? vendorDetails.swiftCode : "",
        "currency": vendorDetails.currency ? vendorDetails.currency : "",
        "emailId": vendorDetails.email ? vendorDetails.email : "",
        "operationId": vendorDetails.mode ? vendorDetails.mode : "",
        "currencyId": vendorDetails.currency ? vendorDetails.currency : "",
        "acceptThirdPartyPayment": vendorDetails.thirdParty ? vendorDetails.thirdParty : false,
        "commercial": vendorDetails.commercial ? vendorDetails.commercial : [],
        "corporate": vendorDetails.corporate ? vendorDetails.corporate : [],
        "entertainment": vendorDetails.entertainment ? vendorDetails.entertainment : [],
        "identityDocs": documents ? VendorActivationData.saveIdentityDocs(documents) : [],
        "id": "",
        "profilePicFileId": vendorDetails.profilePicFileId ? vendorDetails.profilePicFileId : "",
        "paymentType": vendorDetails.selfPaid ? vendorDetails.selfPaid : "",
        "i18n": {
          "address": vendorDetails.address ? vendorDetails.address : "",
          "commercialName": vendorDetails.companyName ? vendorDetails.companyName : "",
          "legalName": vendorDetails.legalName ? vendorDetails.legalName : "",
          "langCode": "en-US",
          "representatives": vendorDetails.representatives ? VendorActivationData.getRepresentatives(vendorDetails.representatives) : [],
        },
        "roles":[]
      },
      vendorFormData.roles[0]=vendorDetails.roles ? vendorDetails.roles:"";
    }
    return vendorFormData;
  }
  static saveIdentityDocs(documents)
  {
    let identityDocuments=[];
    let constanciaObj={
      documentType:"Constancia",
      files:documents.selectedConstantiaDocs
    };
    let ttDObj={
      documentType:"32D",
      files:documents.selected32DDocs
    };
    let legalObj={
      documentType:"LegalRep",
      files:documents.selectedRepID
    };
    let byLawObj={
      documentType:"byLaw",
      files:documents.selectedBylaw
    };
    let addressObj={
      documentType:"Address Confirmation",
      files:documents.selectedAddress
    };
    let imssObj={
      documentType:"IMSS",
      files:documents.selectedIMSS
    };
    // let othersObj={
    //   documentType:"Others",
    //   files:documents.selectedOtherDocs
    // };

    identityDocuments=[constanciaObj,ttDObj,legalObj,byLawObj,addressObj,imssObj];
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
  static setRepresentatives(representativeData) {
    var representativeArr = [];
    for (var i = 0; i < representativeData.length; i++) {
      representativeArr.push({
        "repName": representativeData[i].repName ? representativeData[i].repName : "",
        "repEmail": representativeData[i].repEmail ? representativeData[i].repEmail : "",
        "repPhone": representativeData[i].repPhone ? representativeData[i].repPhone : ""
      });
    }
    return representativeArr;
  }
  static getRepresentatives(representativeData) {
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
}

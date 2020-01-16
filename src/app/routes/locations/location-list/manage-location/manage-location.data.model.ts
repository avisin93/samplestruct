import * as _ from 'lodash';
export class ManageLocationData {
  /**
  return Role details data as per formcontrol
  @param userDetails as Object
  **/

  // It generates an formated Manage details object from received raw data
  static setManageLocationDetails(ManageLocationDetails: any, documents, categoryId) {

    let userFormData;
    if (ManageLocationDetails) {
      userFormData = {
        'requiredContactInfo': (ManageLocationDetails.disableContactInformation === true) ? false : true,
        'accountNumber': ManageLocationDetails.accountNumber ? ManageLocationDetails.accountNumber : '',
        'approximatePrice': ManageLocationDetails.approxPrice ? ManageLocationDetails.approxPrice : 0,
        'bankAddress': ManageLocationDetails.bankAddress ? ManageLocationDetails.bankAddress : '',
        'bankName': ManageLocationDetails.bankName ? ManageLocationDetails.bankName : '',
        'branchName': ManageLocationDetails.branchName ? ManageLocationDetails.branchName : '',
        'clabe': ManageLocationDetails.clabe ? ManageLocationDetails.clabe : '',
        'extraHours': ManageLocationDetails.extraHours ? ManageLocationDetails.extraHours : '',
        'locationSettingCost': ManageLocationDetails.locationSettingCost ? ManageLocationDetails.locationSettingCost : '',
        'deed': ManageLocationDetails.deed ? ManageLocationDetails.deed : '',
        'identity': ManageLocationDetails.identity ? ManageLocationDetails.identity : '',
        'proofAddress': ManageLocationDetails.proofAddress ? ManageLocationDetails.proofAddress : '',
        'receiptNo': ManageLocationDetails.receiptNo ? ManageLocationDetails.receiptNo : '',
        'timeForProcedure': ManageLocationDetails.timeForProcedure ? ManageLocationDetails.timeForProcedure : '',
        'spacesDescription': ManageLocationDetails.spacesDescription ? ManageLocationDetails.spacesDescription : '',
        'facilities': ManageLocationDetails.facilities ? ManageLocationDetails.facilities : '',
        'restrictions': ManageLocationDetails.restrictions ? ManageLocationDetails.restrictions : '',
        'availability': ManageLocationDetails.availability ? ManageLocationDetails.availability : '',
        'parking': ManageLocationDetails.parking ? ManageLocationDetails.parking : '',
        'neighborhoodFacilities': ManageLocationDetails.neighborhoodFacilities ? ManageLocationDetails.neighborhoodFacilities : '',
        'distanceFromMainBase': ManageLocationDetails.distanceFromMainBase ? ManageLocationDetails.distanceFromMainBase : '',
        'hospital': ManageLocationDetails.hospital ? ManageLocationDetails.hospital : '',
        'lodging': ManageLocationDetails.lodging ? ManageLocationDetails.lodging : '',
        'shops': ManageLocationDetails.shops ? ManageLocationDetails.shops : '',


        'computerImages': ManageLocationDetails.locationUpload ?
          ManageLocationData.setComputerUploadImages(ManageLocationDetails.locationUpload) : [],
        'i18n': {
          'langCode': ManageLocationDetails.langCode,
          'name': ManageLocationDetails.locationName ? ManageLocationDetails.locationName.toUpperCase() : '',
          'address': ManageLocationDetails.computerForm.locationAdd ? ManageLocationDetails.computerForm.locationAdd : '',
          'contactPersonDetails': ManageLocationDetails.contactPersons ?
            ManageLocationData.setContactPersons(ManageLocationDetails.contactPersons) : [],
        },
        'description': ManageLocationDetails.description ? ManageLocationDetails.description : '',
        'currencyId': ManageLocationDetails.currencyId ? ManageLocationDetails.currencyId : '',
        'latitude': 0,
        'longitude': 0,
        'locationDocs': documents ? ManageLocationData.setLocationAttachments(documents) : [],
        'locationCategoryId': ManageLocationDetails.category ? ManageLocationDetails.category : [],
        'locationType': ManageLocationDetails.locationType ? ManageLocationDetails.locationType : 0,
        'locationURL': ManageLocationDetails.locationURL ? ManageLocationDetails.locationURL : '',
        'permitRequired': ManageLocationDetails.permit ? ManageLocationDetails.permit : false,
        'streetViewImages': ManageLocationDetails.streetViewImages ?
          ManageLocationData.setStreetViewImages(ManageLocationDetails.streetViewImages) : [],
      };
    }
    if (ManageLocationDetails.imagesPanel === 0) {
      userFormData['locationCity'] = ManageLocationDetails.computerForm.city ? ManageLocationDetails.computerForm.city : '';
      userFormData['locationState'] = ManageLocationDetails.computerForm.state ? ManageLocationDetails.computerForm.state : '';
    } else {
      userFormData['locationCity'] = ManageLocationDetails.streetViewCity ? ManageLocationDetails.streetViewCity : '';
      userFormData['locationState'] = ManageLocationDetails.streetViewState ? ManageLocationDetails.streetViewState : '';
    }
    if (ManageLocationDetails.id !== '') {
      userFormData['id'] = ManageLocationDetails.id;
    }
    if (categoryId) {
      userFormData['categoryId'] = categoryId;
    }
    return userFormData;
  }

  // It generates an formated  contact persons object from received raw data
  static setContactPersons(contactPersonData, contactPersonIdArray?: any) {
    const contactPersonArr = [];
    for (let i = 0; i < contactPersonData.length; i++) {
      const contactPersonObj = {
        'name': contactPersonData[i].name ? contactPersonData[i].name : '',
        'email': contactPersonData[i].email ? contactPersonData[i].email : '',
        'mobilePhoneNo': contactPersonData[i].phoneNumber ? contactPersonData[i].phoneNumber : '',
        'workPhoneNo': contactPersonData[i].phoneNumberWork ? contactPersonData[i].phoneNumberWork : '',
        'isPrimaryWork': contactPersonData[i].primary ? contactPersonData[i].primary : '',
        // 'requiredContactInfo': contactPersonData[i].disableContactInformation ? contactPersonData[i].disableContactInformation : ''
      };
      if (contactPersonData[i].id !== '') {
        contactPersonObj['id'] = contactPersonData[i].id;
      }
      contactPersonArr.push(contactPersonObj);
    }
    return contactPersonArr;
  }

  static setTags(tagArrData) {
    const tagArray = [];
    for (let i = 0; i < tagArrData.length; i++) {
      tagArray.push(tagArrData[i].value);
    }
    return tagArray;
  }

  // It generates an formated ComputerUploadImages object from received raw data
  static setComputerUploadImages(imagesData) {
    const computerImagesArr = [];
    for (let i = 0; i < imagesData.length; i++) {
      const computerImagesObj = {
        'originalImageId': imagesData[i].originalImageId ? imagesData[i].originalImageId : '',
        'thumbnailImageId': imagesData[i].thumbnailImageId ? imagesData[i].thumbnailImageId : '',
        'tags': imagesData[i].tags ? ManageLocationData.setTags(imagesData[i].tags) : [],
      };
      if (imagesData[i].id !== '') {
        computerImagesObj['id'] = imagesData[i].id;
      }
      computerImagesArr.push(computerImagesObj);
    }
    return computerImagesArr;
  }

  // It generates an formated streetViewImages object from received raw data
  static setStreetViewImages(streetViewdata) {
    const streetViewdataArr = [];
    for (let i = 0; i < streetViewdata.length; i++) {
      const streetViewImagesObj = {
        'fileName': streetViewdata[i].fileName ? streetViewdata[i].fileName : '',
        'originalImageUrl': streetViewdata[i].originalImageUrl ? streetViewdata[i].originalImageUrl : '',
        'tags': streetViewdata[i].tags ? ManageLocationData.setTags(streetViewdata[i].tags) : [],
        'thumbnailImageUrl': streetViewdata[i].thumbnailImageUrl ? streetViewdata[i].thumbnailImageUrl : '',
      };
      if (streetViewdata[i].id !== '') {
        streetViewImagesObj['id'] = streetViewdata[i].id;
      }
      streetViewdataArr.push(streetViewImagesObj);
    }
    return streetViewdataArr;
  }

  // It generates an formated  location attachments object array from received raw data
  static setLocationAttachments(attachmentData) {
    let data = [];
    if (attachmentData.bankattachmentsDocs.length > 0) {
      const bankstatement = {
        documentType: 'bankStatement',
        files: attachmentData.bankattachmentsDocs ? attachmentData.bankattachmentsDocs : [],
      };
      if (attachmentData.bankdocId) {
        bankstatement['id'] = attachmentData.bankdocId;
      }
      data = [bankstatement];
    }
    for (let i = 0; i < attachmentData.locationAttachmentsDocs.length; i++) {
      const otherdocs = {
        documentType: 'otherDocuments',
        files: attachmentData.locationAttachmentsDocs[i].id ? [attachmentData.locationAttachmentsDocs[i].id] : [],
        name: attachmentData.locationAttachmentsDocs[i].name ? attachmentData.locationAttachmentsDocs[i].name : '',
      };
      if (attachmentData.locationAttachmentsDocs[i].locationdocId) {
        otherdocs['id'] = attachmentData.locationAttachmentsDocs[i].locationdocId;
      }
      data.push(otherdocs);
    }
    return data;
  }

  // It generates an formated Manage details object from received raw data
  static getManageLocationDetails(data) {

    let userFormData;

    if (data) {

      userFormData = {

        'id': data.id ? data.id : '',
        'accountNumber': data.accountNumber ? data.accountNumber : '',
        'requiredContactInfo': data.requiredContactInfo ? data.requiredContactInfo : false,
        'approximatePrice': data.approximatePrice ? data.approximatePrice : 0,
        'bankAddress': data.bankAddress ? data.bankAddress : '',
        'bankName': data.bankName ? data.bankName : '',
        'branchName': data.branchName ? data.branchName : '',
        'clabe': data.clabe ? data.clabe : '',
        'extraHours': data.extraHours ? data.extraHours : '',
        'locationSettingCost': data.locationSettingCost ? data.locationSettingCost : '',
        'deed': data.deed ? data.deed : '',
        'identity': data.identity ? data.identity : '',
        'proofAddress': data.proofAddress ? data.proofAddress : '',
        'receiptNo': data.receiptNo ? data.receiptNo : '',
        'timeForProcedure': data.timeForProcedure ? data.timeForProcedure : '',
        'spacesDescription': data.spacesDescription ? data.spacesDescription : '',
        'facilities': data.facilities ? data.facilities : '',
        'restrictions': data.restrictions ? data.restrictions : '',
        'availability': data.availability ? data.availability : '',
        'parking': data.parking ? data.parking : '',
        'neighborhoodFacilities': data.neighborhoodFacilities ? data.neighborhoodFacilities : '',
        'distanceFromMainBase': data.distanceFromMainBase ? data.distanceFromMainBase : '',
        'hospital': data.hospital ? data.hospital : '',
        'lodging': data.lodging ? data.lodging : '',
        'shops': data.shops ? data.shops : '',
        'status': data.status ? data.status : 0,
        'computerImages': data.computerImages ? ManageLocationData.getComputerUploadImages(data.computerImages) : [],
        'i18n': {
          'langCode': data.i18n.langCode ? data.i18n.langCode : '',
          'name': data.i18n.name ? data.i18n.name : '',
          'address': data.i18n.address ? data.i18n.address : '',
          'contactPersonDetails': data.i18n.contactPersonDetails ?
            ManageLocationData.getContactPersons(data.i18n.contactPersonDetails) : [],
        },
        'disableContactInformation': (data.requiredContactInfo) ? false : true,
        'latitude': data.latitude ? data.latitude : 0,
        'longitude': data.longitude ? data.longitude : 0,
        'locationDocs': data.locationDocs ? data.locationDocs : [],
        'categories': data.locationCategories ? data.locationCategories : [],
        'city': data.locationCity ? data.locationCity : '',
        'state': data.locationState ? data.locationState : '',
        // "locationName": data.locationName ? data.locationName : "",
        'locationType': data.locationType ? data.locationType : 0,
        'locationURL': data.locationURL ? data.locationURL : '',
        'permitRequired': data.permitRequired ? data.permitRequired : false,
        'streetViewImages': data.streetView ? ManageLocationData.getStreetViewImages(data.streetView) : [],
        'currencyId': data.currencyId ? data.currencyId : '',
        'description': data.description ? data.description : '',
        'categoryId': data.categoryId ? data.categoryId : ''
      };
    }
    return userFormData;
  }



  // It generates an formated tags object from received raw data
  static getTags(tagArrData) {
    const tagArr = [];
    if (tagArrData != null) {
      for (let i = 0; i < tagArrData.length; i++) {
        if (tagArrData[i] !== '' && tagArrData[i] != null) {
          tagArr.push({
            'display': tagArrData[i] ? tagArrData[i] : '',
            'value': tagArrData[i] ? tagArrData[i] : '',
          });
        }
      }
    }
    return tagArr;
  }

  // It generates an formated streetViewImages object from received raw data
  static getStreetViewImages(streetViewdata) {
    const streetViewdataArr = [];
    for (let i = 0; i < streetViewdata.length; i++) {
      const streetViewImagesObj = {
        'id': streetViewdata[i].id ? streetViewdata[i].id : '',
        'fileName': streetViewdata[i].fileName ? streetViewdata[i].fileName : '',
        'originalImageUrl': streetViewdata[i].originalImageUrl ? streetViewdata[i].originalImageUrl : '',
        'tags': streetViewdata[i].tags ? ManageLocationData.getTags(streetViewdata[i].tags) : [],
        'thumbnailImageUrl': streetViewdata[i].thumbnailImageUrl ? streetViewdata[i].thumbnailImageUrl : '',
        'age': streetViewdata[i].age ? streetViewdata[i].age : '',
        'imageOrientation': streetViewdata[i].imageOrientation ? streetViewdata[i].imageOrientation : ''
      };
      streetViewdataArr.push(streetViewImagesObj);
    }
    return streetViewdataArr;
  }

  // It generates an formated ComputerUploadImages object from received raw data
  static getComputerUploadImages(imagesData) {
    const computerImagesArr = [];
    for (let i = 0; i < imagesData.length; i++) {
      const computerImagesObj = {
        'originalImageId': imagesData[i].originalImageId ? imagesData[i].originalImageId : '',
        'thumbnailImageId': imagesData[i].thumbnailImageId ? imagesData[i].thumbnailImageId : '',
        'id': imagesData[i].id ? imagesData[i].id : '',
        'originalImageUrl': imagesData[i].originalImageUrl ? imagesData[i].originalImageUrl : '',
        'thumbnailImageUrl': imagesData[i].thumbnailImageUrl ? imagesData[i].thumbnailImageUrl : '',
        'tags': imagesData[i].tags ? ManageLocationData.getTags(imagesData[i].tags) : [],
        'fileName': imagesData[i].fileName ? imagesData[i].fileName : '',
        'age': imagesData[i].age ? imagesData[i].age : '',
        'imageOrientation': imagesData[i].imageOrientation ? imagesData[i].imageOrientation : ''
      };
      // let string1 = imagesData[i].originalImageUrl;
      // if (string1) {
      //   string1 = string1.split('filename="');
      //   let stringArray = new Array();
      //   for (let j = 0; j < string1.length; j++) {
      //     stringArray.push(string1[j]);
      //   }
      //   let obj = stringArray[1].slice('"', -1);
      //   computerImagesObj['fileName'] = obj;
      // }
      computerImagesArr.push(computerImagesObj);
    }
    return computerImagesArr;
  }

  // It generates an formated  contact persons object from received raw data
  static getContactPersons(contactPersonData, contactPersonIdArray?: any) {

    const contactPersonArr = [];
    for (let i = 0; i < contactPersonData.length; i++) {
      const contactPersonObj = {
        'id': contactPersonData[i].id ? contactPersonData[i].id : '',
        'name': contactPersonData[i].name ? contactPersonData[i].name : '',
        'email': contactPersonData[i].email ? contactPersonData[i].email : '',
        'phoneNumber': contactPersonData[i].mobilePhoneNo ? contactPersonData[i].mobilePhoneNo : '',
        'phoneNumberWork': contactPersonData[i].workPhoneNo ? contactPersonData[i].workPhoneNo : '',
        'primary': contactPersonData[i].isPrimaryWork ? contactPersonData[i].isPrimaryWork : '',
        // 'disableContactInformation': contactPersonData[i].requiredContactInfo ? contactPersonData[i].requiredContactInfo : ''
      };
      contactPersonArr.push(contactPersonObj);
    }
    return contactPersonArr;
  }
}

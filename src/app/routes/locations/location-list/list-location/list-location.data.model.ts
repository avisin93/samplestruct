import * as _ from 'lodash';
import { DatePickerMethods } from '@app/common/common';
import { ZIP_TYPES_ARR } from '@app/config/constants';

export class ListLocationDataModel {
  /**
   * [getListLocationData use to get form values from service and set to data model
   * @param  dataObj as object which contain data which come from service
   * @return  userFormData as object
   */

  static setLocationListData(listLocationDetails: any) {
    const locationListData = [];
    if (listLocationDetails && listLocationDetails.length > 0) {
      for (let i = 0; i < listLocationDetails.length; i++) {
        const dataObj = listLocationDetails[i];
        let lastModifiedDate;
        if (dataObj.lastModifiedDate) {
          lastModifiedDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.lastModifiedDate);
        }
        const locationDataObj = {
          'locationId': dataObj.locationId ? dataObj.locationId : '',
          'locationName': (dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
          'locationImages': dataObj.locationImages ? dataObj.locationImages : [],
          'imageCount': dataObj.imageCount ? dataObj.imageCount : 0,
          'city': dataObj.locationCity ? dataObj.locationCity : '',
          'state': dataObj.locationState ? dataObj.locationState : '',
          'lastModifiedDate': lastModifiedDate ? lastModifiedDate : '',
          'categories': dataObj.categories ? dataObj.categories : ''
        };
        locationListData.push(locationDataObj);
      }
    }
    return locationListData;
  }

  /**
   * sets required image details from raw incomming image list data
   * @param  imageDetails as object which contain data which come from service
   * @return  imagesListData as object
   */
  static setLocaionImages(imageDetails: any, locationDetails: any) {
    if (imageDetails && imageDetails.locationImages.length > 0) {
      const imagesListData = [];
      for (let i = 0; i < imageDetails.locationImages.length; i++) {
        const dataObj = imageDetails.locationImages[i];
        let lastModifiedDate;
        if (dataObj.modifiedAt) {
          lastModifiedDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.modifiedAt);
        }
        let parentCategoryObj = (locationDetails.categories && locationDetails.categories.length > 0) ? locationDetails.categories[locationDetails.categories.length - 1] : {};
        const imagesObject = {
          small: dataObj.thumbnailImageUrl ? dataObj.thumbnailImageUrl : '',
          medium: dataObj.thumbnailImageUrl ? dataObj.thumbnailImageUrl : '',
          big: dataObj.orignalImageUrl ? dataObj.orignalImageUrl : '',
          locationName: imageDetails.i18n.name ? imageDetails.i18n.name : '',
          locationType: (imageDetails.locationType || imageDetails.locationType === 0) ? imageDetails.locationType : '',
          permit: imageDetails.permitRequired ? imageDetails.permitRequired : '',
          price: imageDetails.approximatePrice ? imageDetails.approximatePrice : '',
          currency: imageDetails.currencyCode ? imageDetails.currencyCode : '',
          lastModified: lastModifiedDate ? lastModifiedDate : '',
          description: imageDetails.description ? imageDetails.description : '',
          approximatePrice: imageDetails.approximatePrice ? imageDetails.approximatePrice : '',
          orientation: dataObj.imageOrientation ? dataObj.imageOrientation : '',
          locationId: locationDetails.locationId ? locationDetails.locationId : '',
          parentCategoryId: parentCategoryObj.id ? parentCategoryObj.id : '',
          parentCategoryName: (parentCategoryObj.i18n && parentCategoryObj.i18n.name) ? parentCategoryObj.i18n && parentCategoryObj.i18n.name : '',
          imageId: dataObj.id ? dataObj.id : '',
          imageName: dataObj.fileName ? dataObj.fileName : ''
        };
        imagesListData.push(imagesObject);
      }
      return imagesListData;
    }
  }

  static getWebserviceDetailsForZip(zipDetailsData: any) {
    let zipDetails;
    if (zipDetailsData) {
      zipDetails = {
        'description': zipDetailsData.description ? zipDetailsData.description : '',
        'projectName': zipDetailsData.projectName ? zipDetailsData.projectName : '',
        'locations': (zipDetailsData.locations && zipDetailsData.locations.length > 0) ? ListLocationDataModel.getLocationsArrForZip(zipDetailsData.locations) : '',
        'erpProject': zipDetailsData.erpProject ? zipDetailsData.erpProject : false
      };
      if (zipDetailsData.zipNameType === ZIP_TYPES_ARR.projectName) {
        zipDetails.projectId = zipDetailsData.projectId ? zipDetailsData.projectId : '';
      }
      return zipDetails;
    }
  }
  static getLocationsArrForZip(locationsArr) {
    let tempLocationsArr = [];
    for (let locationIndex = 0; locationIndex < locationsArr.length; locationIndex++) {
      const dataObj = locationsArr[locationIndex];
      let tempObj = {
        "id": dataObj.locationId,
        "locationName": dataObj.locationName,
        "category": {
          "id": dataObj.parentCategoryId,
          "categoryName": dataObj.parentCategoryName
        }
      }
      tempObj["category"]["images"] = _.map(dataObj.images, 'id');
      tempLocationsArr.push(tempObj);
    }
    return tempLocationsArr;
  }
}

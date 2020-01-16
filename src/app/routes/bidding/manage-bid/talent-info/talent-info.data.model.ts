import * as _ from 'lodash';
export class TalentData {
  /**
  return Role details data as per formcontrol
  @param userDetails as Object
  **/

  // It generates an formated Manage details object from received raw data
  static setTalentDetails(talentDetails: any) {
    let talentData;
    if (talentDetails) {
      talentData = {
        'talentBuyOut': {
          'term': talentDetails.term ? talentDetails.term : '',
          'media': talentDetails.media ? talentDetails.media : '',
          'territory': talentDetails.territory ? talentDetails.territory : '',
          'exclusivity': talentDetails.exclusivity ? talentDetails.exclusivity : '',
        },
        'principals': talentDetails.principals ? TalentData.setArraysData(talentDetails.principals, true) : [],
        'secondries': talentDetails.secondaries ? TalentData.setArraysData(talentDetails.secondaries, true) : [],
        // tslint:disable-next-line:max-line-length
        'featuredExtras': talentDetails.featuredExtras ? TalentData.setArraysData(talentDetails.featuredExtras, false) : [],
        'crowds': talentDetails.crowds ? TalentData.setArraysData(talentDetails.crowds, false) : [],
        'genericExtras': talentDetails.genericExtras ? TalentData.setArraysData(talentDetails.genericExtras, false) : [],
        'specialExtras': talentDetails.specialExtras ? TalentData.setArraysData(talentDetails.specialExtras, false) : [],
      };
    }
    return talentData;
  }

  // It generates an formated ComputerUploadImages object from received raw data
  static setArraysData(receivedArrayData, flag) {
    const arrayData = [];
    if (flag) {
      for (let i = 0; i < receivedArrayData.length; i++) {
        const dataObj = receivedArrayData[i];
        if (dataObj.name && ((dataObj.prep || dataObj.prep === 0) || (dataObj.shoot || dataObj.shoot === 0))
        && (dataObj.costPerDay || dataObj.costPerDay === 0)) {
          const tempdataObj = {
            'name': receivedArrayData[i].name ? receivedArrayData[i].name : '',
            'prep': receivedArrayData[i].prep ? receivedArrayData[i].prep : '',
            'shoot': receivedArrayData[i].shoot ? receivedArrayData[i].shoot : '',
            'costPerDay': receivedArrayData[i].costPerDay ? receivedArrayData[i].costPerDay : '',
            'currencyId': receivedArrayData[i].currencyId ? receivedArrayData[i].currencyId : '',
          };
          arrayData.push(tempdataObj);
        }
      }
    } else {
      for (let i = 0; i < receivedArrayData.length; i++) {
        const dataObj = receivedArrayData[i];
        if (dataObj.description && (dataObj.days || dataObj.days === 0) && (dataObj.quantity || dataObj.quantity === 0)) {
        const tempdataObj = {
          'description': receivedArrayData[i].description ? receivedArrayData[i].description : '',
          'days': receivedArrayData[i].days ? receivedArrayData[i].days : '',
          'quantity': receivedArrayData[i].quantity ? receivedArrayData[i].quantity : '',
        };
        arrayData.push(tempdataObj);
      }
      }
    }
    return arrayData;
  }

  // It generates an formated Manage details object from received raw data
  static getTalentDetails(talentDetails: any) {

    let talentData;
    if (talentDetails) {
      talentData = {
        // tslint:disable-next-line:max-line-length
        'term': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.term) ? talentDetails.talentBuyOutForm.term : '',
        // tslint:disable-next-line:max-line-length
        'media': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.media) ? talentDetails.talentBuyOutForm.media : '',
        // tslint:disable-next-line:max-line-length
        'territory': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.territory) ? talentDetails.talentBuyOutForm.territory : '',
        // tslint:disable-next-line:max-line-length
        'exclusivity': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.exclusivity) ? talentDetails.talentBuyOutForm.exclusivity : '',
        // tslint:disable-next-line:max-line-length
        'principals': (talentDetails.principalsForm && talentDetails.principalsForm.principals) ? TalentData.setArraysData(talentDetails.principalsForm.principals, true) : [],
        // tslint:disable-next-line:max-line-length
        'secondaries': (talentDetails.secondriesForm && talentDetails.secondriesForm.secondries) ? TalentData.setArraysData(talentDetails.secondriesForm.secondries, true) : [],
        // tslint:disable-next-line:max-line-length
        'featuredExtras': (talentDetails.featuredExtrasForm && talentDetails.featuredExtrasForm.featuredExtras) ? TalentData.setArraysData(talentDetails.featuredExtrasForm.featuredExtras, false) : [],
        // tslint:disable-next-line:max-line-length
        'crowds': (talentDetails.crowdsForm && talentDetails.crowdsForm.crowds) ? TalentData.setArraysData(talentDetails.crowdsForm.crowds, false) : [],
        // tslint:disable-next-line:max-line-length
        'genericExtras': (talentDetails.genericExtrasForm && talentDetails.genericExtrasForm.genericExtras) ? TalentData.setArraysData(talentDetails.genericExtrasForm.genericExtras, false) : [],
        // tslint:disable-next-line:max-line-length
        'specialExtras': (talentDetails.specialExtrasForm && talentDetails.specialExtrasForm.specialExtras) ? TalentData.setArraysData(talentDetails.specialExtrasForm.specialExtras, false) : [],
      };
    }
    return talentData;
  }


  static getTalentFormPatchDetails(talentDetails: any) {
    let talentData;
    if (talentDetails) {
      talentData = {
        'talentBuyOut' : {
          'term': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.term) ? talentDetails.talentBuyOutForm.term : '',
          // tslint:disable-next-line:max-line-length
          'media': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.media) ? talentDetails.talentBuyOutForm.media : '',
          // tslint:disable-next-line:max-line-length
          'territory': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.territory) ? talentDetails.talentBuyOutForm.territory : '',
          // tslint:disable-next-line:max-line-length
          'exclusivity': (talentDetails.talentBuyOutForm && talentDetails.talentBuyOutForm.exclusivity) ? talentDetails.talentBuyOutForm.exclusivity : ''
        },
        // tslint:disable-next-line:max-line-length
        'principals': (talentDetails.principalsForm && talentDetails.principalsForm.principals) ? TalentData.setArraysData(talentDetails.principalsForm.principals, true) : [],
        // tslint:disable-next-line:max-line-length
        'secondries': (talentDetails.secondriesForm && talentDetails.secondriesForm.secondries) ? TalentData.setArraysData(talentDetails.secondriesForm.secondries, true) : [],
        // tslint:disable-next-line:max-line-length
        'featuredExtras': (talentDetails.featuredExtrasForm && talentDetails.featuredExtrasForm.featuredExtras) ? TalentData.setArraysData(talentDetails.featuredExtrasForm.featuredExtras, false) : [],
        // tslint:disable-next-line:max-line-length
        'crowds': (talentDetails.crowdsForm && talentDetails.crowdsForm.crowds) ? TalentData.setArraysData(talentDetails.crowdsForm.crowds, false) : [],
        // tslint:disable-next-line:max-line-length
        'genericExtras': (talentDetails.genericExtrasForm && talentDetails.genericExtrasForm.genericExtras) ? TalentData.setArraysData(talentDetails.genericExtrasForm.genericExtras, false) : [],
        // tslint:disable-next-line:max-line-length
        'specialExtras': (talentDetails.specialExtrasForm && talentDetails.specialExtrasForm.specialExtras) ? TalentData.setArraysData(talentDetails.specialExtrasForm.specialExtras, false) : [],
      };
    }
    return talentData;
  }
  }




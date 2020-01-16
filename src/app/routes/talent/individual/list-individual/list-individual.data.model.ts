/**
* Data Model     : IndividualListDataModel
* Author        : Boston Byte LLC
* Creation Date : 19th April, 2019
*/

export class IndividualListDataModel {
  /**
   * method to get purchase order list data
  return poListData as array of object as per list data structure
  @param poList as array of Object
  */

  static getIndividualListData(individualList: any) {
    const individualListData = [];
    if (individualList && individualList.length > 0) {
      for (let i = 0; i < individualList.length; i++) {
        const dataObj = individualList[i];
        const IndividualObj = {
          'id': dataObj.id ? dataObj.id : '',
          'name': dataObj.i18n && dataObj.i18n.displayName ? dataObj.i18n.displayName : '',
          'emailId': dataObj.emailId ? dataObj.emailId : '',
          'phone': dataObj.phoneNo ? dataObj.phoneNo : '',
          'status': dataObj.status ? dataObj.status : 0,
        };
        individualListData.push(IndividualObj);
      }
    }
    return individualListData;
  }
 
}

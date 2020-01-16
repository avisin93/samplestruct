

export class LeadListData {
    /**
     * method to get lead list data
    return leadListData as array of object as per list data structure
    @param leadList as array of Object
    */

    static getleadListDetails(leadList: any) {
        const leadListData = [];
        if (leadList && leadList.length > 0) {
            for (let leadIndex = 0; leadIndex < leadList.length; leadIndex++) {
                const dataObj = leadList[leadIndex];
                const leadObj = {
                    'id': dataObj.id ? dataObj.id : '',
                    'dealTitle': dataObj.dealTitle ? dataObj.dealTitle : '-',
                    'dealValue': dataObj.dealValue ? dataObj.dealValue : '-',
                    'currencyCode': dataObj.currencyCode ? dataObj.currencyCode : '',
                    'brand': dataObj.brand ? dataObj.brand : '-',
                    'agency': dataObj.agency ? dataObj.agency : '-',
                    'internationalProdCo': dataObj.internationalProdCo ? dataObj.internationalProdCo : '-',
                    'currencyId': dataObj.currencyId ? dataObj.currencyId : '-',
                    'isCreated': dataObj.dealCreated ? dataObj.dealCreated : false
                };
                leadListData.push(leadObj);
            }


        }
        return leadListData;
    }

}

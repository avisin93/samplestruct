

export class BidListData {
    /**
     * method to get bid list data
    return bidListData as array of object as per list data structure
    @param bidList as array of Object
    */

    static getbidListDetails(bidList: any) {
        const bidListData = [];
        if (bidList && bidList.length > 0) {
            for (let bidIndex = 0; bidIndex < bidList.length; bidIndex++) {
                const dataObj = bidList[bidIndex];
                const bidObj = {
                    'id': dataObj.id ? dataObj.id : '',
                    'projectName': dataObj.projectName ? dataObj.projectName : '-',
                    'clientName': dataObj.clientName ? dataObj.clientName : '-',
                    'agencyName': dataObj.agencyName ? dataObj.agencyName : '-',
                    'estimate': dataObj.estimate ? dataObj.estimate : '-',
                    'currencyCode': dataObj.currencyCode ? dataObj.currencyCode : '',
                    'status': (dataObj.status || dataObj.status === 0) ? dataObj.status : '-',
                    'disableProjectInputs':dataObj.disableProjectInputs ? dataObj.disableProjectInputs : false
                };
                bidListData.push(bidObj);
            }


        }
        return bidListData;
    }

}

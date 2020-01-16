import { Common } from '../../../../common';


export class ManageLeadDataModel {
    /**
     * method to get lead list data
    return leadListData as array of object as per list data structure
    @param leadList as array of Object
    */

    static getLeadDetails(dataObj: any) {
        const leadObj = {
            'dealId': dataObj.id ? dataObj.id : '',
            'dealTitle': dataObj.dealTitle ? dataObj.dealTitle : '-',
            'dealValue': dataObj.dealValue ? dataObj.dealValue : '-',
            'jobNumber': dataObj.jobNumber ? dataObj.jobNumber : '',
            'organizationName': dataObj.organizationName ? dataObj.organizationName : '-',
            'contactPersonName': dataObj.contactPersonName ? dataObj.contactPersonName : '-',
            'brand': dataObj.brand ? dataObj.brand : '-',
            'client': dataObj.client ? dataObj.client : '-',
            'agency': dataObj.agency ? dataObj.agency : '-',
            'currencyCode': dataObj.currencyCode ? dataObj.currencyCode : '',
            'internationalProdCo': dataObj.internationalProdCo ? dataObj.internationalProdCo : '-',
            'prodCoAssignedProducer': dataObj.assignedProducer ? dataObj.assignedProducer : '-',
            'expectedCloseDate': dataObj.expectedCloseDate ? ManageLeadDataModel.getDates(dataObj.expectedCloseDate) : '-',
            'currencyId': dataObj.currencyId ? dataObj.currencyId : '-'
        };
        return leadObj;
    }
    /**
     * method to get lead list data
    return leadListData as array of object as per list data structure
    @param leadList as array of Object
    */

    static setLeadDetails(dataObj: any, orgAndContactPrIdArr?) {
        const leadObj = {
            'contactPersonName': dataObj.contactPersonName ? dataObj.contactPersonName : '-',
            'organizationName': dataObj.organizationName ? dataObj.organizationName : '-',
            'dealTitle': dataObj.dealTitle ? dataObj.dealTitle : '-',
            'dealValue': dataObj.dealValue ? dataObj.dealValue : '-',
            'brand': dataObj.brand ? dataObj.brand : '-',
            'client': dataObj.client ? dataObj.client : '-',
            'agency': dataObj.agency ? dataObj.agency : '-',
            'internationalProdCo': dataObj.internationalProdCo ? dataObj.internationalProdCo : '-',
            'assignedProducer': dataObj.prodCoAssignedProducer ? dataObj.prodCoAssignedProducer : '-',
            'jobNumber': dataObj.jobNumber ? dataObj.jobNumber : '',
            'currencyId': dataObj.currencyId ? dataObj.currencyId : '-',
            'expectedCloseDate': dataObj.expectedCloseDate ? ManageLeadDataModel.setDates(dataObj.expectedCloseDate) : ''
        };
        if (orgAndContactPrIdArr) {
            if (orgAndContactPrIdArr.organizationId) {
                leadObj['organizationId'] = orgAndContactPrIdArr.organizationId;
            }
            if (orgAndContactPrIdArr.contactPersonId) {
                leadObj['contactPersonId'] = orgAndContactPrIdArr.contactPersonId;
            }
        }
        return leadObj;
    }
    // modal to convert date in required UTC format
    static setDates(dateReceived) {
        let date;
        if (dateReceived) {
            const dobObj = Common.setOffsetToUTC(dateReceived, '');
            date = dobObj['fromDate'];
        }
        return date;
    }
    // modal to remove offset and convert date in required format
    static getDates(dateReceived) {
        let date;
        if (dateReceived) {
            const dobObj = Common.removeOffsetFromUTC(dateReceived);
            date = Common.getDateObjData(dobObj);
        }
        return date;
    }
}

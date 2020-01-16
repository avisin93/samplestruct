import { DatePickerMethods, Common } from '../../../../../../common';

export class ManageSettlementListData {
    /**
     * method to get purchase order list data
    return poListData as array of object as per list data structure
    @param poList as array of Object
    */

    static getSettlementListDetails(poList: any) {
        var poListData = [];
        if (poList && poList.length > 0) {
            for (let i = 0; i < poList.length; i++) {
                let dataObj = poList[i];
                let settlementDate;
                let createdDate;
                if (dataObj.settlementDate) {
                    settlementDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.settlementDate);
                }
                if (dataObj.createdDate) {
                    createdDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.createdDate);
                }
                let poObj = {
                    "id": dataObj.id ? dataObj.id : "",
                    "purchaseOrderId": dataObj.purchaseOrderId ? dataObj.purchaseOrderId : "",
                    "adjustmentPOId": dataObj.adjustmentPOId ? dataObj.adjustmentPOId : "",
                    "settlementFor": dataObj.settlementFor ? dataObj.settlementFor : 0,
                    "supplierType": dataObj.supplierType ? dataObj.supplierType : 0,
                    "supplierName": (dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : "",
                    "purchaseOrderNumber": dataObj.purchaseOrderNumber ? dataObj.purchaseOrderNumber : "",
                    "budgetLines": dataObj.budgetLines ? dataObj.budgetLines : "",
                    "canEdit": dataObj.canEdit ? dataObj.canEdit : false,
                    "canCancel": dataObj.canCancel ? dataObj.canCancel : false,
                    "ownSettlement": dataObj.ownSettlement ? dataObj.ownSettlement : false,
                    "createdDate": createdDate ? createdDate : "",
                    "settlementDate": settlementDate ? settlementDate : "-",
                    "adjustmentPOFile": (dataObj.adjustmentPOFile && dataObj.adjustmentPOFile.url) ? dataObj.adjustmentPOFile.url : "",
                    "defaultCurrencyAmount": dataObj.defaultCurrencyAmount ? dataObj.defaultCurrencyAmount : 0,
                    "totalAmount": dataObj.totalAmount ? dataObj.totalAmount : 0,
                    "status": dataObj.status ? dataObj.status : 0,
                    "currencyCode": dataObj.currencyCode ? dataObj.currencyCode : "",
                    "thirdPartyVendorName": (dataObj.thirdPartyVendor && dataObj.thirdPartyVendor.name) ? dataObj.thirdPartyVendor.name : "",
                    "approverName": (dataObj.approver && dataObj.approver.approvalUserI18n && dataObj.approver.approvalUserI18n.name) ? dataObj.approver.approvalUserI18n.name : "",
                    "approverRole": (dataObj.approver && dataObj.approver.approverRoleName) ? dataObj.approver.approverRoleName : "",
                    "approverStatus": (dataObj.approver && dataObj.approver.status) ? dataObj.approver.status : 0,
                    "approvalList": (dataObj.approvalList && dataObj.approvalList.length > 0) ? ManageSettlementListData.getApprovalHierarchyData(dataObj.approvalList) : []
                }
                poListData.push(poObj)
            }


        }
        return poListData;
    }
    /**
    * method to get approval hierarchy array
    return poListData as array of object as per list data structure
    @param poList as array of Object
    */
    public static getApprovalHierarchyData(poApprovalHierarchyData) {
        const approvalHierarchyArr = [];
        for (let i = 0; i < poApprovalHierarchyData.length; i++) {
            const dataObj = poApprovalHierarchyData[i];
            const approvalHierarchyObj = {
                'approverName': (dataObj && dataObj.approvalUserI18n && dataObj.approvalUserI18n.name) ? dataObj.approvalUserI18n.name : '',
                'approverRole': (dataObj && dataObj.approverRoleName) ? dataObj.approverRoleName : '',
                'status': (dataObj && dataObj.status) ? dataObj.status : 0
            }
            approvalHierarchyArr.push(approvalHierarchyObj);
        }
        return approvalHierarchyArr;
    }

}


import { DatePickerMethods } from '../../../../common';


export class PassesDataModel {
    static getPassesListDetails(passesList: any) {
        const passesListData = [];
        if (passesList && passesList.length > 0) {
            for (let i = 0; i < passesList.length; i++) {
                const dataObj = passesList[i];
                let modifiedOn;
                if (dataObj.paymentDate) {
                    modifiedOn = DatePickerMethods.getDateWithTimezoneAdding(dataObj.modifiedOn);
                }

                const passesObj = {
                    'aicpFileUrl': dataObj.aicpFileUrl ? dataObj.aicpFileUrl : '',
                    'pass': dataObj.passName ? dataObj.passName : '',
                    'status': dataObj.status ? dataObj.status : '',
                    'createdFrom': dataObj.createdFromPassName ? dataObj.createdFromPassName : '',
                    'biddingType': dataObj.biddingType ? dataObj.biddingType : '',
                    'currency': dataObj.currencyCode ? dataObj.currencyCode : '',
                    'currencyAmount': dataObj.estimate ? dataObj.estimate : '',
                    'daterange': dataObj.modifiedOn ? dataObj.modifiedOn : '',
                    'estimate': dataObj.estimate ? dataObj.estimate : '',
                    'id': dataObj.id ? dataObj.id : '',
                    'projectId': dataObj.projectId ? dataObj.projectId : '',
                    "approverName": (dataObj.approver && dataObj.approver.i18n && dataObj.approver.i18n.name) ? dataObj.approver.i18n.name : "",
                    "approverRole": (dataObj.approver && dataObj.approver.approverRoleName) ? dataObj.approver.approverRoleName : "",
                    "approverStatus": (dataObj.approver && dataObj.approver.status) ? dataObj.approver.status : 0,
                    "approvalList": (dataObj.approvalsList && dataObj.approvalsList.length > 0) ? dataObj.approvalsList : [],
                    'rejectReason': dataObj.rejectReason ? dataObj.rejectReason : '',
                    "approvalStatus": dataObj.approvalStatus ? dataObj.approvalStatus : 0,
                    "convertToProject": dataObj.convertToProject ? dataObj.convertToProject : false,
                    "rejectionReason": (dataObj.approver && dataObj.approver.rejectReason) ? dataObj.approver.rejectReason : "",
                   'allowToCreatePass': dataObj.allowToCreatePass ? dataObj.allowToCreatePass : false

                };
                passesListData.push(passesObj);
            }
        }

        return passesListData;
    }

    /**
    * method to get approval hierarchy array
    return poListData as array of object as per list data structure 
    @param poList as array of Object
    */
    public static getApprovalHierarchyData(approvalHierarchyData) {
        const approvalHierarchyArr = [];
        for (let i = 0; i < approvalHierarchyData.length; i++) {
            const dataObj = approvalHierarchyData[i];
            const approvalHierarchyObj = {
                'name': (dataObj && dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
                'role': (dataObj && dataObj.approverRoleName) ? dataObj.approverRoleName : '',
                'status': (dataObj && dataObj.status) ? dataObj.status : 0
            }
            approvalHierarchyArr.push(approvalHierarchyObj);
        }
        return approvalHierarchyArr;
    }
}

import { debug } from 'util';

export class BidApprovalData {
    /**
    return Role details data as per formcontrol
    @param approvalDetails as Object
    **/
    static setApprovalData(approvalDetails: any) {
        let approvalFormData;
        if (approvalDetails) {
            approvalFormData = {
                'approvalHierarchy': approvalDetails.bidApprovalHierarchy ? BidApprovalData.setBidApprovalHierarchy(approvalDetails.bidApprovalHierarchy) : [],
            };
        }
        return approvalFormData;
    }

    static getApprovalData(approvalDetails: any) {
        let approvalFormData;
        if (approvalDetails) {
            approvalFormData = {

                'bidApprovalHierarchy': approvalDetails ? BidApprovalData.getBidApprovalHierarchy(approvalDetails) : [],
            };
        }
        return approvalFormData;
    }

    static setBidApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                'level': approvalData[i].level ? approvalData[i].level : 0
            });
        }
        return approvalDataArr;
    }

    static getBidApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        if (approvalData.length > 0) {
            for (let i = 0; i < approvalData.length; i++) {
                approvalDataArr.push({
                    'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                    'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                    'level': approvalData[i].level ? approvalData[i].level : 0
                });
            }
        }
        return approvalDataArr;
    }


}

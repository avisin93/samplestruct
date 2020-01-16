export class ApprovalData {
    /**
    return Role details data as per formcontrol
    @param approvalDetails as Object
    **/
    static setApprovalData(approvalDetails: any) {
        let approvalFormData;
        if (approvalDetails) {
            approvalFormData = {

                // tslint:disable-next-line:max-line-length
                'poApprovalHierarchy': approvalDetails.approvalHierarchy ? ApprovalData.setApprovalHierarchy(approvalDetails.approvalHierarchy) : [],
                // tslint:disable-next-line:max-line-length
                // 'advancePaymentApprovalHierarchy': approvalDetails.advancesApprovalHierarchy ? ApprovalData.setAdvancesApprovalHierarchy(approvalDetails.advancesApprovalHierarchy) : [],
                //temporarily advance payment approval hierarchy removed so empty array set as value
                'advancePaymentApprovalHierarchy': [],
                // tslint:disable-next-line:max-line-length
                'invoiceApprovalHierarchy': approvalDetails.invoiceApprovalHierarchy ? ApprovalData.setinvoiceApprovalHierarchy(approvalDetails.invoiceApprovalHierarchy) : [], // parameter need to change while service integration(approvalDetails.invoiceApprovalHierarchy)
                'talentPoApprovalHierarchy': approvalDetails.talentApprovalHierarchy ? ApprovalData.setTalentApprovalHierarchy(approvalDetails.talentApprovalHierarchy) : [],
                'talentInvoiceApprovalHierarchy': approvalDetails.talentInvoiceApprovalHierarchy ? ApprovalData.setTalentInvoiceApprovalHierarchy(approvalDetails.talentInvoiceApprovalHierarchy) : [],
                'visibilityAccess': approvalDetails.projectVisibility ? ApprovalData.setVisibility(approvalDetails.projectVisibility) : [],
                // tslint:disable-next-line:max-line-length
                'settlementApprovalHierarchy': approvalDetails.settlementApprovalHierarchy ? ApprovalData.setsettlementApprovalHierarchy(approvalDetails.settlementApprovalHierarchy) : [],
            };
        }
        return approvalFormData;
    }

    static getApprovalData(approvalDetails: any) {
        let approvalFormData;
        if (approvalDetails) {
            approvalFormData = {

                // tslint:disable-next-line:max-line-length
                'approvalHierarchy': approvalDetails.poApprovalHierarchy ? ApprovalData.getApprovalHierarchy(approvalDetails.poApprovalHierarchy) : [],
                // tslint:disable-next-line:max-line-length
                // 'advancesApprovalHierarchy': approvalDetails.advancePaymentApprovalHierarchy ? ApprovalData.getAdvancesApprovalHierarchy(approvalDetails.advancePaymentApprovalHierarchy) : [],
                //temporarily advance payment approval hierarchy removed so empty array set as value
                'advancesApprovalHierarchy': [],
                // tslint:disable-next-line:max-line-length
                'invoiceApprovalHierarchy': approvalDetails.invoiceApprovalHierarchy ? ApprovalData.getinvoiceApprovalHierarchy(approvalDetails.invoiceApprovalHierarchy) : [], // parameter need to change while service integration(approvalDetails.invoiceApprovalHierarchy)
                'projectVisibility': approvalDetails.visibilityAccess ? ApprovalData.getVisibility(approvalDetails.visibilityAccess) : [],
                'talentApprovalHierarchy': approvalDetails.talentPoApprovalHierarchy ? ApprovalData.getTalentApprovalHierarchy(approvalDetails.talentPoApprovalHierarchy) : [],
                'talentInvoiceApprovalHierarchy': approvalDetails.talentInvoiceApprovalHierarchy ? ApprovalData.getTalentInvoiceApprovalHierarchy(approvalDetails.talentInvoiceApprovalHierarchy) : [],
                // tslint:disable-next-line:max-line-length
                'settlementApprovalHierarchy': approvalDetails.settlementApprovalHierarchy ? ApprovalData.getsettlementApprovalHierarchy(approvalDetails.settlementApprovalHierarchy) : [],
            };
        }
        return approvalFormData;
    }




    static setApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                'startLimit': approvalData[i].startLimit || approvalData[i].startLimit === 0 ? approvalData[i].startLimit : '',
                'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }
    static setAdvancesApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                // 'startLimit': approvalData[i].startLimit || approvalData[i].startLimit === 0 ? approvalData[i].startLimit : '',
                // 'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }

    static setinvoiceApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                'startLimit': approvalData[i].startLimit || approvalData[i].startLimit === 0 ? approvalData[i].startLimit : '',
                'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }

    static setTalentApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                'startLimit': approvalData[i].startLimit || approvalData[i].startLimit === 0 ? approvalData[i].startLimit : '',
                'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }
    static setTalentInvoiceApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                'startLimit': approvalData[i].startLimit || approvalData[i].startLimit === 0 ? approvalData[i].startLimit : '',
                'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }
    static setsettlementApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'approverRoleId': approvalData[i].role ? approvalData[i].role : '',
                'approverUserId': approvalData[i].user ? approvalData[i].user : '',
                // 'startLimit': approvalData[i].startLimit || approvalData[i].startLimit == 0 ? approvalData[i].startLimit : '',
                // 'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }

    static setVisibility(visibilityData) {
        const visibilityArr = [];
        for (let i = 0; i < visibilityData.length; i++) {
            visibilityArr.push({
                'roleId': visibilityData[i].visibilityRole ? visibilityData[i].visibilityRole : '',
                'users': visibilityData[i].visibilityUser ? visibilityData[i].visibilityUser : []
            });
        }
        return visibilityArr;
    }
    static getApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit === 0) ? approvalData[i].startLimit : '',
                'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }
    static getAdvancesApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        for (let i = 0; i < approvalData.length; i++) {
            approvalDataArr.push({
                'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                // 'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit === 0) ? approvalData[i].startLimit : '',
                // 'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                'level': approvalData[i].level
            });
        }
        return approvalDataArr;
    }

    static getTalentApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        if (approvalData.length > 0) {
            for (let i = 0; i < approvalData.length; i++) {
                approvalDataArr.push({
                    'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                    'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                    'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit === 0) ? approvalData[i].startLimit : '',
                    'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                    'level': approvalData[i].level
                });
            }
        }
        return approvalDataArr;
    }

    static getTalentInvoiceApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        if (approvalData.length > 0) {
            for (let i = 0; i < approvalData.length; i++) {
                approvalDataArr.push({
                    'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                    'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                    'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit === 0) ? approvalData[i].startLimit : '',
                    'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                    'level': approvalData[i].level
                });
            }
        }
        return approvalDataArr;
    }
    static getinvoiceApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        if (approvalData.length > 0) {
            for (let i = 0; i < approvalData.length; i++) {
                approvalDataArr.push({
                    'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                    'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                    'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit === 0) ? approvalData[i].startLimit : '',
                    'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                    'level': approvalData[i].level
                });
            }
        }
        return approvalDataArr;
    }

    static getsettlementApprovalHierarchy(approvalData) {
        const approvalDataArr = [];
        if (approvalData.length > 0) {
            for (let i = 0; i < approvalData.length; i++) {
                approvalDataArr.push({
                    'role': approvalData[i].approverRoleId ? approvalData[i].approverRoleId : '',
                    'user': approvalData[i].approverUserId ? approvalData[i].approverUserId : '',
                    // 'startLimit': (approvalData[i].startLimit || approvalData[i].startLimit == 0 )? approvalData[i].startLimit : '',
                    // 'endLimit': approvalData[i].endLimit ? approvalData[i].endLimit : '',
                    'level': approvalData[i].level
                });
            }
        }
        return approvalDataArr;
    }

    static getVisibility(visibilityData) {
        const visibilityArr = [];
        for (let i = 0; i < visibilityData.length; i++) {
            visibilityArr.push({
                'visibilityRole': visibilityData[i].roleId ? visibilityData[i].roleId : '',
                'visibilityUser': visibilityData[i].users ? visibilityData[i].users : []
            });
        }
        return visibilityArr;
    }

}

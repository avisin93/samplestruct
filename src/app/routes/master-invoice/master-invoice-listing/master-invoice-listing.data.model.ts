import { DatePickerMethods, Common } from '@app/common';

export class ManageMasterInvoiceListData {
    /**
     * method to get invoice list data
    return invoiceListData as array of object as per list data structure
    @param poList as array of Object
    */
    static getInvoiceListDetails(poList: any) {
        const invoiceListData = [];
        if (poList && poList.length > 0) {
            for (let i = 0; i < poList.length; i++) {
                const dataObj = poList[i];
                let paymentDate;
                let invoiceDate;
                if (dataObj.paymentDate) {
                    paymentDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.paymentDate);
                }
                if (dataObj.invoiceDate) {
                    invoiceDate = DatePickerMethods.getDateWithTimezoneAdding(dataObj.invoiceDate);
                }
                const invoiceObj = {
                    'invoiceId': dataObj.id ? dataObj.id : '',
                    'projectName': dataObj.projectName ? dataObj.projectName : '',
                    'purchaseOrderId': dataObj.purchaseOrderId ? dataObj.purchaseOrderId : '',
                    'adjustmentPOId': dataObj.adjustmentPOId ? dataObj.adjustmentPOId : '',
                    'paymentStatus': (dataObj.paymentStatus || dataObj.paymentStatus == 0) ? dataObj.paymentStatus : '',
                    'paymentCount': dataObj.paymentCount ? dataObj.paymentCount : '',
                    'supplierType': dataObj.supplierType ? dataObj.supplierType : 0,
                    'supplierName': (dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
                    'invoiceNumber': dataObj.invoiceNumber ? dataObj.invoiceNumber : '',
                    'purchaseOrderNumber': dataObj.purchaseOrderNumber ? dataObj.purchaseOrderNumber : '',
                    'budgetLines': dataObj.budgetLines ? dataObj.budgetLines : '',
                    'canEdit': dataObj.canEdit ? dataObj.canEdit : false,
                    'canCancel': dataObj.canCancel ? dataObj.canCancel : false,
                    'canPay': dataObj.canPay ? dataObj.canPay : false,
                    'ownInvoice': dataObj.ownInvoice ? dataObj.ownInvoice : false,
                    'invoiceDate': invoiceDate ? invoiceDate : '',
                    'createdBy': (dataObj.createdBy && dataObj.createdBy.displayName) ? dataObj.createdBy.displayName : '',
                    'paymentDate': paymentDate ? paymentDate : '',
                    'invoiceAmount': (dataObj.invoiceAmount || dataObj.invoiceAmount === 0) ? dataObj.invoiceAmount : '',
                    'invoiceFile': (dataObj.invoiceFile && dataObj.invoiceFile.url) ? dataObj.invoiceFile.url : '',
                    'defaultCurrencyAmount': (dataObj.defaultCurrencyAmount || dataObj.defaultCurrencyAmount === 0) ?
                        dataObj.defaultCurrencyAmount : 0,
                    'totalAmount': dataObj.totalAmount ? dataObj.totalAmount : 0,
                    'status': (dataObj.status || dataObj.status === 0) ? dataObj.status : 0,
                    'currencyCode': dataObj.currencyCode ? dataObj.currencyCode : '',
                    'approverName': (dataObj.approver && dataObj.approver.i18n && dataObj.approver.i18n.name) ?
                        dataObj.approver.i18n.name : '',
                    'invoiceFor': (dataObj.invoiceFor || dataObj.invoiceFor === 0) ? dataObj.invoiceFor : '',
                    'approverRole': (dataObj.approver && dataObj.approver.approverRoleName) ? dataObj.approver.approverRoleName : '',
                    'approverStatus': (dataObj.approver && dataObj.approver.status) ? dataObj.approver.status : 0,
                    'approverId': (dataObj.approver && dataObj.approver.approverUserId) ? dataObj.approver.approverUserId : '',
                    'approvalList': (dataObj.approvalList && dataObj.approvalList.length > 0) ?
                        ManageMasterInvoiceListData.getApprovalHierarchyData(dataObj.approvalList) : [],
                    'thirdPartyVendor': (dataObj.thirdPartyVendor && dataObj.thirdPartyVendor.name) ? dataObj.thirdPartyVendor.name : 'NA',
                    'approverReasons': (dataObj.approver && dataObj.approver.reasons) ? dataObj.approver.reasons : [],
                    'approver': dataObj.approver ? dataObj.approver : {},
                    'projectId': dataObj.projectId ? dataObj.projectId : '',
                    'projectBudgetId': dataObj.projectBudgetId ? dataObj.projectBudgetId : '',
                    'palAccepted': dataObj.acceptTerms ? dataObj.acceptTerms : false,
                    'contractAccepted': dataObj.contractAcceptance ? dataObj.contractAcceptance : false,
                    'projectTypeId': dataObj.projectTypeId ? dataObj.projectTypeId : '',
                };
                invoiceListData.push(invoiceObj);
            }


        }
        return invoiceListData;
    }
    /**
    * method to get approval hierarchy array
    return invoiceListData as array of object as per list data structure
    @param poList as array of Object
    */
    public static getApprovalHierarchyData(poApprovalHierarchyData) {
        const approvalHierarchyArr = [];
        for (let i = 0; i < poApprovalHierarchyData.length; i++) {
            const dataObj = poApprovalHierarchyData[i];
            const approvalHierarchyObj = {
                'approverName': (dataObj && dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
                'approverRole': (dataObj && dataObj.approverRoleName) ? dataObj.approverRoleName : '',
                'status': (dataObj && (dataObj.status || dataObj.status == 0)) ? dataObj.status : 0
            };
            approvalHierarchyArr.push(approvalHierarchyObj);
        }
        return approvalHierarchyArr;
    }
    /**
      * method to get approval hierarchy array
      return paymentListData as array of object as per list data structure
      @param paymentsListIncommingData as array of Object
      */
    static getPaymentsListDetails(paymentsListIncommingData) {
        const paymentsListData: any = [];
        if (paymentsListIncommingData) {
            for (let i = 0; i < paymentsListIncommingData.length; i++) {
                const data = paymentsListIncommingData[i];
                const paymentsData = {
                    'paymentAmount': data.paymentAmount ? data.paymentAmount : '',
                    'scheduleDate': data.scheduleDate ? ManageMasterInvoiceListData.getDisplayDate(data.scheduleDate) : '',
                    'paymentId': data.paymentId ? data.paymentId : '',
                    'paymentCurrencyCode': data.currencyCode ? data.currencyCode : '',
                    'conversionRate': data.conversionRate ? data.conversionRate : 0,
                    'paymentStatus': data.status ? data.status : 0,
                };
                paymentsListData.push(paymentsData);
            }
            return paymentsListData;
        }
    }

    /**
     * Adds timezone to the passed date
     * @param dateReceived as passed date
     */
    static getDisplayDate(dateReceived) {
        const date = DatePickerMethods.getDateWithTimezoneAdding(dateReceived);
        return date;
    }


    static setApprovalData(data: any, reasonList) {
        let approverData;
        approverData = {
            'approverRoleId': data.approverRoleId,
            'approverUserId': data.approverUserId,
            'level': data.level,
            'reasons': reasonList
        };
        return approverData;
    }
}
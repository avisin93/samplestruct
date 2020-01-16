import { Common, DatePickerMethods } from '../../../../../../../common'
import { ADVANCES_FOR_CONST } from '../../../../../../../config'
import * as _ from 'lodash';

export class ManageSettlementData {
    /**
    return Role details data as per formcontrol
    @param settlementDetails as Object
    **/
    static getFormDetails(settlementDetails: any) {
        var settlementFormData;

        if (settlementDetails) {
            let date;
            if (settlementDetails.settlementDate) {
                let settlementDate = DatePickerMethods.getDateWithTimezoneAdding(settlementDetails.settlementDate);
                date = Common.getDateObjData(settlementDate);
            }
            settlementFormData = {
                "advances": (settlementDetails.advances && settlementDetails.advances.length > 0) ? settlementDetails.advances : [],
                "settlementAmount": settlementDetails.settlementAmount ? settlementDetails.settlementAmount : "",
                "freelancerId": settlementDetails.freelancerId ? settlementDetails.freelancerId : "",
                "receiptsArr": (settlementDetails.receipts && settlementDetails.receipts.length > 0) ? ManageSettlementData.getReceipts(settlementDetails.receipts) : [],
                "amountToBeReceivedArr": (settlementDetails.receivables && settlementDetails.receivables.length > 0) ? ManageSettlementData.getAmount(settlementDetails.receivables) : [],
                "paybackAmountArr": (settlementDetails.payables && settlementDetails.payables.length > 0) ? ManageSettlementData.getAmount(settlementDetails.payables) : [],
                "date": date ? date : "",
                "status": settlementDetails.status ? settlementDetails.status : ''
            }
            if (settlementDetails.settlementFor == ADVANCES_FOR_CONST.freelancer) {
                settlementFormData["userId"] = settlementDetails.freelancerId ? settlementDetails.freelancerId : "";
            }
            if (settlementDetails.settlementFor == ADVANCES_FOR_CONST.vendor) {
                settlementFormData["userId"] = settlementDetails.vendorId ? settlementDetails.vendorId : "";
            }
        }
        return settlementFormData;
    }

    static getWebServiceDetails(settlementDetails: any, advancesList: any) {
        var settlementFormData;
        if (settlementDetails) {
            let date;
            if (settlementDetails.date) {
                date = DatePickerMethods.getIsoDateFromDateObj(settlementDetails.date);
            }
            settlementFormData = {
                "projectId": settlementDetails.projectId ? settlementDetails.projectId : "",
                "advances": (advancesList && advancesList.length > 0) ? _.map(advancesList, 'id') : [],
                "receipts": settlementDetails.receiptsArr ? ManageSettlementData.setReceipts(settlementDetails.receiptsArr, settlementDetails.currencyId) : [],
                "receivables": settlementDetails.amountToBeReceivedArr ? ManageSettlementData.setAmount(settlementDetails.amountToBeReceivedArr, settlementDetails.currencyId) : [],
                "payables": settlementDetails.paybackAmountArr ? ManageSettlementData.setAmount(settlementDetails.paybackAmountArr, settlementDetails.currencyId) : [],
                "settlementDate": date ? date : "",
                "settlementFor": settlementDetails.advancesFor,
                "status": settlementDetails.status
            }
            if (settlementDetails.advancesFor == ADVANCES_FOR_CONST.freelancer) {
                settlementFormData["freelancerId"] = settlementDetails.userId ? settlementDetails.userId : "";
            }
            if (settlementDetails.advancesFor == ADVANCES_FOR_CONST.vendor) {
                settlementFormData["vendorId"] = settlementDetails.userId ? settlementDetails.userId : "";
            }
            return settlementFormData;
        }
    }
    static getReceipts(receiptsData) {
        var receiptsArr = [];

        for (var i = 0; i < receiptsData.length; i++) {
            receiptsArr.push({
                "budgetLine": receiptsData[i].projectConfigurationId ? receiptsData[i].projectConfigurationId : "",
                "amount": (receiptsData[i].amount || receiptsData[i].amount==0) ? receiptsData[i].amount : "",
                "vat":(receiptsData[i].vatAmount || receiptsData[i].vatAmount==0) ? receiptsData[i].vatAmount : "",
                "receiptType": receiptsData[i].deductionType,
                "files": (receiptsData[i].files && receiptsData[i].files.length > 0) ? receiptsData[i].files : [],
                "description": receiptsData[i].description ? receiptsData[i].description : "",
                "budgetLineName": receiptsData[i].budgetLine ? receiptsData[i].budgetLine : "",
                "isAttachedImg": (receiptsData[i].files && receiptsData[i].files.length > 0) ? 'uploaded' : ''

            });
        }
        return receiptsArr;
    }
    static setReceipts(receiptsData, currencyId) {
        var receiptsArr = [];

        for (var i = 0; i < receiptsData.length; i++) {
            receiptsArr.push({
                "projectConfigurationId": receiptsData[i].budgetLine ? receiptsData[i].budgetLine : "",
                "budgetLine": receiptsData[i].budgetLineName ? receiptsData[i].budgetLineName : "",
                "amount": (receiptsData[i].amount || receiptsData[i].amount==0) ? parseFloat(receiptsData[i].amount) : "",
                "vatAmount": ( receiptsData[i].vat || receiptsData[i].vat==0) ? parseFloat(receiptsData[i].vat) : "",
                "currencyId": currencyId ? currencyId : "",
                "deductionType": receiptsData[i].receiptType ? receiptsData[i].receiptType : 0,
                "files": (receiptsData[i].files && receiptsData[i].files.length > 0) ? _.map(receiptsData[i].files, 'id') : [],
                "description": receiptsData[i].description ? receiptsData[i].description : ""
            });
        }
        return receiptsArr;
    }
    static setAmount(amountReceivedData, currencyId) {
        var amountReceivedArr = [];

        for (var i = 0; i < amountReceivedData.length; i++) {
                amountReceivedArr.push({
                    "amount": (amountReceivedData[i].amount || amountReceivedData[i].amount==0)  ? parseFloat(amountReceivedData[i].amount) : "",
                    "operation": amountReceivedData[i].mode ? amountReceivedData[i].mode : "",
                    "currencyId": currencyId ? currencyId : "",
                });
        }
        return amountReceivedArr;
    }
    static getAmount(amountReceivedData) {
        var amountReceivedArr = [];

        for (var i = 0; i < amountReceivedData.length; i++) {
            amountReceivedArr.push({
                "amount": (amountReceivedData[i].amount || amountReceivedData[i].amount==0) ? amountReceivedData[i].amount : "",
                "mode": amountReceivedData[i].operation ? amountReceivedData[i].operation : "",
            });
        }
        return amountReceivedArr;
    }

}

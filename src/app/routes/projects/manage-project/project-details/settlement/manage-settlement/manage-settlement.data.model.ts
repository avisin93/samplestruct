import { Common, DatePickerMethods } from '../../../../../../common'
import { ADVANCES_FOR_CONST } from '../../../../../../config'
import * as _ from 'lodash';

export class ManagePOSettlementData {
    /**
    * method to get settlement deatils 
    return settlementFormData as object as per form structure
     @param settlementDetails as Object
    */
    static getFormDetails(settlementDetails: any) {
        var settlementFormData;

        if (settlementDetails) {
            let date;
            if (settlementDetails.settlementDate) {
                let settlementDate = DatePickerMethods.getDateWithTimezoneAdding(settlementDetails.settlementDate);
                date = Common.getDateObjData(settlementDate);
            }
            settlementFormData = {
                "purchaseOrderId": settlementDetails.purchaseOrderId ? settlementDetails.purchaseOrderId : "",
                "settlementAmount": settlementDetails.settlementAmount ? settlementDetails.settlementAmount : "",
                "receiptsArr": (settlementDetails.receipts && settlementDetails.receipts.length > 0) ? ManagePOSettlementData.getReceipts(settlementDetails.receipts) : [],
                "amountToBeReceivedArr": (settlementDetails.receivables && settlementDetails.receivables.length > 0) ? ManagePOSettlementData.getAmount(settlementDetails.receivables) : [],
                "paybackAmountArr": (settlementDetails.payables && settlementDetails.payables.length > 0) ? ManagePOSettlementData.getAmount(settlementDetails.payables) : [],
                "date": date ? date : "",
                "status": (settlementDetails.status || settlementDetails.status == 0) ? settlementDetails.status : ''
            }
        }
        return settlementFormData;
    }

     /**
    * method to get settlement deatils 
    return settlementFormData as object as per web service data structure
     @param settlementDetails as Object
    */
    static getWebServiceDetails(settlementDetails: any, advancesList: any ,status) {
        var settlementFormData;
        if (settlementDetails) {
            let date;
            if (settlementDetails.date) {
                date = DatePickerMethods.getIsoDateFromDateObj(settlementDetails.date);
            }
            settlementFormData = {
                "projectId": settlementDetails.projectId ? settlementDetails.projectId : "",
                "purchaseOrderId": settlementDetails.purchaseOrderId ? settlementDetails.purchaseOrderId : "",
                "receipts": settlementDetails.receiptsArr ? ManagePOSettlementData.setReceipts(settlementDetails.receiptsArr, settlementDetails.currencyId) : [],
                "receivables": settlementDetails.amountToBeReceivedArr ? ManagePOSettlementData.setAmount(settlementDetails.amountToBeReceivedArr, settlementDetails.currencyId) : [],
                "payables": settlementDetails.paybackAmountArr ? ManagePOSettlementData.setAmount(settlementDetails.paybackAmountArr, settlementDetails.currencyId) : [],
                "settlementDate": date ? date : "",
                "status": (status || status == 0) ? status : ''
            }
            return settlementFormData;
        }
    }
     /**
    * method to get receipts array 
    return receiptsArr as array of objects  as per form structure
     @param receiptsData as array of Objects
    */
    static getReceipts(receiptsData) {
        var receiptsArr = [];

        for (var i = 0; i < receiptsData.length; i++) {
            receiptsArr.push({
                "budgetLine": receiptsData[i].projectBudgetConfigurationId ? receiptsData[i].projectBudgetConfigurationId : "",
                "amount": (receiptsData[i].amount || receiptsData[i].amount == 0) ? receiptsData[i].amount : "",
                "vat": (receiptsData[i].percentVAT || receiptsData[i].percentVAT == 0) ? receiptsData[i].percentVAT : "",
                "receiptType": receiptsData[i].deductionType,
                "files": (receiptsData[i].files && receiptsData[i].files.length > 0) ? receiptsData[i].files : [],
                "description": receiptsData[i].description ? receiptsData[i].description : "",
                "budgetLineName": receiptsData[i].budgetLine ? receiptsData[i].budgetLine : ""

            });
        }
        return receiptsArr;
    }

    /**
    * method to set receipts array 
    return receiptsArr as array of objects  as per web service data structure
     @param receiptsData as array of Objects
    */
    static setReceipts(receiptsData, currencyId) {
        var receiptsArr = [];

        for (var i = 0; i < receiptsData.length; i++) {
            receiptsArr.push({
                // "projectConfigurationId": receiptsData[i].budgetLine ? receiptsData[i].budgetLine : "",
                "projectBudgetConfigurationId": receiptsData[i].budgetLine ? receiptsData[i].budgetLine : "",
                "budgetLine": receiptsData[i].budgetLineName ? receiptsData[i].budgetLineName : "",
                "amount": (receiptsData[i].amount || receiptsData[i].amount == 0) ? parseFloat(receiptsData[i].amount) : "",
                "percentVAT": (receiptsData[i].vat || receiptsData[i].vat == 0) ? parseFloat(receiptsData[i].vat) : "",
                "currencyId": currencyId ? currencyId : "",
                "deductionType": receiptsData[i].receiptType ? receiptsData[i].receiptType : 0,
                "files": (receiptsData[i].files && receiptsData[i].files.length > 0) ? _.map(receiptsData[i].files, 'id') : [],
                "description": receiptsData[i].description ? receiptsData[i].description : ""
            });
        }
        return receiptsArr;
    }
    /**
    * method to set  amount
    return amountReceivedArr as array of objects  as per web service data structure
     @param amountReceivedData as array of Objects
    */
    static setAmount(amountReceivedData, currencyId) {
        var amountReceivedArr = [];

        for (var i = 0; i < amountReceivedData.length; i++) {
            amountReceivedArr.push({
                "amount": (amountReceivedData[i].amount || amountReceivedData[i].amount == 0) ? parseFloat(amountReceivedData[i].amount) : "",
                "operation": amountReceivedData[i].mode ? amountReceivedData[i].mode : "",
                "currencyId": currencyId ? currencyId : "",
            });
        }
        return amountReceivedArr;
    }
     /**
    * method to get  amount
    return amountReceivedArr as array of objects  as per form structure
     @param amountReceivedData as array of Objects
    */
    static getAmount(amountReceivedData) {
        var amountReceivedArr = [];

        for (var i = 0; i < amountReceivedData.length; i++) {
            amountReceivedArr.push({
                "amount": (amountReceivedData[i].amount || amountReceivedData[i].amount == 0) ? amountReceivedData[i].amount : "",
                "mode": amountReceivedData[i].operation ? amountReceivedData[i].operation : "",
            });
        }
        return amountReceivedArr;
    }

}

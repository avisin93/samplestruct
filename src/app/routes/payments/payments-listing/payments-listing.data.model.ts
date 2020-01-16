import * as _ from 'lodash';
import { Common, DatePickerMethods } from '@app/common';
import { OPERATION_TYPES_ARR, PAYMENT_FOR, PAYEE_ACCOUNT_INFO } from '@app/config';
import { PURCHASE_ORDER_TYPES_CONST } from '../constants';

export class PaymentsListData {
    /**
    return Role details data as per formcontrol
    @param userDetails as Object
    **/
    OPERATION_TYPES_ARR = OPERATION_TYPES_ARR;
    PAYMENT_FOR = PAYMENT_FOR;


    // modal to format and set data to be sent to schedule payment service
    static setSchedulePaymentDetails(schedulePaymentIncommingData) {

        let scheduleData: any;
        if (schedulePaymentIncommingData) {
            const data = schedulePaymentIncommingData;
            scheduleData = {
                'paymentAmount': data.paymentAmount ? parseFloat(data.paymentAmount) : 0,
                'scheduleDate': data.scheduleDate ? PaymentsListData.setDates(data.scheduleDate) : '',
            };
            return scheduleData;
        }
    }

    // modal to format and set data to be sent to confirm payment service
    static setPayConfirmationDetails(payConfirmationIncommingData, documents) {

        let payConfirmationData: any;
        if (payConfirmationIncommingData) {
            const data = payConfirmationIncommingData;
            payConfirmationData = {

                'attachments': documents ? documents : [],
                'operationId': data.modeOfPayment ? data.modeOfPayment : '',
                'i18n': {
                    'langCode': data.langCode ? data.langCode : '',
                    'notes': data.notes ? data.notes : ''
                },
            };
            if (data.modeOfPayment === OPERATION_TYPES_ARR[2].id) {
                payConfirmationData['assetNumber'] = data.chequeNumber ? data.chequeNumber : '';
                payConfirmationData['assetBankName'] = data.chequeBankName ? data.chequeBankName : '';
                payConfirmationData['assetDate'] = data.chequeDate ? PaymentsListData.setDates(data.chequeDate) : '';
            } else if (data.modeOfPayment === OPERATION_TYPES_ARR[3].id) {
                payConfirmationData['assetNumber'] = data.wireTransactionNumber ? data.wireTransactionNumber : '';
                payConfirmationData['assetBankName'] = data.wireTransactionBankName ? data.wireTransactionBankName : '';
                payConfirmationData['assetDate'] = data.wireTransactionDate ? PaymentsListData.setDates(data.wireTransactionDate) : '';
            } else {
                payConfirmationData['assetNumber'] = '';
                payConfirmationData['assetBankName'] = '';
                payConfirmationData['assetDate'] = '';
            }
        }
        return payConfirmationData;
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

    // modal to format and convert incomming payment list data
    static getPaymentsListDetails(paymentsListIncommingData) {

        const paymentsListData: any = [];
        if (paymentsListIncommingData) {
            for (let i = 0; i < paymentsListIncommingData.length; i++) {
                const data = paymentsListIncommingData[i];
                const paymentsData = {
                    'projectTypeId': data.projectTypeId ? data.projectTypeId : '',
                    'invoiceNo': data.invoiceNumber ? data.invoiceNumber : '',
                    'invoiceId': data.invoiceId ? data.invoiceId : '',
                    'invoiceFileUrl': (data.invoiceFiles && data.invoiceFiles[0] && data.invoiceFiles[0].url) ? (data.invoiceFiles[0].url) : '',
                    'purchaseOrderId': data.purchaseOrderId ? data.purchaseOrderId : '',
                    'supplierName': (data.i18n && data.i18n.name) ? data.i18n.name : '',
                    'invoiceDate': data.invoiceDate ? PaymentsListData.getDisplayDate(data.invoiceDate) : '',
                    'invoiceAmount': data.invoiceAmount ? data.invoiceAmount : '',
                    'paymentAmount': data.paymentAmount ? data.paymentAmount : '',
                    'scheduleDate': data.scheduleDate ? PaymentsListData.getDisplayDate(data.scheduleDate) : '',
                    'paymentId': data.id ? data.id : '',
                    'paymentNumberId': data.paymentId ? data.paymentId : '',
                    'paymentCurrencyCode': data.currencyCode ? data.currencyCode : '',
                    'budgetType': data.budgetType ? data.budgetType : '',
                    'projectName': data.projectName ? data.projectName : '',
                    'canCancel': data.canCancel ? data.canCancel : false,
                    'canEdit': data.canEdit ? data.canEdit : false,
                    'createdBy': (data.createdBy && data.createdBy.displayName) ? data.createdBy.displayName : '',
                    'consecutiveNumber': data.consecutiveNumber ? data.consecutiveNumber : '-',
                    'purchaseOrderNumber': data.purchaseOrderNumber ? data.purchaseOrderNumber : '-',
                    'paymentFor': (data.paymentFor || data.paymentFor === 0) ? data.paymentFor : '-',
                    'palAccepted': data.acceptTerms ? data.acceptTerms : false,
                    'contractAccepted': data.contractAcceptance ? data.contractAcceptance : false
                };
                if (data.supplierType || (data.supplierType === PURCHASE_ORDER_TYPES_CONST.freelancer)) {
                    if (data.supplierType === PURCHASE_ORDER_TYPES_CONST.vendor) {
                        paymentsData['supplierType'] = PAYEE_ACCOUNT_INFO.vendor;
                    } else if (data.supplierType === PURCHASE_ORDER_TYPES_CONST.freelancer) {
                        paymentsData['supplierType'] = PAYEE_ACCOUNT_INFO.freelancer;
                    } else if (data.supplierType === PURCHASE_ORDER_TYPES_CONST.location) {
                        paymentsData['supplierType'] = PAYEE_ACCOUNT_INFO.location;
                    } else if (data.supplierType === PURCHASE_ORDER_TYPES_CONST.advance) {
                        paymentsData['supplierType'] = PURCHASE_ORDER_TYPES_CONST.advance;
                    } else if (data.supplierType === PURCHASE_ORDER_TYPES_CONST.adjustment) {
                        paymentsData['supplierType'] = PURCHASE_ORDER_TYPES_CONST.adjustment;
                    } else if (data.supplierType === PAYEE_ACCOUNT_INFO.individual) {
                        paymentsData['supplierType'] = PAYEE_ACCOUNT_INFO.individual;
                    } else if (data.supplierType === PAYEE_ACCOUNT_INFO.agency) {
                        paymentsData['supplierType'] = PAYEE_ACCOUNT_INFO.agency;
                    }
                }
                if (data.thirdPartyVendor) {
                    paymentsData['thirdPartyVendor'] = data.thirdPartyVendor.name ? data.thirdPartyVendor.name : '';
                }
                if (data.currencyConversionRates && data.currencyCode !== 'MXN') {
                    for (let j = 0; j < data.currencyConversionRates.length; j++) {
                        if (data.currencyConversionRates[j].targetCurrencyCode === 'MXN') {
                            // tslint:disable-next-line:max-line-length
                            paymentsData['conversionRate'] = (data.currencyConversionRates[j].targetUnit) ? data.currencyConversionRates[j].targetUnit : 0;
                        }
                    }
                }
                paymentsListData.push(paymentsData);
            }
        }
        return paymentsListData;
    }

    // modal to format and convert incomming payment details data
    static getPaymentDetail(paymentIncommingData) {

        let paymentData: any;
        if (paymentIncommingData) {
            const data = paymentIncommingData;
            paymentData = {

                'invoiceNo': (data.invoiceDetails && data.invoiceDetails.invoiceNumber) ? data.invoiceDetails.invoiceNumber : '',
                'invoiceId': (data.invoiceDetails && data.invoiceDetails.id) ? data.invoiceDetails.id : '',
                'supplierName': (data.i18n && data.i18n.supplierName) ? data.i18n.supplierName : '',
                'invoiceDate': (data.invoiceDetails && data.invoiceDetails.invoiceDate) ? PaymentsListData.getDisplayDate(data.invoiceDetails.invoiceDate) : '',
                'invoiceAmount': (data.invoiceDetails && data.invoiceDetails.invoiceAmount) ? data.invoiceDetails.invoiceAmount : '',
                'scheduleDate': data.scheduleDate ? PaymentsListData.getDates(data.scheduleDate) : '',

                'accountNumber': data.accountNumber ? data.accountNumber : '',
                'bankName': data.bankName ? data.bankName : '',
                'branchName': data.branch ? data.branch : '',
                'CLABE': data.clabe ? data.clabe : '',
                'RFCcode': data.rfcCode ? data.rfcCode : '',
                'address': data.address ? data.address : '',
                'notes': (data.i18n && data.i18n.notes) ? data.i18n.notes : '',
                'paymentId': data.id ? data.id : '',
                'paymentAmount': data.paymentAmount ? data.paymentAmount : '',
                'operationId': (data.operation && data.operation.id) ? data.operation.id : '',
                'attachments': data.attachments ? PaymentsListData.getAttachmentsData(data.attachments) : [],
                'thirdPartyVendor': (data.thirdPartyVendor && data.thirdPartyVendor.supplierName) ? data.thirdPartyVendor.supplierName : '',
                'sortCode': data.sortCode ? data.sortCode : '',
                'swiftCode': data.swiftCode ? data.swiftCode : '',
                'abaCode': data.abaCode ? data.abaCode : '',
                'paymentFor': (data.paymentFor || data.paymentFor === 0) ? data.paymentFor : '',
                'accountName': data.accountName ? data.accountName : '',
                'isBeneficiary': data.isBeneficiary ? data.isBeneficiary : false,
                'installmentType': (data.installmentType || data.installmentType === 0) ? data.installmentType : '-',
                'consecutiveNumber': data.consecutiveNumber ? data.consecutiveNumber : '-',
                'purchaseOrderNumber': data.purchaseOrderNumber ? data.purchaseOrderNumber : '-',
                'purchaseOrderType': data.purchaseOrderType ? data.purchaseOrderType : '-'
            };
            if (data.operation && data.operation.id) {
                if (data.operation.id === OPERATION_TYPES_ARR[2].id && data.paymentDetails) {
                    paymentData['chequeNumber'] = data.paymentDetails.assetNumber ? data.paymentDetails.assetNumber : '';
                    paymentData['chequeBankName'] = data.paymentDetails.assetBankName ? data.paymentDetails.assetBankName : '';
                    // tslint:disable-next-line:max-line-length
                    paymentData['chequeDate'] = data.paymentDetails.assetDate ? PaymentsListData.getDates(data.paymentDetails.assetDate) : '';

                } else if (data.operation.id === OPERATION_TYPES_ARR[3].id && data.paymentDetails) {
                    paymentData['wireTransactionNumber'] = data.paymentDetails.assetNumber ? data.paymentDetails.assetNumber : '';
                    paymentData['wireTransactionBankName'] = data.paymentDetails.assetBankName ? data.paymentDetails.assetBankName : '';
                    // tslint:disable-next-line:max-line-length
                    paymentData['wireTransactionDate'] = data.paymentDetails.assetDate ? PaymentsListData.getDates(data.paymentDetails.assetDate) : '';
                }
            }
        }
        return paymentData;
    }

    // modal to format and convert tax details.
    static getinvoiceTaxDetail(paymentIncommingData) {

        let paymentData: any;
        if (paymentIncommingData) {
            const data = paymentIncommingData;
            paymentData = {

                'vat': data.paymentPercentVAT ? parseFloat(data.paymentPercentVAT) : 0,
                'isrWithHolding': data.paymentPercentISRWithholding ? parseFloat(data.paymentPercentISRWithholding) : 0,
                'vatWithHolding': data.paymentPercentVATWithholding ? parseFloat(data.paymentPercentVATWithholding) : 0,
                'invoiceAmount': (data.invoiceDetails && data.invoiceDetails.invoiceAmount) ? data.invoiceDetails.invoiceAmount : '-',
                'percentAgencyFee': data.percentAgencyFee ? parseFloat(data.percentAgencyFee) : 0,
                'percentMarkup': data.percentMarkup ? parseFloat(data.percentMarkup) : 0,
                'iva': data.percentIVA ? parseFloat(data.percentIVA) : 0,
                'currencyCode': (data.currency && data.currency.currencyCode) ? data.currency.currencyCode : ''
            };

        }
        return paymentData;
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

    // modal to convert date in required format to be displayed
    static getDisplayDate(dateReceived) {
        const date = DatePickerMethods.getDateWithTimezoneAdding(dateReceived);
        return date;
    }

    // model to conver attachment details in required format
    static getAttachmentsData(documents) {
        // tslint:disable-next-line:prefer-const
        let attachmentDocs;
        const othersObjArr = _.filter(documents, { 'documentType': 'Others' });
        if (othersObjArr && othersObjArr.length > 0) {
            othersObjArr.forEach((obj, index) => {
                if (obj.files && obj.files.length > 0) {
                    attachmentDocs.push(obj.files[0].id);
                }
            });
        }
        return attachmentDocs;
    }


}

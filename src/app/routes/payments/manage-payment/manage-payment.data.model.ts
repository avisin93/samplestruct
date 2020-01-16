import { Common } from '@app/common';
import { PURCHASE_ORDER_TYPE, PAYEE_ACCOUNT_INFO } from '@app/config';

export class ManagePaymentData {
    /**
    return Role details data as per formcontrol
    @param paymentDetails as Object
    **/

    /**
  Get invoice data from web service
  **/
    static getFormDetails(paymentDetails: any) {
        let paymentDate;
        let paymentFormData;
        const i18nValues = paymentDetails.i18n;
        if (paymentDetails.scheduleDate) {
            const tempPaymentDate = Common.removeOffsetFromUTC(paymentDetails.paymentDate);
            paymentDate = Common.getDateObjData(tempPaymentDate);
        }
        paymentFormData = {
            'paymentId': paymentDetails.id ? paymentDetails.id : '',
            'payeeAccountInfoFor': paymentDetails.payeeAccountInfoFor || paymentDetails.payeeAccountInfoFor == 0 ? paymentDetails.payeeAccountInfoFor : '',
            'paymentType': paymentDetails.paymentType || paymentDetails.paymentType == 0 ? paymentDetails.paymentType : '',
            'purchaseOrder': paymentDetails.purchaseOrder ? paymentDetails.purchaseOrder : '',
            'invoiceFile': paymentDetails.invoiceFile ? paymentDetails.invoiceFile : '',
            'invoiceNumber': paymentDetails.invoiceNumber ? paymentDetails.invoiceNumber : '',
            'invoiceAmount': paymentDetails.invoiceAmount ? paymentDetails.invoiceAmount : '',
            'installmentType': paymentDetails.installmentType || paymentDetails.installmentType == 0 ? paymentDetails.installmentType : 0,
            'currencyCode': paymentDetails.currency.currencyCode ? paymentDetails.currency.currencyCode : '',
            'accountNumber': paymentDetails.accountNumber ? paymentDetails.accountNumber : '',
            'accountName': paymentDetails.accountName ? paymentDetails.accountName : '',
            'bankName': paymentDetails.bankName ? paymentDetails.bankName : '',
            'clabe': paymentDetails.clabe ? paymentDetails.clabe : '',
            'rfcCode': paymentDetails.rfcCode ? paymentDetails.rfcCode : ((paymentDetails.taxId) ? paymentDetails.taxId : ''),
            'sortCode': paymentDetails.sortCode ? paymentDetails.sortCode : '',
            'abaCode': paymentDetails.abaCode ? paymentDetails.abaCode : '',
            'swiftCode': paymentDetails.swiftCode ? paymentDetails.swiftCode : '',
            'modeofOperation': paymentDetails.operation ? paymentDetails.operation.id : '',
            'branch': paymentDetails.branch ? paymentDetails.branch : '',
            'address': paymentDetails.address ? paymentDetails.address : '',
            'paymentDate': paymentDetails.paymentDate ? paymentDetails.paymentDate : '',
            'paymentAmount': paymentDetails.paymentAmount ? parseFloat(paymentDetails.paymentAmount) : 0,
            'invoiceSubTotal': paymentDetails.invoiceSubTotal ? parseFloat(paymentDetails.invoiceSubTotal) : 0,
            'supplierName': i18nValues.name ? i18nValues.name : '',
            'thirdPartyVendor': paymentDetails.thirdPartyVendor ? paymentDetails.thirdPartyVendor.name : '',
            'notes': i18nValues.notes ? i18nValues.notes : '',
            'isScouterBeneficiary': paymentDetails.isScouterBeneficiary ? paymentDetails.isScouterBeneficiary : '',
            'invoiceFor': paymentDetails.invoiceFor ? paymentDetails.invoiceFor : ''

        };

        if (paymentDetails.invoiceFor !== PURCHASE_ORDER_TYPE.talent) {

            paymentFormData['vat'] = paymentDetails.percentVAT ? parseFloat(paymentDetails.percentVAT) : 0;
            paymentFormData['vatWithHolding'] = paymentDetails.percentVATWithholding ? parseFloat(paymentDetails.percentVATWithholding) : 0;
            paymentFormData['isrWithHolding'] = paymentDetails.percentISRWithholding ? paymentDetails.percentISRWithholding : 0;
        } else {
            paymentFormData['percentAgencyFee'] = (paymentDetails.percentAgencyFee || paymentDetails.percentAgencyFee == 0) ? parseFloat(paymentDetails.percentAgencyFee) : 0;
            paymentFormData['percentMarkup'] = (paymentDetails.percentMarkup || paymentDetails.percentMarkup == 0) ? parseFloat(paymentDetails.percentMarkup) : 0;
            paymentFormData['iva'] = (paymentDetails.percentIVA || paymentDetails.percentIVA == 0) ? paymentDetails.percentIVA : 0;
        }
        return paymentFormData;
    }
    /**
 Get invoice data from web service
 **/

    /**
 Post invoice data to web service
 **/
    static setFormDetails(paymentDetails: any, paymentInvoiceData) {
        let payeeData;
        let paymentFormData;
        // paymentInvoiceData.payeeAccountInfoFor= 5;
        switch (paymentInvoiceData.payeeAccountInfoFor) {
            case PAYEE_ACCOUNT_INFO.freelancer:
                payeeData = paymentDetails.freelancerPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.vendor:
                payeeData = paymentDetails.vendorPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.location:
                payeeData = paymentDetails.locationPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.individual:
                payeeData = paymentDetails.talentPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.agency:
                payeeData = paymentDetails.talentPayeeInfo;
                break;

        }


        let paymentDate;
        if (paymentDetails.schedulePaymentDate) {
            const payment = Common.setOffsetToUTC(paymentDetails.schedulePaymentDate, '');
            paymentDate = payment['fromDate'];
        }
        paymentFormData = {
            'invoiceId': paymentDetails.invoiceId ? paymentDetails.invoiceId : '',
            'accountNumber': payeeData.accountNumber ? payeeData.accountNumber : '',
            'accountName': payeeData.accountName ? payeeData.accountName : '',
            'bankName': payeeData.bankName ? payeeData.bankName : '',
            'clabe': payeeData.clabe ? payeeData.clabe : '',
            'rfcCode': payeeData.rfcCode ? payeeData.rfcCode : '',
            'sortCode': payeeData.sortCode ? payeeData.sortCode : '',
            'abaCode': payeeData.abaCode ? payeeData.abaCode : '',
            'swiftCode': payeeData.swiftCode ? payeeData.swiftCode : '',
            'operationId': payeeData.mode || paymentDetails.modeOfPayment ? payeeData.mode || paymentDetails.modeOfPayment : '',
            'branch': payeeData.branch ? payeeData.branch : '',
            'address': payeeData.address ? payeeData.address : '',
            'scheduleDate': paymentDate ? paymentDate : '',
            'installmentType': paymentDetails.installmentType || paymentDetails.installmentType == 0 ? paymentDetails.installmentType : 0,
            'paymentAmount': paymentDetails.paymentAmount ? parseFloat(paymentDetails.paymentAmount) : 0,
            'i18n': {
                'notes': paymentDetails.notes ? paymentDetails.notes : '',
                'langCode': paymentDetails.langCode ? paymentDetails.langCode : '',
            },
            'isScouterBeneficiary': paymentInvoiceData.isScouterBeneficiary ? paymentInvoiceData.isScouterBeneficiary : '',
            'payeeAccountInfoFor': paymentInvoiceData.payeeAccountInfoFor || paymentInvoiceData.payeeAccountInfoFor == 0 ? paymentInvoiceData.payeeAccountInfoFor : '',
            'paymentType': paymentInvoiceData.paymentType || paymentInvoiceData.paymentType == 0 ? paymentInvoiceData.paymentType : '',
        };
        if (paymentInvoiceData.invoiceFor !== PURCHASE_ORDER_TYPE.talent) {

            paymentFormData['percentVAT'] = paymentInvoiceData.vat ? parseFloat(paymentInvoiceData.vat) : 0;
            paymentFormData['percentVATWithholding'] = paymentInvoiceData.vatWithHolding ? parseFloat(paymentInvoiceData.vatWithHolding) : 0;
            paymentFormData['percentISRWithholding'] = paymentInvoiceData.isrWithHolding ? paymentInvoiceData.isrWithHolding : 0;
        } else {
            paymentFormData['percentAgencyFee'] = (paymentInvoiceData.percentAgencyFee || paymentInvoiceData.percentAgencyFee == 0) ? parseFloat(paymentInvoiceData.percentAgencyFee) : 0;
            paymentFormData['percentMarkup'] = (paymentInvoiceData.percentMarkup || paymentInvoiceData.percentMarkup == 0) ? parseFloat(paymentInvoiceData.percentMarkup) : 0;
            paymentFormData['percentIVA'] = (paymentInvoiceData.iva || paymentInvoiceData.iva == 0) ? paymentInvoiceData.iva : 0;
        }
        return paymentFormData;
    }
    /**
Post invoice data to web service
**/
}



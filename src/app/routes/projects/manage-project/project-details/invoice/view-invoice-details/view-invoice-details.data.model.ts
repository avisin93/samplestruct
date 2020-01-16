import { Common } from '../../../../../../common';
import { PURCHASE_ORDER_TYPE, PAYEE_ACCOUNT_INFO } from '../../../../../../config';

export class ManageInvoiceData {
    /**
    return Role details data as per formcontrol
    @param invoiceDetails as Object
    **/
    static setFormData(invoiceDetails: any, documents, poData) {
        let payeeData;
        switch (poData.payeeAccountInfoFor) {
            case PAYEE_ACCOUNT_INFO.freelancer:
                payeeData = invoiceDetails.freelancerPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.vendor:
                payeeData = invoiceDetails.vendorPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.location:
                payeeData = invoiceDetails.locationPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.individual:
                payeeData = invoiceDetails.talentPayeeInfo;
                break;
            case PAYEE_ACCOUNT_INFO.agency:
                payeeData = invoiceDetails.talentPayeeInfo;
                break;
        }

        let invoiceFormData;

        if (invoiceDetails) {

            let invoiceDate;
            if (invoiceDetails.invoiceDate) {
                const invDate = Common.setOffsetToUTC(invoiceDetails.invoiceDate, '');
                invoiceDate = invDate['fromDate'];
            }
            let paymentDate;
            if (invoiceDetails.invoiceDate) {
                const payment = Common.setOffsetToUTC(invoiceDetails.paymentDate, '');
                paymentDate = payment['fromDate'];
            }
            invoiceFormData = {
                'purchaseOrderId': invoiceDetails.purchaseOrderId ? invoiceDetails.purchaseOrderId : '',
                'accountNumber': payeeData.accNo ? payeeData.accNo : '',
                'accountName': payeeData.accountName ? payeeData.accountName : '',
                'bankName': payeeData.bankName ? payeeData.bankName : '',
                'clabe': payeeData.clabe ? payeeData.clabe : '',
                'rfcCode': payeeData.taxId ? payeeData.taxId : '',
                'sortCode': payeeData.sortCode ? payeeData.sortCode : '',
                'abaCode': payeeData.abaCode ? payeeData.abaCode : '',
                'swiftCode': payeeData.swiftCode ? payeeData.swiftCode : '',
                'operationId': payeeData.mode ? payeeData.mode : '',
                'branch': payeeData.branch ? payeeData.branch : '',
                'address': payeeData.address ? payeeData.address : '',
                'invoiceNumber': invoiceDetails.invoiceNo ? invoiceDetails.invoiceNo : '',
                // "invoiceType": invoiceDetails.invoiceType ? invoiceDetails.invoiceType : "",
                'purchaseOrderCurrency': invoiceDetails.purchaseOrderCurrency ? invoiceDetails.purchaseOrderCurrency : '',
                'invoiceDate': invoiceDate ? invoiceDate : '',
                'paymentDate': paymentDate ? paymentDate : '',
                'invoiceAmount': invoiceDetails.invoiceAmount ? parseFloat(invoiceDetails.invoiceAmount) : 0,
                'invoicePercentage': invoiceDetails.invoicePercentage ? parseFloat(invoiceDetails.invoicePercentage) : 0,
                'percentVAT': invoiceDetails.invoiceVat ? parseFloat(invoiceDetails.invoiceVat) : 0,
                'percentISRWithholding': invoiceDetails.invoiceISRWitholding ? parseFloat(invoiceDetails.invoiceISRWitholding) : '',
                'percentVATWithholding': invoiceDetails.invoiceVATWitholding ? parseFloat(invoiceDetails.invoiceVATWitholding) : 0,

                'i18n': {
                    'notes': invoiceDetails.notes ? invoiceDetails.notes : '',
                    'langCode': invoiceDetails.langCode ? invoiceDetails.langCode : '',
                },
                'attachments': documents ? documents.invoiceAttachmentsDocs : []
            };
            if (poData.purchaseOrderFor !== PURCHASE_ORDER_TYPE.talent) {
                invoiceFormData['percentVAT'] = invoiceDetails.invoiceVat ? parseFloat(invoiceDetails.invoiceVat) : 0;
                invoiceFormData['percentISRWithholding'] = invoiceDetails.invoiceISRWitholding ? parseFloat(invoiceDetails.invoiceISRWitholding) : 0;
                invoiceFormData['percentVATWithholding'] = invoiceDetails.invoiceVATWitholding ? parseFloat(invoiceDetails.invoiceVATWitholding) : 0;
              } else {
                invoiceFormData['percentAgencyFee'] = invoiceDetails.percentAgencyFee ? parseFloat(invoiceDetails.percentAgencyFee) : 0;
                invoiceFormData['percentMarkup'] = invoiceDetails.percentMarkup ? parseFloat(invoiceDetails.percentMarkup) : 0;
                invoiceFormData['percentIVA'] = invoiceDetails.iva ? parseFloat(invoiceDetails.iva) : 0;
              }
        }
        return invoiceFormData;
    }
    static getFormData(invoiceDetails: any, purchaseOrderFor) {
        let invoiceFormData;

        if (invoiceDetails) {

            let invoiceDate;
            if (invoiceDetails.invoiceDate) {
                const tempInvoiceDate = Common.removeOffsetFromUTC(invoiceDetails.invoiceDate);
                invoiceDate = Common.getDateObjData(tempInvoiceDate);
            }
            let paymentDate;
            if (invoiceDetails.paymentDate) {
                const tempPaymentDate = Common.removeOffsetFromUTC(invoiceDetails.paymentDate);
                paymentDate = Common.getDateObjData(tempPaymentDate);
            }
            invoiceFormData = {
                'purchaseOrderId': invoiceDetails.purchaseOrderId ? invoiceDetails.purchaseOrderId : '',
                'accountNumber': invoiceDetails.accountNumber ? invoiceDetails.accountNumber : '',
                'accountName': invoiceDetails.accountName ? invoiceDetails.accountName : '',
                'bankName': invoiceDetails.bankName ? invoiceDetails.bankName : '',
                'clabe': invoiceDetails.clabe ? invoiceDetails.clabe : '',
                'rfcCode': invoiceDetails.taxId ? invoiceDetails.taxId : '',
                'sortCode': invoiceDetails.sortCode ? invoiceDetails.sortCode : '',
                'abaCode': invoiceDetails.abaCode ? invoiceDetails.abaCode : '',
                'swiftCode': invoiceDetails.swiftCode ? invoiceDetails.swiftCode : '',
                'modeofOperation': invoiceDetails.operation ? invoiceDetails.operation.id : '',
                'branch': invoiceDetails.branch ? invoiceDetails.branch : '',
                'address': invoiceDetails.address ? invoiceDetails.address : '',
                'invoiceNumber': invoiceDetails.invoiceNumber ? invoiceDetails.invoiceNumber : '',
                // "invoiceType": invoiceDetails.invoiceType ? invoiceDetails.invoiceType : "",
                'invoiceDate': invoiceDate ? invoiceDate : '',
                'paymentDate': paymentDate ? paymentDate : '',
                'invoiceAmount': invoiceDetails.invoiceAmount ? parseFloat(invoiceDetails.invoiceAmount) : 0,
                'invoicePercentage': invoiceDetails.invoicePercentage ? parseFloat(invoiceDetails.invoicePercentage) : 0,
                'percentVAT': invoiceDetails.percentVAT ? parseFloat(invoiceDetails.percentVAT) : 0,
                'invoiceSubTotal': invoiceDetails.invoiceSubTotal ? parseFloat(invoiceDetails.invoiceSubTotal) : 0,
                'percentISRWithholding': invoiceDetails.percentISRWithholding ? invoiceDetails.percentISRWithholding : 0,
                'percentVATWithholding': invoiceDetails.percentVATWithholding ? parseFloat(invoiceDetails.percentVATWithholding) : 0,

                'i18n': {
                    'notes': invoiceDetails.i18n.notes ? invoiceDetails.i18n.notes : '',
                    'langCode': invoiceDetails.i18n.langCode ? invoiceDetails.i18n.langCode : '',
                },
                'attachments': invoiceDetails.attachments ? invoiceDetails.attachments : []
            };
            if (purchaseOrderFor !== PURCHASE_ORDER_TYPE.talent) {
                invoiceFormData['invoiceVat'] = invoiceDetails.percentVAT ? parseFloat(invoiceDetails.percentVAT) : 0;
                invoiceFormData['invoiceISRWitholding'] = invoiceDetails.percentISRWithholding ? parseFloat(invoiceDetails.percentISRWithholding) : 0;
                invoiceFormData['invoiceVATWitholding'] = invoiceDetails.percentVATWithholding ? parseFloat(invoiceDetails.percentVATWithholding) : 0;
              } else {
                invoiceFormData['percentAgencyFee'] = (invoiceDetails.percentAgencyFee || invoiceDetails.percentAgencyFee == 0) ? parseFloat(invoiceDetails.percentAgencyFee) : 0;
                invoiceFormData['percentMarkup'] = (invoiceDetails.percentMarkup || invoiceDetails.percentMarkup == 0) ? parseFloat(invoiceDetails.percentMarkup) : 0;
                invoiceFormData['iva'] = (invoiceDetails.percentIVA || invoiceDetails.percentIVA == 0) ? parseFloat(invoiceDetails.percentIVA) : 0;
              }
        }
        return invoiceFormData;
    }

}

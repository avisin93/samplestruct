// import { ROUTER_LINKS, PROJECT_TYPES } from '../../../../../config';
import { Common } from '../../../../../../common';

export class AddPOFreelancerData {
    /**
    return Role details data as per formcontrol
    @param projectDetails as Object
    **/
    static getWebServiceDetails(poDetails: any) {
        let poFormData;
        if (poDetails) {

        }
        if (poDetails) {
            let paymentDate;
            if (poDetails.paymentDate) {
                const payment = Common.setOffsetToUTC(poDetails.paymentDate, '');
                paymentDate = payment['fromDate'];
            }

            poFormData = {
                'budgetLine': {
                    'projectBudgetConfigurationId': poDetails.budgetLine ? poDetails.budgetLine : '',
                    'itemDescription': poDetails.serviceDescription ? poDetails.serviceDescription : ''
                },
                'currencyId': poDetails.currencyId ? poDetails.currencyId : '',
                'freelancerId': poDetails.freelancerId ? poDetails.freelancerId : '',
                'i18n': {
                    'langCode': poDetails.langCode ? poDetails.langCode : '',
                    'notes': poDetails.notes ? poDetails.notes : ''
                },
                'operationId': poDetails.modeOfOperation ? poDetails.modeOfOperation : '',
                'percentISRWithholding': poDetails.isrWithholding ? parseFloat(poDetails.isrWithholding) : '',
                'percentVAT': poDetails.vat ? parseFloat(poDetails.vat) : '',
                'percentVATWithholding': poDetails.vatWithholding ? parseFloat(poDetails.vatWithholding) : '',
                'requesteByUserId': poDetails.requestedBy ? poDetails.requestedBy : '',
                'totalAmountRequested': poDetails.totalAmountRequested ? parseFloat(poDetails.totalAmountRequested) : 0,
                'paymentDate': paymentDate ? paymentDate : '',
                'cfdiType': (poDetails.typeSelection || poDetails.typeSelection === 0) ? poDetails.typeSelection : 0,
            };

        }
        return poFormData;
    }
    static setWebServiceDetails(poDetails: any) {
        let poFormData;
        let paymentDate;
        if (poDetails) {
            if (poDetails.paymentDate) {
                const payment = Common.removeOffsetFromUTC(poDetails.paymentDate);
                paymentDate = Common.getDateObjData(payment);
            }
            poFormData = {
                'budgetLine': poDetails.budgetLine.projectBudgetConfigurationId ? poDetails.budgetLine.projectBudgetConfigurationId : '',
                'currencyId': poDetails.currencyId ? poDetails.currencyId : '',
                'freelancerId': poDetails.freelancerId ? poDetails.freelancerId : '',
                'i18n': {
                    'langCode': poDetails.i18n.langCode ? poDetails.i18n.langCode : '',
                    'notes': poDetails.i18n.notes ? poDetails.i18n.notes : '',
                    'serviceDescription': poDetails.budgetLine.itemDescription ? poDetails.budgetLine.itemDescription : ''
                },
                'modeOfOperation': poDetails.operationId ? poDetails.operationId : '',
                // tslint:disable-next-line:max-line-length
                'isrWithholding': (poDetails.percentISRWithholding || poDetails.percentISRWithholding === 0) ? parseFloat(poDetails.percentISRWithholding) : '',
                'vat': (poDetails.percentVAT || poDetails.percentVAT === 0) ? parseFloat(poDetails.percentVAT) : '',
                // tslint:disable-next-line:max-line-length
                'vatWithholding': (poDetails.percentVATWithholding || poDetails.percentVATWithholding === 0) ? parseFloat(poDetails.percentVATWithholding) : '',
                'requestedBy': poDetails.requestedById ? poDetails.requestedById : '',
                // tslint:disable-next-line:max-line-length
                'totalAmountRequested': (poDetails.totalAmountRequested || poDetails.totalAmountRequested === 0) ? parseFloat(poDetails.totalAmountRequested) : '',
                'paymentDate': paymentDate ? paymentDate : '',
                'typeSelection': (poDetails.cfdiType || poDetails.cfdiType === 0) ? poDetails.cfdiType : 0,
            };

        }
        return poFormData;
    }

}

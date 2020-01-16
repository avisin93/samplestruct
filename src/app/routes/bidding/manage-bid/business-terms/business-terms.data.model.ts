import { MARKUP_INSURANCE, DEFAULT_CURRENCY } from '../../Constants';

export class ManageBusinessTermData {
    static getFormDetails(businessTermDetails: any = {}) {
        let businessTermData;
        if (businessTermDetails) {
            businessTermData = {
                'commission': (businessTermDetails.commission || businessTermDetails.commission === 0) ? businessTermDetails.commission : '',
                'financialCost': (businessTermDetails.financialCost || businessTermDetails.financialCost === 0) ? businessTermDetails.financialCost : '',
                'erAdjustment': (businessTermDetails.erAdjustment || businessTermDetails.erAdjustment === 0) ? businessTermDetails.erAdjustment : '',
                'baseRateAdjustment': (businessTermDetails.baseRateAdjustment || businessTermDetails.baseRateAdjustment === 0) ? businessTermDetails.baseRateAdjustment : '',
                'targetAgencyFees': (businessTermDetails.talentAgencyFees || businessTermDetails.talentAgencyFees === 0) ? businessTermDetails.talentAgencyFees : '',
                'targetPayrollFees': (businessTermDetails.talentPayrollService || businessTermDetails.talentPayrollService === 0) ? businessTermDetails.talentPayrollService : '',
                'targetLabourFees': (businessTermDetails.talentLabourMarkup || businessTermDetails.talentLabourMarkup === 0) ? businessTermDetails.talentLabourMarkup : '',
                'currency': businessTermDetails.defaultCurrency ? businessTermDetails.defaultCurrency : '',
                // tslint:disable-next-line:max-line-length
                'budgetLineMarkup': (businessTermDetails.markups && businessTermDetails.markups.length > 0) ? ManageBusinessTermData.getMarkupData(businessTermDetails.markups) : ManageBusinessTermData.getMarkupData(MARKUP_INSURANCE),
                // tslint:disable-next-line:max-line-length
                'exchangeRate': businessTermDetails.exchangeRates ? ManageBusinessTermData.getexchangeRateData(businessTermDetails.exchangeRates) : []
            };
        }
        return businessTermData;
    }
    static getMarkupData(data) {
        const markupArr = [];
        if (!(data && (data.length > 0))) {
            data = MARKUP_INSURANCE;
        }
        for (let index = 0; index < data.length; index++) {
            const tembusinessTermDetails = data[index];
            markupArr.push({
                'sectionName': tembusinessTermDetails.sectionName ? tembusinessTermDetails.sectionName : '',
                'markup': (tembusinessTermDetails.markup || tembusinessTermDetails.markup === 0) ? tembusinessTermDetails.markup : '',
                'insurance': (tembusinessTermDetails.insurance || tembusinessTermDetails.insurance === 0) ? tembusinessTermDetails.insurance : ''
            });
        }
        return markupArr;
    }
    static getexchangeRateData(data) {
        const exchangeRateArr = [];
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const tembusinessTermDetails = data[index];
                exchangeRateArr.push({
                    'sourceCurrencyId': tembusinessTermDetails.sourceCurrencyId ? tembusinessTermDetails.sourceCurrencyId : '',
                    'targetCurrency': tembusinessTermDetails.targetCurrencyId ? tembusinessTermDetails.targetCurrencyId : DEFAULT_CURRENCY.id,
                    'unit': tembusinessTermDetails.unit ? tembusinessTermDetails.unit : 1,
                    'exchangeRate': (tembusinessTermDetails.exhangeRate || tembusinessTermDetails.exhangeRate === 0) ? tembusinessTermDetails.exhangeRate : ''

                });
            }
        }
        else {
            exchangeRateArr.push({
                'sourceCurrencyId': '',
                'targetCurrency': DEFAULT_CURRENCY.id,
                'unit': 1,
                'exchangeRate': ''
            });
        }
        return exchangeRateArr;
    }
    static getWebServiceDetails(businessTermDetails: any) {
        let businessTermData;
        if (businessTermDetails) {
            businessTermData = {
                'commission': (businessTermDetails.commission || businessTermDetails.commission === 0) ? businessTermDetails.commission : '',
                'financialCost': (businessTermDetails.financialCost || businessTermDetails.financialCost === 0) ? businessTermDetails.financialCost : '',
                'erAdjustment': (businessTermDetails.erAdjustment || businessTermDetails.erAdjustment === 0) ? businessTermDetails.erAdjustment : '',
                'baseRateAdjustment': (businessTermDetails.baseRateAdjustment || businessTermDetails.baseRateAdjustment === 0) ? businessTermDetails.baseRateAdjustment : '',
                'talentAgencyFees': (businessTermDetails.targetAgencyFees || businessTermDetails.targetAgencyFees === 0) ? businessTermDetails.targetAgencyFees : '',
                'talentPayrollService': (businessTermDetails.targetPayrollFees || businessTermDetails.targetPayrollFees === 0) ? businessTermDetails.targetPayrollFees : '',
                'talentLabourMarkup': (businessTermDetails.targetLabourFees || businessTermDetails.targetLabourFees === 0) ? businessTermDetails.targetLabourFees : '',
                'defaultCurrency': businessTermDetails.currency ? businessTermDetails.currency : '',
                // tslint:disable-next-line:max-line-length
                'markups': (businessTermDetails.budgetLineMarkup && businessTermDetails.budgetLineMarkup.length > 0) ? ManageBusinessTermData.setMarkupData(businessTermDetails.budgetLineMarkup) : [],
                // tslint:disable-next-line:max-line-length
                'exchangeRates': (businessTermDetails.exchangeRate && businessTermDetails.exchangeRate.length > 0) ? ManageBusinessTermData.setexchangeRateData(businessTermDetails.exchangeRate) : []
            };
        }
        return businessTermData;
    }
    static setMarkupData(data) {
        const markupArr = [];
        for (let index = 0; index < data.length; index++) {
            const tembusinessTermDetails = data[index];
            markupArr.push({
                'sectionName': tembusinessTermDetails.sectionName ? tembusinessTermDetails.sectionName : '',
                'markup': (tembusinessTermDetails.markup || tembusinessTermDetails.markup === 0) ? tembusinessTermDetails.markup : '',
                'insurance': (tembusinessTermDetails.insurance || tembusinessTermDetails.insurance == 0) ? tembusinessTermDetails.insurance : ''
            });

        }
        return markupArr;
    }
    static setexchangeRateData(data) {
        const exchangeRateArr = [];
        for (let index = 0; index < data.length; index++) {
            const tembusinessTermDetails = data[index];
            exchangeRateArr.push({
                'sourceCurrencyId': tembusinessTermDetails.sourceCurrencyId ? tembusinessTermDetails.sourceCurrencyId : '',
                'targetCurrencyId': tembusinessTermDetails.targetCurrency ? tembusinessTermDetails.targetCurrency : '',
                'unit': tembusinessTermDetails.unit ? tembusinessTermDetails.unit : 1,
                'exhangeRate': (tembusinessTermDetails.exchangeRate || tembusinessTermDetails.exchangeRate === 0) ? tembusinessTermDetails.exchangeRate : '',
            });

        }
        return exchangeRateArr;
    }
}

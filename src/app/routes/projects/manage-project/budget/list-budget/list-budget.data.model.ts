import { Common } from '@app/common';

export class ManageBudgetListData {
    /**
     * method to get budget list data
    return budgetListData as array of object as per list data structure
    @param budgetList as array of Object
    */

    static getbudgetListDetails(budgetList: any) {
        const budgetListData = [];
        if (budgetList && budgetList.length > 0) {
            for (let budgetIndex = 0; budgetIndex < budgetList.length; budgetIndex++) {
                const dataObj = budgetList[budgetIndex];
                const poObj = {
                    'id': dataObj.id ? dataObj.id : '',
                    'name': (dataObj.budget && dataObj.budget.name) ? dataObj.budget.name : '',
                    'budgetTypeId': (dataObj.budget && dataObj.budget.id) ? dataObj.budget.id : '',
                    'errorsCount': dataObj.errorsCount ? dataObj.errorsCount : '',
                    'defaultCurrencyId': (dataObj.defaultCurrency && dataObj.defaultCurrency.id) ? dataObj.defaultCurrency.id : '',
                    'defaultCurrencyCode': (dataObj.defaultCurrency && dataObj.defaultCurrency.code) ? dataObj.defaultCurrency.code : '',
                    // tslint:disable-next-line:max-line-length
                    'currencyConversions': (dataObj.currencyConversionRates && dataObj.currencyConversionRates.length > 0) ? Common.getMultipleSelectArr(dataObj.currencyConversionRates, ['target', 'id'], ['target', 'code']) : [],
                    // tslint:disable-next-line:max-line-length
                    'currencyId': (dataObj.currencyConversionRates && dataObj.currencyConversionRates.length > 0) ? dataObj.currencyConversionRates[0].source.id : '',
                    // tslint:disable-next-line:max-line-length
                    'currencyCode': (dataObj.currencyConversionRates && dataObj.currencyConversionRates.length > 0) ? dataObj.currencyConversionRates[0].source.code : '',
                    // tslint:disable-next-line:max-line-length
                    'currencySymbol': (dataObj.currencyConversionRates && dataObj.currencyConversionRates.length > 0) ? dataObj.currencyConversionRates[0].source.symbol : '',
                    // tslint:disable-next-line:max-line-length
                    'projectEstimation': (dataObj.projectBudgetEstimation || dataObj.projectBudgetEstimation === 0) ? dataObj.projectBudgetEstimation.toFixed(2) : 0,
                    // tslint:disable-next-line:max-line-length
                    'purchaseOrderEstimation': (dataObj.workingEstimation || dataObj.workingEstimation === 0) ? dataObj.workingEstimation.toFixed(2) : 0,
                    // tslint:disable-next-line:max-line-length
                    'actualEstimation': (dataObj.actualEstimation || dataObj.actualEstimation === 0) ? dataObj.actualEstimation.toFixed(2) : 0,
                    // 'budgetSheetUrl': dataObj.budgetSheetFile.url ? dataObj.budgetSheetFile.url.toFixed(2) : ''
                    'budgetSheetUrl': (dataObj.budgetSheetFile && dataObj.budgetSheetFile.url) ? dataObj.budgetSheetFile.url : ''
                };
                for (let index = 0; index < dataObj.currencyConversionRates.length; index++) {
                    if (dataObj.currencyConversionRates[index] && dataObj.currencyConversionRates[index].target) {
                        // tslint:disable-next-line:max-line-length
                        poObj['currencyConversions'][index].name = dataObj.currencyConversionRates[index].target.name;
                        poObj['currencyConversions'][index].targetSymbol = dataObj.currencyConversionRates[index].target.symbol;
                        poObj['currencyConversions'][index].targetUnit = dataObj.currencyConversionRates[index].target.unit;
                        poObj['currencyConversions'][index].targetCode = dataObj.currencyConversionRates[index].target.code;
                        poObj['currencyConversions'][index].targetId = dataObj.currencyConversionRates[index].target.id;
                    } else {
                        // tslint:disable-next-line:max-line-length
                        poObj['currencyConversions'][index].name = '-';
                        poObj['currencyConversions'][index].targetSymbol = '-';
                        poObj['currencyConversions'][index].targetUnit = 0;
                        poObj['currencyConversions'][index].targetCode = '-';
                        poObj['currencyConversions'][index].targetId = '-';
                    }
                }
                budgetListData.push(poObj);
            }


        }
        return budgetListData;
    }

}

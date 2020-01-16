import { debug } from 'util';

export class ManageRateData {
    /**
    return Master config details data as per formcontrol
    @param manageRateDetails as Object
    **/
    static setManageRateData(manageRateDetails: any, projectId, flag) {
        let manageRateData;
        if (manageRateDetails) {
            if (flag) {
                manageRateData = {
                    'baseRate': {
                        // tslint:disable-next-line:max-line-length
                        'categories': manageRateDetails ? ManageRateData.setManageRateHierarchy(manageRateDetails, projectId, flag) : []
                    },
                    'rateChart': null,
                };
            } else {
                manageRateData = {
                    'baseRate': null,
                    'rateChart': {
                        // tslint:disable-next-line:max-line-length
                        'categories': manageRateDetails ? ManageRateData.setManageRateHierarchy(manageRateDetails, projectId, flag) : []
                    }
                };
            }
        }
        return manageRateData;
    }
    static setManageRateHierarchy(manageData, projectId, flag) {
        const manageDataArr = [];
        for (let i = 0; i < manageData.length; i++) {
            if (flag) {
                const manageDataObj = {
                    'section': manageData[i].section ? manageData[i].section : '',
                    'sectionName': manageData[i].sectionName ? manageData[i].sectionName : '',
                    'budgetLineNo': manageData[i].budgetLineNo || manageData[i].budgetLineNo === 0 ? manageData[i].budgetLineNo : '',
                    'headName': manageData[i].headName ? manageData[i].headName : '',
                    'description': manageData[i].description ? manageData[i].description : '',
                    // tslint:disable-next-line:radix
                    'rate': manageData[i].rate || manageData[i].rate === 0 ? parseFloat(manageData[i].rate) : '',
                    'currencyId': manageData[i].currencyId ? manageData[i].currencyId : ''
                };
                if (projectId) {
                    manageDataObj['extra'] = manageData[i].extra;
                }
                manageDataArr.push(manageDataObj);
            } else {
                const obj = {
                    'section': manageData[i].category ? manageData[i].category : '',
                    'sectionName': manageData[i].categoryName ? manageData[i].categoryName : '',
                    'budgetLineNo': manageData[i].budgetLine || manageData[i].budgetLine === 0 ? manageData[i].budgetLine : '',
                    'headName': manageData[i].subDealName ? manageData[i].subDealName : '',
                    'description': manageData[i].description ? manageData[i].description : '',
                    'rate': manageData[i].rate || manageData[i].rate === 0 ? parseFloat(manageData[i].rate) : '',
                    'currencyId': manageData[i].currency ? manageData[i].currency : '',
                    'placeHolder': manageData[i].placeHolder ? manageData[i].placeHolder : ''
                };
                if (manageData[i].reference) {
                    obj['reference'] = manageData[i].reference;
                }
                manageDataArr.push(obj);
            }
        }
        return manageDataArr;
    }
}

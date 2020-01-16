export class ManageWorkingData {
    /**
    return Master config details data as per formcontrol
    @param manageRateDetails as Object
    **/
    static setManageWorkingData(manageRateDetails: any, langCode) {
        let manageCategoryWorkingData;
        manageCategoryWorkingData = {
            'categories': manageRateDetails ?
                ManageWorkingData.setCategoryData(manageRateDetails, langCode) : []
        };
        return manageCategoryWorkingData;
    }
    static setCategoryData(manageRateDetails: any, langCode) {
        const manageWorkingDataArr = [];
        let manageCategoryData;
        if (manageRateDetails) {
            for (let i = 0; i < manageRateDetails.workingArr.length; i++) {
                manageCategoryData = {
                    'id': manageRateDetails.workingArr[i].categoryId ? manageRateDetails.workingArr[i].categoryId : '',
                    'budgetLine': manageRateDetails.workingArr[i].budgetLine ? manageRateDetails.workingArr[i].budgetLine : '',
                    'i18n': {
                        'langCode': langCode,
                        'mappingName': manageRateDetails.workingArr[i].categoryName ? manageRateDetails.workingArr[i].categoryName : ''
                    },
                    'working': manageRateDetails.workingArr[i].workingTotal ? manageRateDetails.workingArr[i].workingTotal : '',
                    'accounts': manageRateDetails ?
                        ManageWorkingData.setManageWorkingHierarchy(manageRateDetails.workingArr[i].subWorkingArr, langCode) : []
                };
                manageWorkingDataArr.push(manageCategoryData);
            }
        }
        return manageWorkingDataArr;
    }
    static setManageWorkingHierarchy(manageData, langCode) {
        const manageDataArr = [];
        for (let i = 0; i < manageData.length; i++) {
            const manageDataObj = {
                'id': manageData[i].subCategoryId ? manageData[i].subCategoryId : '',
                'budgetLine': manageData[i].subBudgetLine ? manageData[i].subBudgetLine : '',
                'i18n': {
                    'langCode': langCode,
                    'mappingName': manageData[i].subCategoryName ? manageData[i].subCategoryName : ''
                },
                'working': manageData[i].workingRate ? manageData[i].workingRate : ''
                // 'currencyId': manageData[i].currencyId ? manageData[i].currencyId : ''
            };
            manageDataArr.push(manageDataObj);
        }
        return manageDataArr;
    }
}


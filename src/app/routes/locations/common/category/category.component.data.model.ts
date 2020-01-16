import { CATEGORY_TYPE_CONST } from '../../../../config';

export class ManageCategorydata {
    /**
    return Role details data as per formcontrol
    @param categoryDetailsArr as category data array
    @param parentId as string for setting parent id of category
    **/
    static getCategoryListDetails(categoryDetailsArr: any, parentId: string) {
        let categoryDataArr = [];
        if (categoryDetailsArr && categoryDetailsArr.length > 0) {
            for (let i = 0; i < categoryDetailsArr.length; i++) {
                let dataObj = categoryDetailsArr[i];
                let categoryObj = {
                    'id': dataObj.id ? dataObj.id : '',
                    'name': (dataObj.i18n && dataObj.i18n.name) ? dataObj.i18n.name : '',
                    'type': dataObj.type ? dataObj.type : '',
                    'parentId': parentId ? parentId : '',
                    'hasChildren': dataObj.hasChildren ? dataObj.hasChildren : false,
                };
                categoryDataArr.push(categoryObj)
            }

        }
        return categoryDataArr;
    }
    /**
  return Role details data as per formcontrol
  @param categoryDetails as category details object
  **/
    static getCategoryWebServiceDetails(categoryDetails: any) {
        let categoryData = {
            'i18n': {
                'langCode': categoryDetails.langCode ? categoryDetails.langCode : '',
                'name': categoryDetails.name ? categoryDetails.name.toUpperCase() : '',
            }
        }
        if (categoryDetails.type == CATEGORY_TYPE_CONST.location) {
            categoryData['locationCategoryId'] = categoryDetails.parentId ? categoryDetails.parentId : '';
        } else {
            categoryData['parentId'] = categoryDetails.parentId ? categoryDetails.parentId : '';
        }
        return categoryData;
    }

}

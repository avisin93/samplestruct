export class AddBudgetData {
    /**
    return Role details data as per formcontrol
    @param budgetDetails as Object
    **/
    static getWebServiceDetails(budgetDetails: any) {
      let budgetFormData;
      if (budgetDetails) {
        budgetFormData = {
          'budgetSheetArr': budgetDetails.budgetSheetArr ? AddBudgetData.setBudgetSheetData(budgetDetails.budgetSheetArr) : [],
        };
      }
      return budgetFormData;
    }
    static setBudgetSheetData(projectDetails) {
      const budgetSheetDataArr = [];
      for (let i = 0; i < projectDetails.length; i++) {
        budgetSheetDataArr.push({
              'budgetSheetType': projectDetails[i].budgetSheetType ? projectDetails[i].budgetSheetType : '',
              'budgetSheetFileId': projectDetails[i].budgetSheetFileId ? projectDetails[i].budgetSheetFileId : '',
          });
      }
      return budgetSheetDataArr;
  }
  }
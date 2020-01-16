export class AddProjectData {
  /**
  return Role details data as per formcontrol
  @param projectDetails as Object
  **/

  static getWebServiceDetails(projectDetails: any) {
    let projectFormData;
    if (projectDetails) {
      projectFormData = {
        'companyId': projectDetails.company ? projectDetails.company : '',
        'projectTypeId': projectDetails.projectType ? projectDetails.projectType : '',
        'division': (projectDetails.division || projectDetails.division == 0) ? projectDetails.division : '',
        'projectName': projectDetails.projectName ? projectDetails.projectName : '',
        'budgets': projectDetails.budgetSheetArr ? AddProjectData.setBudgetSheetData(projectDetails.budgetSheetArr) : [],
      };

    }
    return projectFormData;
  }

  static setBudgetSheetData(projectDetails) {
    const budgetSheetDataArr = [];
    for (let i = 0; i < projectDetails.length; i++) {
      budgetSheetDataArr.push({
            'budgetTypeId': projectDetails[i].budgetSheetType ? projectDetails[i].budgetSheetType : '',
            'budgetFileId': projectDetails[i].budgetSheetFileId ? projectDetails[i].budgetSheetFileId : '',
        });
    }
    return budgetSheetDataArr;
}
}

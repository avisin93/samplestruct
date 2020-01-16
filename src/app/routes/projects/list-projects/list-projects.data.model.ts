

export class ManageProjectListData {
    /**
     * method to get project list data
    return projectListData as array of object as per list data structure 
    @param projectList as array of Object
    */

    static getProjectListDetails(projectList: any) {
        var projectListData = [];
        if (projectList && projectList.length > 0) {
            for (let projectIndex = 0; projectIndex < projectList.length; projectIndex++) {
                let dataObj = projectList[projectIndex];
                let poObj = {
                    "id": dataObj.id ? dataObj.id : "",
                    "name": dataObj.projectName ? dataObj.projectName : "",
                    "type": dataObj.projectType ? dataObj.projectType.name : "",
                    "projectTypeId": dataObj.projectType ? dataObj.projectType.id : "",
                    "division": dataObj.division ? dataObj.division : ""
                }
                projectListData.push(poObj)
            }


        }
        return projectListData;
    }

}

import { Injectable } from '@angular/core';
import { SessionService,HttpRequest } from '../../common';
import { LOCAL_STORAGE_CONSTANTS, URL_PATHS } from '../../config';

@Injectable()
export class ProjectsData {
    public projectsData: any;
    public projectId: any;
    public budgetId: any;
    public projectsDetails: any;
    /**
    * constructor method is used to initialize members of class
    */
    constructor(
        private sessionService: SessionService,
        private _http:HttpRequest
    ) {

    }

    getProjectsData() {
        if (this.projectsData) {
            return JSON.parse(this.projectsData);
        } else {
            this.projectsData = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectData);
            return JSON.parse(this.projectsData);
        }
    }
    
    setProjectsData(projectsData: any) {
        const projectsDataJSONData = JSON.stringify(projectsData);
        this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectData, projectsDataJSONData);
        this.projectsData = projectsDataJSONData;
    }
}

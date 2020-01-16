/**
* Component     : LoginService
* Author        : Boston Byte LLC
* Creation Date : 3rd August 2017
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { URL_FULL_PATHS } from '@app/config';

/**
* UserService class is used to fetch the users data from the server through webservices
*/

@Injectable()
export class BudgetTableService {
  private budgetReportData: any = [];
  private observable = [];

  constructor(private _http: HttpRequest) {

  }

  /**
   * API call and http request caching
   * @param projectId;
   * @param projectBudgetId;
   * @param queryParams;
   * @param pageType;
   */
  getbudgetTableData(projectId, projectBudgetId, queryParams, pageType) {
    if (this.budgetReportData[pageType]) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return Observable.of(this.budgetReportData[pageType]);
    } else if (this.observable[pageType]) {
      return this.observable[pageType];
    } else {
      this.observable[pageType] = this._http.get(Common.sprintf(URL_FULL_PATHS.aicpUrl, [projectId, projectBudgetId]), queryParams)
        .map((response: any) => {
          this.observable[pageType] = null;
          if (response.status = 200) {
            this.budgetReportData[pageType] = response;
            return this.budgetReportData[pageType];
          }
        });
      return this.observable[pageType];
    }
  }

  setBudgetReportData(detailsArr) {
    this.budgetReportData = detailsArr;
  }

  setObservableReportData(detailsArr) {
    this.observable = detailsArr;
  }
}

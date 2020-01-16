import { Injectable } from '@angular/core';
import { RuleGroup } from './rule-group';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class RuleGroupService {

  // Injecting the http client into the service
  constructor (public http: HttpService) { }

  // getAll(url: string, payload = {}): Observable<any> {
  //     let headers = new Headers({ 'Content-Type': 'application/json' });
  //     let options = new RequestOptions({ headers: headers });
  //     return this.http.get(this.URL, payload).map(this.parseData);
  // }

  private parseData (res: Response) {
    let body = res.json();

    if (body instanceof Array) {
      return body || [];
    } else {
      return body['ruleGroup'] || {};
    }
    // return body;
  }

  // Prases error based on the format
  private handleError (error: Response | any) {
    console.log('handleError error is:',error);
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    return Observable.throw(errorMessage);
  }

  saveRuleGroup (ruleGroup: RuleGroup) {
    let saveRuleGroupUrl = UrlDetails.$saveRuleGroupUrl;
    return this.http.get(saveRuleGroupUrl, { ruleGroup }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  addOrUpdateRuleGroup (ruleGroup: RuleGroup) {
    return this.http.get(UrlDetails.$addOrUpdateRuleGroupUrl, { ruleGroup }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getRuleGroups (payload): Observable<RuleGroup[]> {
    return this.http.get(UrlDetails.$getRuleGroupUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getActiveRuleGroupList (payload): Observable<RuleGroup[]> {
    return this.http.get(UrlDetails.$getActiveRuleGroupUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deactivateRuleGroups (ruleGroups: RuleGroup[]) {
    let showPostURL = UrlDetails.$deactivateRuleGroupUrl;
    return this.http.get(showPostURL, { ruleGroups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deleteRuleGroup (ruleGroups: RuleGroup[]) {
    let showPostURL = UrlDetails.$deleteRuleGroupUrl;
    return this.http.get(showPostURL, { ruleGroups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  activateRuleGroup (ruleGroups: RuleGroup[]) {
    let showPostURL = UrlDetails.$activateRuleGroupUrl;
    return this.http.get(showPostURL, { ruleGroups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  checkDependentRuleGroups (payload): Observable<any> {
    const checkURL = UrlDetails.$checkDepedentRuleGroupsUrl;
    return this.http.get(checkURL, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }
}

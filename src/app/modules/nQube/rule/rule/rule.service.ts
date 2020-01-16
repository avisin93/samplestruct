import { Injectable } from '@angular/core';

import { Rule } from './rule';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { BaseUrl } from '../../../../models/url/base-url.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RuleService {

  private URL = BaseUrl.$nQubeUrl;

  constructor (private http: HttpService) { }

  // getAll(url: string, payload = {}): Observable<any> {
  //     let headers = new Headers({ 'Content-Type': 'application/json' });
  //     let options = new RequestOptions({ headers: headers });
  //     return this.http.get(this.URL, payload);
  // }

  private parseData (res: Response) {
    let body = res.json();

    if (body instanceof Array) {
      return body || [];
    } else return body['rule'] || {};
        // return body;
  }

  // Prases error based on the format
  private handleError (error: Response | any) {
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    return Observable.throw(errorMessage);
  }

  saveRule (rule: Rule) {
    let saveRuleUrl = UrlDetails.$saveRuleUrl;
    return this.http.get(saveRuleUrl, { rule }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  addOrUpdateRule (rule: Rule) {
    let addOrUpdateRuleUrl = UrlDetails.$addOrUpdateRuleUrl;
    return this.http.get(addOrUpdateRuleUrl, { rule }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getRules (payload): Observable<Rule[]> {
    return this.http.get(UrlDetails.$getRuleUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deactivateRules (rules: Rule[]) {
    let deactivateRuleUrl = UrlDetails.$deactivateRuleUrl;
    return this.http.get(deactivateRuleUrl, { rules }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deleteRule (rules: Rule[]) {
    let deleteRuleUrl = UrlDetails.$deleteRuleUrl;
    return this.http.get(deleteRuleUrl, { rules }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  activateRule (rules: Rule[]) {
    let activateRule = UrlDetails.$activateRuleUrl;
    return this.http.get(activateRule, { rules }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  onlyUpdateRule (rules: any) {
    let showPostURL = this.URL + 'rule/onlyUpdateRule';
    // var showPostURL = UrlDetails.$onlyUpdateRuleUrl;
    return this.http.get(showPostURL, { rule: rules.rule, tsrule: rules.tsrule, weight: rules.weight }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  saveRuleCriteriaQuery (rules: any) {
    let showPostURL = UrlDetails.$saveRuleCriteriaQueryUrl;
    return this.http.get(showPostURL, rules).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  activateDeactivateRule (rule: any) {
    let showPostURL = UrlDetails.$activateRuleUrl;
    return this.http.get(showPostURL, { rule }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  executeRule (payload: any) {
    const executeRuleUrl = UrlDetails.$getExecuteRuleUrl;
    return this.http.get(executeRuleUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getImageData (payload: any) {
    const getImageDataUrl = UrlDetails.$getPDFtoPNGUrl;
    return this.http.get(getImageDataUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  saveModifiedPDF (payload: any) {
    const saveModifiedPDFUrl = UrlDetails.$getSaveModifiedPDFUrl;
    return this.http.get(saveModifiedPDFUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  // checkDependentRules(payload): Observable<any> {
  //     const checkURL = UrlDetails.$checkDepedentRulesUrl;
  //     return this.http.get(checkURL, payload)
  //     .catch(this.handleError);
  // }
}

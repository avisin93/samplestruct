import { Injectable } from '@angular/core';

import { ModelSetup } from './model-setup';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { BaseUrl } from '../../../../models/url/base-url.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ModelSetupService {
    // Url to API
  private URL = BaseUrl.$nQubeUrl;

    // private getModelSetupURL = this.URL + 'modelSetup/getModelSetup';
  private getModelSetupURL = UrlDetails.$getModelSetupUrl;

    // Injecting the http client into the service
  constructor (private http: HttpService) { }

  getAll (url: string): Observable<any> {
    return this.http.get(this.URL, {});
  }

  private parseData (res: Response) {
    let body = res.json();

    if (body instanceof Array) {
      return body || [];
    } else {
      return body['modelSetup'] || {};
    }
    // return body;
  }

    // Prases error based on the format
  private handleError (error: Response | any) {
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    return Observable.throw(errorMessage);
  }

  saveModelSetup (modelSetup: ModelSetup) {
    let saveLaxiconURL = UrlDetails.$saveModelSetupUrl;
    return this.http.get(saveLaxiconURL, { modelSetup }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  addOrUpdateModelSetup (modelSetup: ModelSetup) {
    let saveLaxiconURL = UrlDetails.$addOrUpdateModelSetupUrl;

    return this.http.get(saveLaxiconURL, { modelSetup }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getModelSetups (payload): Observable<ModelSetup[]> {
    return this.http.get(this.getModelSetupURL, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deactivateModelSetups (modelSetups: ModelSetup[]) {
    let showPostURL = UrlDetails.$deactivateModelSetupUrl;
    return this.http.get(showPostURL, { modelSetups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deleteModelSetup (modelSetups: ModelSetup[]) {
    let showPostURL = UrlDetails.$deleteModelSetupUrl;
    return this.http.get(showPostURL, { modelSetups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  activateModelSetup (modelSetups: ModelSetup[]) {
    let showPostURL = UrlDetails.$activateModelSetupUrl;
    return this.http.get(showPostURL, { modelSetups }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  onlyUpdateModelSetup (modelSetups: any) {
    let showPostURL = UrlDetails.$onlyUpdateModelSetupUrl;
    return this.http.get(showPostURL, { modelSetup: modelSetups.modelSetup, tsmodelSetup: modelSetups.tsmodelSetup, weight: modelSetups.weight }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  uploadSelectedFile (filePayload: any) {
    let uploadFileUrl = UrlDetails.$uploadSelectedFileUrl;
    return this.http.get(uploadFileUrl, filePayload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  checkDependentModels (payload): Observable<any> {
    const checkURL = UrlDetails.$checkDepedentModelsUrl;
    return this.http.get(checkURL, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getClientList (payload: any): Observable<any> {
    return this.http.get(UrlDetails.$getClientListUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

}

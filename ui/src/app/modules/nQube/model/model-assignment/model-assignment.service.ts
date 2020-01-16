import { Injectable } from '@angular/core';

import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ModelAssignmentService {

  constructor (private http: HttpService) {

  }

  private handleError (error) {
    const errMsg = error.message ? error.message : error.toString();
    return Observable.throw(errMsg);
  }

  getAllModels (payload): Observable<any> {
    return this.http.get(UrlDetails.$getAllAssignmentModelsUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  saveAssignmentModel (modelBody): Observable<any> {
    return this.http.get(UrlDetails.$saveAssignmentModelUrl, { modelBody }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  updateAssignmentModel (payload: any): Observable<any> {
    return this.http.get(UrlDetails.$updateAssignmentModelUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  removeModel (payload: any): Observable<any> {
    return this.http.get(UrlDetails.$deleteAssignmentModelUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getProjectList (payload): Observable<any> {
    return this.http.get(UrlDetails.$getProjectListUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getModelList (payload): Observable<any> {
    return this.http.get(UrlDetails.$getModelListUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  uploadExecutionFile (payload: any) {
    return this.http.get(UrlDetails.$uploadExecutionFileUrl, payload).pipe(
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

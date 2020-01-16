import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Lexicon } from './lexicon';
import { UrlDetails } from '../../models/url/url-details.model';
import { BaseUrl } from '../../models/url/base-url.model';
import { HttpService } from '../shared/providers/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class LexiconService {

  // Injecting the http client into the service
  constructor (private http: HttpService) { }

  getAll (url: string) {
    return this.http.get(BaseUrl.$listenUrl, {}).subscribe(res => {
      this.parseData(res);
    }, (error) => {
      this.handleError(error);
    });
  }

  private parseData (res: Response) {
    let body = res.json();

    if (body instanceof Array) {
      return body || [];
    } else {
      return body['lexicon'] || {};
    }
    // return body;
  }

  // Prases error based on the format
  private handleError (error: Response | any) {
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    // In real world application, call to log error to remote server
    // logError(error);
    return Observable.throw(errorMessage);
  }

  saveLexicon (lexicon: Lexicon) {
    let saveLaxiconURL = UrlDetails.$saveLexiconUrl;
    return this.http.get(saveLaxiconURL, { lexicon }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  addOrUpdateLexicon (lexicon: Lexicon) {
    let saveLaxiconURL = UrlDetails.$addOrUpdatedLexiconUrl;

    return this.http.get(saveLaxiconURL, { lexicon }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  getLexicons (): Observable<Lexicon[]> {
    return this.http.get(UrlDetails.$getLexiconUrl, {}).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deactivateLexicons (lexicons: Lexicon[]) {
    let deactivateLexiconUrlURL = UrlDetails.$deactivateLexiconUrl;

    return this.http.get(deactivateLexiconUrlURL, { lexicons }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  deleteLexicon (lexicons: Lexicon[]) {
    let deleteLexiconUrl = UrlDetails.$deleteLexiconUrl;
    return this.http.get(deleteLexiconUrl, { lexicons }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  activateLexicon (lexicons: Lexicon[]) {
    let activateLexiconUrl = UrlDetails.$activateLexiconUrl;
    return this.http.get(activateLexiconUrl, { lexicons }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }
    /*
  onlyUpdateLexicon(lexicons: any){
      let headers = new Headers({'Accept': 'application/json;'});
      let options = new RequestOptions({headers});
      var showPostURL = this.URL+'lexicon/onlyUpdateLexicon';
      return this.http.post(showPostURL, {lexicons})
      .map(this.parseData)
      .catch(this.handleError);
  }  */

  activateDeactivateLexicon (lexicons: any) {
    let activateLexiconUrl = UrlDetails.$activateLexiconUrl;
    return this.http.get(activateLexiconUrl, { lexicons }).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  uploadLexiconFile (payload) {
    let uploadLexiconFileUrl = UrlDetails.$uploadLexiconFileUrl;
    return this.http.get(uploadLexiconFileUrl, payload).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  restrictNumeric (event) {
    const key = event.keyCode ? event.keyCode : event.which;
    return (!event.shiftKey && !event.altKey && !event.ctrlKey &&
            key >= 48 && key <= 57 ||
            key >= 96 && key <= 105 ||
            [189, 8, 9, 13, 37, 39, 45, 46].indexOf(key) >= 0);
  }

}

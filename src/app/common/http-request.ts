import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Configuration, ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, LANGUAGE_CODES, LOCAL_STORAGE_CONSTANTS } from '../config';
import { SessionService } from './services/session.service';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { NavigationService } from './services/navigation.service'
import { templateJitUrl } from '@angular/compiler';
import { PRE_BID_FLAG } from '../config/index';
declare var VERSION_NO;

@Injectable()
export class HttpRequest {
  headers: HttpHeaders;
  options: HttpHeaders;
  rootUrl = Configuration.API_ENDPOINT;
  preBidUrl = Configuration.PREBID_ENDPOINT;
  langCode: string;
  VERSION_NO = VERSION_NO;
  urlSearchParams = new URLSearchParams();

  constructor(
    private _http: HttpClient,
    private navigationService: NavigationService,
    public sessionService: SessionService
  ) {
    this.setDefaultHeaderRequestParams();
  }


  setDefaultHeaderRequestParams() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
    let token = this.sessionService.getCookie(COOKIES_CONSTANTS.authToken);
    if (token) {
      this.headers = this.headers.set('Authorization', token);
    } else {
      this.headers = this.headers.delete('Authorization');
    }
    this.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    if (!this.langCode) {
      this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, LANGUAGE_CODES.en_US);
      this.langCode = LANGUAGE_CODES.en_US;
    }
    this.headers = this.headers.set('Accept-Language', this.sessionService.getCookie(COOKIES_CONSTANTS.langCode));
    this.headers = this.headers.set('x-currency', this.sessionService.getCookie(COOKIES_CONSTANTS.currency));
    //this.options = { headers: this.headers }
  }



  public getJsonData(url: string) {
    return this._http.get(url + "?v=" + this.VERSION_NO);
  }


  public setAuthorization() {
    this.headers = this.headers.delete('Authorization');
    if (this.sessionService.getCookie(COOKIES_CONSTANTS.authToken)) {
      this.headers = this.headers.set('Authorization', this.sessionService.getCookie(COOKIES_CONSTANTS.authToken));
    } else if (this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken)) {
      this.headers = this.headers.set('Authorization', this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken));
    }
  }

  logoutUser() {
    this.headers.delete('Authorization');
    this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.userInfo);
    this.sessionService.removeSessionItem(COOKIES_CONSTANTS.authToken);
    this.sessionService.clearSession();
    this.sessionService.removeSession();
    this.sessionService.deleteCookie(COOKIES_CONSTANTS.authToken);
    this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.login);
  }


  public get(url: string, requestparams?: HttpParams, headersParam?: HttpHeaders, includeLangParam = true, applicationNameFlag?: string) {
    this.setDefaultHeaderRequestParams();
    if (!headersParam) {
      this.setAuthorization();
    }
    if (applicationNameFlag === PRE_BID_FLAG) {
      url = this.handleUrl(url, applicationNameFlag);
    } else {
      url = this.handleUrl(url);
    }
    this.checkLanguage();
    if (includeLangParam) {
      var d = new Date();
      var timestamp = d.getTime();
      url += "?lang=" + this.langCode + "&timestamp=" + timestamp;
    }
    let headerParameters = headersParam ? headersParam : this.headers;
    if (requestparams) {
      return this._http.get(url, { headers: headerParameters, params: requestparams });
    } else {

      return this._http.get(url, { headers: headerParameters });
    }
    //  return this._http.get(url, options.headers || this.options.headers);
  }

  /**
  * Used for post image or video uploading
  * @param url as string
  * @param body as base64 image data
  * @param headersParam as RequestOptionsArgs
  **/
  public postMultipartData(url: string, body: string, requestparams?: HttpParams, observeEvents: boolean = false, reportProgress: boolean = false) {
    this.setAuthorization();
    this.checkLanguage();
    url = this.handleUrl(url);
    var tempHeadersParam = new HttpHeaders();
    tempHeadersParam = tempHeadersParam.set('Authorization', this.headers.get('Authorization'));
    tempHeadersParam = tempHeadersParam.set('Accept-Language', this.headers.get('Accept-Language'));
    let options = {
      params: requestparams,
      headers: tempHeadersParam,
      reportProgress: reportProgress
    }
    if (observeEvents) {
      options['observe'] = 'events';
    }
    return this._http.post(url, body, options);
  }

  /**
  * Post method used for insert data
  * @param url as string
  * @param body as json string
  * @param headersParam as HttpHeaders
  **/
  public post(url: string, body: string, headers?: HttpHeaders, requestparams?: HttpParams) {
    //this.checkLanguage();
    if (!headers) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    let options = { headers: headers || this.headers }
    if (requestparams) {
      options["params"] = requestparams;
    }
    if (body) {
      return this._http.post(url, body, options);
    } else {
      return this._http.post(url, { body }, options);
    }
  }
  /**
    * Patch method used  to make changes to part of the record(data).
    * @param url as string
    * @param body as json string
    * @param headersParam as HttpHeaders
    **/
  public patch(url: string, body: string, headers?: HttpHeaders) {
    // this.checkLanguage();
    if (!headers) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    if (body) {
      return this._http.patch(url, body, { headers: headers || this.headers });
    } else {
      return this._http.patch(url, { body }, { headers: headers || this.headers });
    }
  }


  /**
  * Put method used for update data
  * @param url as string
  * @param body as json string
  * @param headersParam as HttpHeaders
  **/
  public put(url: string, body: string, headersParam?: HttpHeaders) {
    this.setDefaultHeaderRequestParams();
    if (!headersParam) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    return this._http.put(url, body, { headers: headersParam || this.headers });
  }

  /**
  * Delete method used for delete data
  * @param url as string
  * @param headersParam as HttpHeaders
  **/
  public delete(url: string, headersParam?: HttpHeaders) {
    this.setDefaultHeaderRequestParams();
    if (!headersParam) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    return this._http.delete(url, { headers: headersParam || this.headers });
  }

  /**
  * Set url with API Endpoint if full url is not passed
  * @param url as string
  * return url as string
  **/
  private handleUrl(url: string, applicationNameFlag?: string): string {
    if (!this.checkUrlExternal(url)) {
      if (url.charAt(0) == '/') {
        url = url.substring(1);
      }
      if (applicationNameFlag === PRE_BID_FLAG) {
        url = this.preBidUrl + url;
      } else {
        url = this.rootUrl + url;
      }
    }
    return url;
  }

  /**
  * check api url
  **/
  private checkUrlExternal(url: string): boolean {
    return /^(?:[a-z]+:)?\/\//i.test(url);
  }

  /**
  * set accept-language in header if language is changed
  **/
  private checkLanguage() {
    if (this.langCode != this.sessionService.getCookie(COOKIES_CONSTANTS.langCode)) {
      this.headers.delete('Accept-language');
      this.headers = this.headers.set('Accept-language', this.sessionService.getCookie(COOKIES_CONSTANTS.langCode));
      this.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    }
  }
}

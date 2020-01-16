import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { SessionService } from '@app/common';
import { Configuration, ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, LANGUAGE_CODES, PRE_BID_FLAG } from '@app/config';


@Injectable()
export class PreBidHttpRequest {
  headers: HttpHeaders;
  options: HttpHeaders;
  rootUrl = Configuration.PREBID_ENDPOINT;
  langCode: string;
  urlSearchParams = new URLSearchParams();
  HEADER_REQUEST_PARAMS = {
    'contentType': 'Content-Type',
    'accept': 'Accept',
    'authorization': 'Authorization',
    'acceptLanguage': 'Accept-Language',
    'xCurrency': 'x-currency'
  };
  constructor(
    private _http: HttpClient,
    public sessionService: SessionService
  ) {
    this.setDefaultHeaderRequestParams();
  }


  setDefaultHeaderRequestParams() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.contentType, 'application/json');
    this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.accept, 'application/json');
    let token = this.sessionService.getCookie(COOKIES_CONSTANTS.authToken);
    if (token) {
      this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.authorization, token);
    } else {
      this.headers = this.headers.delete(this.HEADER_REQUEST_PARAMS.authorization);
    }
    this.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    if (!this.langCode) {
      this.sessionService.setCookie(COOKIES_CONSTANTS.langCode, LANGUAGE_CODES.en_US);
      this.langCode = LANGUAGE_CODES.en_US;
    }
    this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.acceptLanguage, this.sessionService.getCookie(COOKIES_CONSTANTS.langCode));
    this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.xCurrency, this.sessionService.getCookie(COOKIES_CONSTANTS.currency));
    //this.options = { headers: this.headers }
  }



  public getJsonData(url: string) {
    return this._http.get(url);
  }


  public setAuthorization() {
    this.headers = this.headers.delete(this.HEADER_REQUEST_PARAMS.authorization);
    if (this.sessionService.getCookie(COOKIES_CONSTANTS.authToken)) {
      this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.authorization, this.sessionService.getCookie(COOKIES_CONSTANTS.authToken));
    } else if (this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken)) {
      this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.authorization, this.sessionService.getSessionItem(COOKIES_CONSTANTS.authToken));
    }
  }


  public get(url: string, requestparams?: HttpParams, headersParam?: HttpHeaders, includeLangParam = true) {
    this.setDefaultHeaderRequestParams();
    if (!headersParam) {
      this.setAuthorization();
    }
    url = this.handleUrl(url);
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
  public postMultipartData(url: string, body: string, requestparams?: HttpParams) {
    this.setAuthorization();
    this.checkLanguage();
    url = this.handleUrl(url);
    var tempHeadersParam = new HttpHeaders();
    tempHeadersParam = tempHeadersParam.set(this.HEADER_REQUEST_PARAMS.authorization, this.headers.get(this.HEADER_REQUEST_PARAMS.authorization));
    tempHeadersParam = tempHeadersParam.set(this.HEADER_REQUEST_PARAMS.acceptLanguage, this.headers.get(this.HEADER_REQUEST_PARAMS.acceptLanguage));
    return this._http.post(url, body, { params: requestparams, headers: tempHeadersParam });
  }

  /**
  * Post method used for insert data
  * @param url as string
  * @param body as json string
  * @param headersParam as HttpHeaders
  **/
  public post(url: string, body: string, headers?: HttpHeaders) {
    //this.checkLanguage();
    if (!headers) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    if (body) {
      return this._http.post(url, body, { headers: headers || this.headers });
    } else {
      return this._http.post(url, { body }, { headers: headers || this.headers });
    }
  }


  /**
  * Put method used for update data
  * @param url as string
  * @param body as json string
  * @param headersParam as HttpHeaders
  **/
  public put(url: string, body: string, headersParam?: HttpParams, httpHeaders?: HttpHeaders) {
    this.setDefaultHeaderRequestParams();
    if (!headersParam) {
      this.setAuthorization();
    }
    this.checkLanguage();
    url = this.handleUrl(url);
    return this._http.put(url, body, { headers: httpHeaders || this.headers, params: headersParam });
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
  private handleUrl(url: string): string {
    if (!this.checkUrlExternal(url)) {
      if (url.charAt(0) == '/') {
        url = url.substring(1);
      }
      url = this.rootUrl + url;
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
      this.headers.delete(this.HEADER_REQUEST_PARAMS.acceptLanguage);
      this.headers = this.headers.set(this.HEADER_REQUEST_PARAMS.acceptLanguage, this.sessionService.getCookie(COOKIES_CONSTANTS.langCode));
      this.langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
    }
  }
}

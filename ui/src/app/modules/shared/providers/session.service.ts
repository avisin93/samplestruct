import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
// import { DynamicThemeService } from './dynamic-theme.service';
import { HttpService } from './http.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Injectable()
export class SessionService {

  // Session Data store as key: value pair.
  private static _sessionData: { [ID: string]: any } = {};

  constructor (public httpService: HttpService) {
  }

  static set (id: string, value: any): void {
    this._sessionData[id] = value;
  }

  static get (id: string): any {
    if (this._sessionData[id]) {
      return this._sessionData[id];
    }

    return null;
  }

  static remove (id: string): void {
    if (this._sessionData[id]) {
      delete this._sessionData[id];
    }
  }

  logout () {
    this.httpService.get(UrlDetails.$exela_logoutUrl, {}).subscribe(response => {
      StorageService.removeAll();
    //   DynamicThemeService.removeThemeStyling('test-dynamic-theme');
    //   DynamicThemeService.removeThemeStyling('main-theme');
      location.replace('/');
    });
  }
}

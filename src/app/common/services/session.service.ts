import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Common } from '../common';
import { COOKIES_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '../../config';
import { NavigationService } from './navigation.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class SessionService {

  constructor(
    private _router: Router,
    public cookieService: CookieService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService
  ) { }

  setCookie(name, value) {
    const timestamp = Common.getCookieExpiredTime();
    this.cookieService.set(name, value, timestamp, '/');
  }

  getCookie(name) {
    return this.cookieService.get(name);
  }

  deleteCookie(name) {
    this.cookieService.delete(name, '/');
  }

  setSessionItem(name, value) {
    sessionStorage.setItem(name, value);
  }

  getSessionItem(name) {
    return sessionStorage.getItem(name);
  }

  removeSessionItem(name) {
    return sessionStorage.removeItem(name);
  }

  removeSession() {
    return sessionStorage.clear();
  }

  setLocalStorageItem(name, value) {
    this.localStorageService.set(name, value);
  }

  getLocalStorageItem(name) {
    return this.localStorageService.get(name);
  }

  removeLocalStorageItem(name) {
    return this.localStorageService.remove(name);
  }

  clearSession() {
    this.deleteCookie(COOKIES_CONSTANTS.authToken);
    this.deleteCookie(COOKIES_CONSTANTS.name);
    this.localStorageService.clearAll();
    const langCode = this.getCookie(COOKIES_CONSTANTS.langCode);
    this.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.langCode, langCode);
  }
}

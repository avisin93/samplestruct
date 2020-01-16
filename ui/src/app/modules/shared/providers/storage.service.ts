import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public static organizationId: string = 'organizationId';
  public static organizationName: string = 'organizationName';
  public static organizationCode: string = 'organizationCode';

  public static projectId: string = 'projectId';
  public static projectCode: string = 'projectCode';
  public static projectRoles: string = 'projectRoles';

  public static langPref: string = 'langPref';
  public static rememberMeUserName: string = 'rememberMe.userName';
  public static rememberMePassword: string = 'rememberMe.password';
  public static exelaAuthToken: string = 'exelaAuthToken';
  public static siteSettingId: string = 'siteSettingId';
  public static userName: string = 'userName';
  public static userId: string = 'userId';
  public static firstName: string = 'firstName';
  public static lastName: string = 'lastName';
  public static lastLoginDate: string = 'lastLoginDate';
  public static profilePhoto: string = 'profilePhoto';
  public static userEmail: string = 'userEmail';
  public static userModules: string = 'userModules';
  public static userRoles: string = 'userRoles';
  public static userRole: string = 'userRole';
  public static rdhAccessToken: string = 'rdhAccessToken';
  public static selectedProduct: string = 'selectedProduct';
  public static isThemeAssigned: string = 'isThemeAssigned';
  public static enableMfa: string = 'enableMfa';
  public static enableAnnotationRedaction: string = 'enableAnnotationRedaction';
  public static gin: string = 'gin';
  public static logo: string = 'logo';
  public static deeplink: string = 'deeplink';
  public static logotooltip: string = 'logotooltip';
  public static collapseLogo: string = 'collapseLogo';

  public static autoRoutingRuleFor: string = 'autoRoutingRuleFor';

  static set (key: string, value: any): void {
    if (key === StorageService.rememberMeUserName || key === StorageService.rememberMePassword || key === StorageService.langPref) {
      if (typeof window.localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } else {
      if (typeof window.sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    }
  }

  static get (key: string): any {
    if (key === StorageService.rememberMeUserName || key === StorageService.rememberMePassword || key === StorageService.langPref) {
      if (typeof window.localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } else {
      if (typeof window.sessionStorage !== 'undefined') {
        return sessionStorage.getItem(key);
      }
    }
    return '';
  }

  static remove (key: string): void {
    if (key === StorageService.rememberMeUserName || key === StorageService.rememberMePassword || key === StorageService.langPref) {
      if (typeof window.localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } else {
      if (typeof window.sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    }
  }

  static removeAll (): void {
    let username = StorageService.get(StorageService.rememberMeUserName);
    let password = StorageService.get(StorageService.rememberMePassword);
    let langPref = StorageService.get(StorageService.langPref);
    if (typeof window.localStorage !== 'undefined') {
      localStorage.clear();
    }
    if (typeof window.sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    if (username && password) {
      StorageService.set(StorageService.rememberMeUserName, username);
      StorageService.set(StorageService.rememberMePassword, password);
    }
    StorageService.set(StorageService.langPref, langPref);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { StorageService } from '../shared/providers/storage.service';
import { LoginService } from '../login/login.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';
import { UtilitiesService } from '../shared/providers/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (
    private loginService: LoginService,
    private httpService: HttpClient,
    private _utility: UtilitiesService
  ) { }

  public async isAuthenticated () {
    const token = StorageService.get('exelaAuthToken');
    const haveToken = (typeof token !== undefined && token !== null && token !== '');
    const canAccessRoute = true || this.canAccessRouteTest();
    return {
      haveToken,
      canAccessRoute
    };
  }

  private canAccessRouteTest () {
    // TODO: Sasa fix access to routes
    return true;
    const userModules = JSON.parse(StorageService.get(StorageService.userModules));
    const tmpMenus = [];
/*     if (userModules) {
      userModules.forEach((userModule) => {
        console.log(userModule);
        tmpMenus.push(...userModule.menus);
      });
      return true;
    } */
  }
}

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ROUTER_LINKS_FULL_PATH, SESSION_STORAGE_CONSTANTS, COOKIES_CONSTANTS } from '@app/config';
import { SessionService } from './services/session.service';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var token = this.sessionService.getCookie(COOKIES_CONSTANTS.authToken);
    if (token !== undefined && token !== '') {
      return true;
    } else {
      //No need to check query params object while redirecting to full path with queryparam
      // const queryParamObj = Common.getQueryParamObj(window.location.href);
      // if (queryParamObj && queryParamObj['editlocation'] && queryParamObj['financialdetails']) {
      //   this.sessionService.setSessionItem('redirectUrl', window.location.pathname + window.location.search);
      // } 
      this.sessionService.setSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl, window.location.pathname + window.location.search);
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate([ROUTER_LINKS_FULL_PATH.login]);
    return false;
  }
}

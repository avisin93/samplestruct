import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { STATUS_CODES, ROUTER_LINKS_FULL_PATH, COOKIES_CONSTANTS, LANGUAGE_CODES } from '../config';
import { SessionService } from './services/session.service';
import { NavigationService } from './services/navigation.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    public _route: Router,
    private sessionService: SessionService,
    private navigationService: NavigationService,
    private toastrService: ToastrService
  ) {
   }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).do(evt => {
      if (evt instanceof HttpResponse) {
        if (evt.body.header) {
          if (evt.body.header.statusCode == STATUS_CODES.EXPIRED_TOKEN) {
            this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.login).then(() => {
              this.toastrService.clear();
              let langCode = this.sessionService.getCookie(COOKIES_CONSTANTS.langCode);
              // if (langCode == LANGUAGE_CODES.en_US) {
              //   this.toastrService.error("Your session has expired")
              // }
              // else {
              //   this.toastrService.error("Su sesión ha caducado")
              // }
              //
              switch (langCode) {
                case LANGUAGE_CODES.en_US:
                  this.toastrService.error("Your session has expired")
                  break;

                case LANGUAGE_CODES.es_MX:
                  this.toastrService.error("Su sesión ha caducado")
                  break;
              }
              this.sessionService.clearSession();
            })
          }
        }
      }
    });
  }
}

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SweetAlertController } from '../controllers/sweet-alert.controller';
import { StorageService } from './storage.service';
import { DynamicThemeService } from './dynamic-theme.service';

@Injectable()
export class InterceptedHttp implements HttpInterceptor {
  constructor () { }
  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              return event;
            }),
            catchError((error: HttpErrorResponse) => {
              if (request.url.indexOf('/login') < 0 && error.status === 401) {
                let sessionTimeoutAlert = new SweetAlertController();
                let alertOption = {
                  title: 'Session Ended',
                  text: 'Either your session is expired or Ended.',
                  type: 'warning',
                  width: '450px',
                  showCancelButton: false,
                  confirmButtonText: 'Ok'
                };
                sessionTimeoutAlert.slideSession(alertOption, () => {
                  StorageService.removeAll();
                  DynamicThemeService.removeThemeStyling('test-dynamic-theme');
                  DynamicThemeService.removeThemeStyling('main-theme');
                  location.replace('#/login');
                });
              }
              return throwError(error);
            }));
  }
}

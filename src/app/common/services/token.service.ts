import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { SessionService } from '../';
import { COOKIES_CONSTANTS } from '../../config';
@Injectable()
export class TokenService {
  /**
  * constructor method is used to initialize members of class
  */
  constructor(
    private sessionService: SessionService
  ) {

  }

  checkUserToken() {
    if (this.sessionService.getCookie(COOKIES_CONSTANTS.authToken)) {
      return true;
    }
  }

}

import { Injectable } from '@angular/core';

import { HttpService } from '../../shared/providers/http.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class CustomerSetUpService {
  constructor (private http: HttpService) {

  }
  CustomerSegmentService (url: string,_id: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.findById(url + '/' + _id,options);
  }

}

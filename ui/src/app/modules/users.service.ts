import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './shared/providers/storage.service';
import { UrlDetails } from '../models/url/url-details.model';

let counter = 0;

@Injectable()
export class UserService {

  users$ = [];

  private userArray: any[];

  constructor (private http: HttpClient) {
  }

  getUsers () {
    let userEmail = StorageService.get('userEmail');
    let currentUserToken = StorageService.get('exelaAuthToken');
    let headers = new HttpHeaders();
    if (userEmail == null) {
      return null;
    }
    headers = headers.append('Authorization', 'Bearer ' + currentUserToken);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return this.http.post(`${UrlDetails.$exela_getBasicInfoUrl}`, { 'token': currentUserToken, 'username': userEmail }, { headers: headers });
  }

  getUserArray (): Observable<any[]> {
    return observableOf(this.userArray);
  }

  getUser (): Observable<any> {
    counter = (counter + 1) % this.userArray.length;
    return observableOf(this.userArray[counter]);
  }

  // getLogedInUser(){
  //   let user = localStorage.getItem('currentUser');
  //   if(user==null){
  //     return this.users = {name:'N/A', picture:'assets/images/user.png'};
  //   }
  //   else{
  //     return this.http.get('http://localhost:3000/api/users')
  //   }
  // }
}

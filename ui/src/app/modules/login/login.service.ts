import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RequestService } from '../request.service';
import { StorageService } from '../shared/providers/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor (
    private http: HttpClient
  ) { }

  postLoginExelaAuthAPIs (url: string, loginData: any) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true' }
    );
    headers = headers.append('Authorization', 'Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    if (loginData['secrete_key']) {
      headers = headers.append('secrete_key', loginData['secrete_key']);
    }
    delete(loginData.secrete_key);
    return this.http.post(url, loginData, { headers: headers });
  }

  logout () {
    StorageService.removeAll();
  }

  getOtpPassword (username) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept','text/html');
    const data: any = {
      from: 'cm@exelaonline.com',
      subject: 'Login with OTP',
      template: "<html><body><p> <style>{font-family: 'Calibri', font-size: 15px, line-height: normal;}</style> Hi " + username + ',<br /><br />Your Login OTP is: <<OTP>>.<br/>For account safety, keep this OTP to yourself.<br /><br />Regards,<br />Exela Contract Management Team.</p></body></html>',
      username: username
    };
    return this.http.post(environment.exelaAuth + '/sendOTP', data, { headers: headers, responseType: 'text' });
  }
}

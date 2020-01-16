import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';
import { UrlDetails } from 'src/app/models/url/url-details.model';

@Injectable({
  providedIn: 'root'
})
export class ContractListService {

  constructor (private httpService: HttpClient) {

  }

  addOrUpdateAttribute (id, userAttributes) {
    let body: any = {
      id : id,
      userAttributes : userAttributes
    };

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
      .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    this.httpService.post(`${UrlDetails.$exela_addOrUpdateUserAttributes}`,body,{ headers: headers, responseType: 'text' }).toPromise().then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }
  async getAttributeForContractList () {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json')
    .append('Authorization','Bearer ' + StorageService.get(StorageService.exelaAuthToken));
    return this.httpService.post(`${UrlDetails.$exela_getUserAttributes}/${StorageService.get(StorageService.userId)}`,
    undefined,{ headers: headers, observe: 'response' }).toPromise().then(response => {
      let list: any = response.body;
      return list.find((item: any) => {
        return item.att_name === 'contract-list-columns';
      });
    }
    ).catch();

  }
}

/**
* Service       : AddLocationServices
 
* Creation Date : 16th July 2018
*/

import { Injectable } from '@angular/core';
import { HttpRequest, Common } from '@app/common';
import { API_URL } from '@app/config';

@Injectable()
export class ManageRolesService {

  /**
  * constructor method is used to initialize members of class
  */
  constructor(private _http: HttpRequest) {
  }

  /**
  ** Common API Call for get Data
  **/
  apiCall(url: string) {
    return this._http.get(url);
  }
  /**
  ** API call to get role details
  **/
  getRoleDetails(id: string) {
    return this.apiCall(API_URL.roles + '/' + id);
  }
  /**
  ** API call to parent roles
  **/
  getParentRoles() {
    return this.apiCall(API_URL.rolesParent);
  }

  /**
  ** API call to get module details
  **/

  getModuleAccessDetails(roleId: string, moduleId: string) {
    return this.apiCall(Common.sprintf(API_URL.fieldAccess, [roleId]) + '/' + moduleId);
  }

  /**
   * 
   * @param roleId as String
   * @param moduleId as String
   * @param formDetails as object data For details of Ui and server access
   */
  putModuleAccessDetails(roleId: string, moduleId: string, formDetails) {
    return this._http.put(Common.sprintf(API_URL.fieldAccess, [roleId]) + '/' + moduleId, formDetails);
  }


  /**
  /* add new role  */
  postData(roleData: any) {
    return this._http.post(API_URL.roles, JSON.stringify(roleData))
  }

  /* Update Roles Data  */
  putData(roleData: any, id: any) {
    return this._http.put(API_URL.roles + '/' + id, JSON.stringify(roleData));
  }
  /**
  ** api for getting offline sample permissions json
  **/
  getSampleJSON() {
    return this._http.getJsonData(API_URL.samplePermissions)
  }
}

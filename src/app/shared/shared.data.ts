import { Injectable } from '@angular/core';
import { SessionService } from '../common/services/session.service';
import { LOCAL_STORAGE_CONSTANTS, ROLE_PERMISSION_KEY } from '../config';
import { EncriptionService } from '../common/services/encription.service';

@Injectable()
export class SharedData {
  public rolePermissionData: any;
  public usersInfoData: any;
  public modulesData: any = {};
  /**
  * constructor method is used to initialize members of class
  */
  constructor(
    private sessionService: SessionService,
    private _encriptionService: EncriptionService
  ) {

  }


  getUsersInfo() {
    if (this.usersInfoData) {
      return JSON.parse(this.usersInfoData);
    } else {
      this.usersInfoData = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.userInfo);
      return JSON.parse(this.usersInfoData);
    }
  }


  setUsersInfo(usersInfoData: any) {
    const usersInfoDataJSONData = JSON.stringify(usersInfoData);
    this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.userInfo, usersInfoDataJSONData);
    this.usersInfoData = usersInfoDataJSONData;
  }

  // getRolePermissionData() {
  //   if (this.rolePermissionData) {
  //     return JSON.parse(this.rolePermissionData);
  //   } else {
  //     this.rolePermissionData = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.rolePermissions);
  //     return JSON.parse(this.rolePermissionData);
  //   }
  // }

  // setRolePermissionData(rolePermissionData: any) {
  //   var rolePermissionJSONData = JSON.stringify(rolePermissionData);
  //   this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.rolePermissions, rolePermissionJSONData);
  //   this.rolePermissionData = rolePermissionJSONData;
  // }

  /*
  * This method is used to set Role Permission data into local storage
  */
  setRolePermissionData(rolePermissionData: any) {
    const rolePermissionJSONData = this._encriptionService.setEncryptedData(JSON.stringify(rolePermissionData), ROLE_PERMISSION_KEY);
    this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.rolePermissions, rolePermissionJSONData.toString());
    this.rolePermissionData = JSON.stringify(rolePermissionData);
  }

  /*
  * This method is used to get Role Permission data from local storage
  */
  getRolePermissionData() {
    if (this.rolePermissionData) {
      return JSON.parse(this.rolePermissionData);
    } else {
      const rolePermissionData1 = this.sessionService.getLocalStorageItem(LOCAL_STORAGE_CONSTANTS.rolePermissions);
      this.rolePermissionData = JSON.stringify(this._encriptionService.getDecryptedData(rolePermissionData1, ROLE_PERMISSION_KEY));
      return JSON.parse(this.rolePermissionData);
    }
  }

  getModulesData(moduleName) {
    return this.modulesData[moduleName];
  }

  setModulesData(moduleName, dataObj: any) {
    this.modulesData[moduleName] = dataObj;
  }
}

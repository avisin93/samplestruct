import { Injectable } from '@angular/core';
import { SharedData } from './shared.data';
import { ROLES_CONST, URL_PATHS, MENU_CONFIG, LOCAL_STORAGE_CONSTANTS, MODULE_ID, ACTION_TYPES, UI_ACCESS_PERMISSION_CONST, SESSION_STORAGE_CONSTANTS, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { SharedService } from './shared.service';
import { SessionService, NavigationService } from '@app/common';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class RolePermission {
  menuList = MENU_CONFIG;
  roleData: any;
  rolePermissionArr: any = [];
  rolePermissionsJsonUrlArr = [];
  landingModuleId: any;
  spinnerFlag: Boolean = false;
  objectNames = ['removeFields', 'removeTabs', 'removeActions', 'disableFields'];
  disableButtonFlag: boolean = false;
  /**
  * constructor method is used to initialize members of class
  */
  constructor(
    private sharedData: SharedData,
    private sharedService: SharedService,
    private navigationService: NavigationService,
    private sessionService: SessionService,
  ) { }

  setRolePermissionWithNavigateUser(userInfoData) {
    this.rolePermissionArr = [];
    this.rolePermissionsJsonUrlArr = [];
    // tslint:disable-next-line:forin
    for (let roleIndex = 0; roleIndex < userInfoData.rolesDetails.length; roleIndex++) {
      const invertedObj = _.invert(JSON.parse(JSON.stringify(ROLES_CONST)));
      const isKeyPresent = _.has(invertedObj, userInfoData.rolesDetails[roleIndex].id);
      if (isKeyPresent) {
        switch (userInfoData.rolesDetails[roleIndex].id) {
          case ROLES_CONST.headOfMarketing:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfMarketingURL);
            break;
          case ROLES_CONST.HRcoordinator:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.HRcoordinatorURL);
            break;
          case ROLES_CONST.headOfHR:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfHRURL);
            break;
          case ROLES_CONST.officeCoordinator:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.officeCoordinatorURL);
            break;
          case ROLES_CONST.headOfOffice:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfOfficeUrl);
            break;
          case ROLES_CONST.entertainmentCoordinator:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.entertainmentCoordinatorUrl);
            break;
          case ROLES_CONST.headOfEntertainment:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfEntertainmentUrl);
            break;

          case ROLES_CONST.vendor:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.vendorPermissionURL);
            break;
          case ROLES_CONST.freelancer:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.freelancerRolePermissionsUrl);
            break;
          case ROLES_CONST.productionCoordinator:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.productionCoordinatorPermissionUrl);
            break;
          case ROLES_CONST.producer:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.producerUrl);
            break;
          case ROLES_CONST.admin:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.adminPermissionUrl);
            break;
          case ROLES_CONST.ceo:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.ceoPermissionsUrl);
            break;
          case ROLES_CONST.cfo:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.cfoPermissionsUrl);
            break;
          case ROLES_CONST.productionController:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.productionControllerPermissionsUrl);
            break;
          case ROLES_CONST.locationAdmin:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.locationAdminPermissionsUrl);
            break;
          case ROLES_CONST.accountant:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.accountantPermissionUrl);
            break;
          case ROLES_CONST.accountantInternalAuditor:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.accountantInternalAuditorPermissionsUrl);
            break;
          case ROLES_CONST.cco:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.ccoPermissionsUrl);
            break;
          case ROLES_CONST.employee:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.employeePermissionsUrl);
            break;
          case ROLES_CONST.director:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.directorPermissionsUrl);
            break;
          case ROLES_CONST.locationScouter:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.locationScouterPermissionsUrl);
            break;
          case ROLES_CONST.publicRelations:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.publicRelationsPermissions);
            break;
          case ROLES_CONST.presales:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.presalesPermissionsUrl);
            break;
          case ROLES_CONST.associateAccountant:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.associateAccountantPermissions);
            break;
          case ROLES_CONST.productionManager:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.productionManagerPermissions);
            break;
          case ROLES_CONST.companyController:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.companyControllerPermissions);
            break;
          case ROLES_CONST.bidderSenior:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.bidderSeniorPermissions);
            break;
          case ROLES_CONST.headOfBidding:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfBiddingPermissions);
            break;
          case ROLES_CONST.researcherSenior:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.researcherSeniorPermissions);
            break;
          case ROLES_CONST.headOfResearch:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.headOfResearchPermissions);
            break;
          case ROLES_CONST.marketingCoordinator:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.marketingCoordinatorPermissions);
            break;
          case ROLES_CONST.talentManager:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.talentManagerPermissions);
            break;
          default:
            this.rolePermissionsJsonUrlArr.push(URL_PATHS.defaultPermissions);
            break;
        }
      }
    }
    this.getModuleData(this.rolePermissionsJsonUrlArr);

  }


  getModuleData(roleJSONArr) {
    let observables = [];
    roleJSONArr.forEach((element) => {
      observables.push(this.sharedService.getRolePermissions(element));
    });
    const combined = Observable.forkJoin(observables);
    combined.subscribe((latestValues: any) => {
      this.rolePermissionArr = [];
      latestValues[0].payload.modules.forEach(element => {
        this.rolePermissionArr[element.moduleId] = element;
      });
      for (let roleIndex = 0; roleIndex < latestValues.length; roleIndex++) {
        if (latestValues[roleIndex] && latestValues[roleIndex].payload && latestValues[roleIndex].payload['roles'] && latestValues[roleIndex].payload['roles']['landingModuleId']) {
          if (latestValues[roleIndex].payload['roles']['id'] != ROLES_CONST['employee']) {
            this.landingModuleId = latestValues[roleIndex].payload['roles']['landingModuleId'];
          }
        }
      }
      for (let roleIndex = 1; roleIndex < latestValues.length; roleIndex++) {
        this.roleData = latestValues[roleIndex].payload.modules;
        for (let moduleIndex = 0; moduleIndex < this.roleData.length; moduleIndex++) {
          const moduleId = this.roleData[moduleIndex].moduleId;
          if (this.rolePermissionArr[moduleId] && (this.rolePermissionArr[moduleId].moduleId === this.roleData[moduleIndex].moduleId)) {

            for (let objectIndex = 0; objectIndex < this.objectNames.length; objectIndex++) {
              // const element = this.objectNames[objectIndex];


              // tslint:disable-next-line:max-line-length
              // if (this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] && this.rolePermissionArr[moduleId].uiAccess && this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //   if (this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW] && this.rolePermissionArr[moduleId].uiAccess && this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //     for (const key in this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //       // tslint:disable-next-line:max-line-length
              //       if (this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key]) {
              //         this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = true;
              //       } else {
              //         this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = false;
              //       }
              //     }
              //   }

              //   if (this.roleData[moduleIndex][ACTION_TYPES.VIEW] && this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //     for (const key in this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {

              //       // tslint:disable-next-line:max-line-length
              //       if (this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key]) {
              //         this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = true;
              //       } else {
              //         this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = false;
              //       }
              //     }
              //   }
              // } else {
              //   if (this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW] && this.roleData[moduleIndex][ACTION_TYPES.VIEW]) {
              //     // tslint:disable-next-line:max-line-length
              //     if ((this.rolePermissionArr[moduleId].uiAccess && this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) && !(this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]])) {
              //       this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = {};
              //     }
              //     // tslint:disable-next-line:max-line-length
              //     if ((this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) && !((this.rolePermissionArr[moduleId].uiAccess && this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]))) {
              //       if (!this.rolePermissionArr[moduleId].uiAccess) {
              //         this.rolePermissionArr[moduleId].uiAccess = {};
              //       }
              //       if (!this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //         this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = {};
              //       }
              //       // tslint:disable-next-line:max-line-length
              //       this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = Object.assign({}, this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]);
              //     }
              //   }
              //   ////////////////////////////////////////////
              //   else {
              //     if (!this.rolePermissionArr[moduleId].uiAccess) {
              //       this.rolePermissionArr[moduleId].uiAccess = {};
              //     }
              //     if (!this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //       this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = {};
              //     }
              //     if (this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
              //       // tslint:disable-next-line:max-line-length
              //       this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = Object.assign({}, this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]);
              //     }
              //   }
              // }










              // tslint:disable-next-line:max-line-length
              if (this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW] && this.rolePermissionArr[moduleId].uiAccess && this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] && this.roleData[moduleIndex][ACTION_TYPES.VIEW] && this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
                for (const key in this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
                  // tslint:disable-next-line:max-line-length
                  if (this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key]) {
                    this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = true;
                  } else {
                    this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = false;
                  }
                }

                for (const key in this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {

                  // tslint:disable-next-line:max-line-length
                  if (this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key]) {
                    this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = true;
                  } else {
                    this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]][key] = false;
                  }
                }
              } else {
                if (this.roleData[moduleIndex][ACTION_TYPES.VIEW] && this.roleData[moduleIndex].uiAccess && !this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW]) {
                  this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = Object.assign({}, this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]])
                } else if (this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW] && this.rolePermissionArr[moduleId].uiAccess && !this.roleData[moduleIndex][ACTION_TYPES.VIEW]) {

                }
                if (!this.rolePermissionArr[moduleId].uiAccess) {
                  this.rolePermissionArr[moduleId].uiAccess = {};
                }
                if (!this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]) {
                  this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = {};
                }
                if (this.roleData[moduleIndex].uiAccess && this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] && !this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW]) {
                  // tslint:disable-next-line:max-line-length
                  this.rolePermissionArr[moduleId].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]] = Object.assign({}, this.roleData[moduleIndex].uiAccess[UI_ACCESS_PERMISSION_CONST[this.objectNames[objectIndex]]]);
                }
              }

            }


            if (this.roleData[moduleIndex][ACTION_TYPES.VIEW]) {
              this.rolePermissionArr[moduleId][ACTION_TYPES.VIEW] = true;
            }
            if (this.roleData[moduleIndex][ACTION_TYPES.ADD]) {
              this.rolePermissionArr[moduleId][ACTION_TYPES.ADD] = true;
            }
            if (this.roleData[moduleIndex][ACTION_TYPES.DELETE]) {
              this.rolePermissionArr[moduleId][ACTION_TYPES.DELETE] = true;
            }
            if (this.roleData[moduleIndex][ACTION_TYPES.EDIT]) {
              this.rolePermissionArr[moduleId][ACTION_TYPES.EDIT] = true;
            }

          }
        }
      }
      this.setRolePermissions(this.rolePermissionArr);
    });
  }



  setRolePermissionObj(roleAccessObj: any) {
    const tempRolePermissionArr = [];
    const rolePermissionsArr = roleAccessObj.rolePermissions;
    for (let index = 0; index < rolePermissionsArr.length; index++) {
      tempRolePermissionArr[rolePermissionsArr[index]['moduleId']] = rolePermissionsArr[index];

      if (tempRolePermissionArr[rolePermissionsArr[index]['moduleId']]['uiAccess']) {
        try {
          tempRolePermissionArr[rolePermissionsArr[index]['moduleId']]['uiAccess'] = JSON.parse(tempRolePermissionArr[rolePermissionsArr[index]['moduleId']]['uiAccess']);
        } catch (e) {
          tempRolePermissionArr[rolePermissionsArr[index]['moduleId']]['uiAccess'] = '';
        }
      }
    }
    this.landingModuleId = roleAccessObj['landingModuleId'];
    this.setRolePermissions(tempRolePermissionArr);
  }


  /*method to set the role permissions data*/
  setRolePermissions(rolePermissionsData) {
    try {
      this.sharedData.setRolePermissionData(rolePermissionsData);
      if (!this.landingModuleId) {
        this.landingModuleId = MODULE_ID.dashboard;
      }
      this.setLandingPage(this.landingModuleId);
    } catch (e) { }
  }

  /**
  * Redirect to User specific Landing module
  */
  // setLandingPage(landingModuleId) {
  //   this.menuList.forEach(element => {
  //     if (landingModuleId == element.moduleId) {
  //       this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.landingPage, element.link);
  //       if (this.sessionService.getSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl)) {
  //         this.navigationService.navigateByUrl(this.sessionService.getSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl)).then(() => {
  //           this.spinnerFlag = false;
  //           this.disableButtonFlag = false;
  //         });
  //         this.sessionService.removeSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl);
  //       } else {
  //         this.navigationService.navigate(element.link).then(() => {
  //           this.spinnerFlag = false;
  //           this.disableButtonFlag = false;
  //         });
  //       }
  //     }
  //   });
  // }

  setLandingPage(landingModuleId) {
    this.menuList.forEach(element => {
      if (landingModuleId == element.moduleId) {
        this.navigatoToPage(element);
      } else if (element['submenu']) {
        element['submenu'].forEach(subElement => {
          if (landingModuleId == subElement.moduleId) {
            this.navigatoToPage(subElement);
          }
        });
      }
    });
  }

  navigatoToPage(element) {
    this.sessionService.setLocalStorageItem(LOCAL_STORAGE_CONSTANTS.landingPage, element.link);
    if (this.sessionService.getSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl)) {
      this.navigationService.navigateByUrl(this.sessionService.getSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl)).then(() => {
        this.spinnerFlag = false;
        this.disableButtonFlag = false;
      });
      this.sessionService.removeSessionItem(SESSION_STORAGE_CONSTANTS.redirectUrl);
    } else {
      this.navigationService.navigate(ROUTER_LINKS_FULL_PATH['home']).then(() => {
        this.spinnerFlag = false;
        this.disableButtonFlag = false;
      });
    }
  }


}


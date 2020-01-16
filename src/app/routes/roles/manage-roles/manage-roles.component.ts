import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslatorService } from '@app/core/translator/translator.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageRoles } from './manage-roles';
import { ManageRolesService } from './manage-roles.service';
import { SharedData } from '@app/shared/shared.data';
import { UI_ACCESS_PERMISSION_CONST, ACTION_TYPES, MENU_CONFIG_ALL_MENUS, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { NavigationService, Common } from '@app/common';
import { ManageRolesDataModel } from './manage-roles.data.model';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss'],
  providers: [ManageRoles]
})
export class ManageRolesComponent implements OnInit {
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  uiAccessPermissionsObj: any;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  @ViewChild('classicModal') public classicModal: ModalDirective;
  selectedLanguage: any;
  roleDetailsForm: FormGroup;
  submmitedFormFlag: any;
  editFlag = false;
  roleId: any;
  modulesList = [];
  uiSettings: any;
  serverSettings: any;
  commonLabelsObj: any = {};
  moduleName: any;
  roleDetails: any;
  rolePermissionsArr: any = [];
  moduleId: any;
  moduleAccessId: any;
  renderPage = false;
  showUIAccessJSON = false;
  showserverAccess = false;
  spinnerFlag: boolean = false;
  advancedSettingsSpinnerFlag: boolean = false;
  advancedSettingsRenderPage: boolean = false;
  parentRoles: any[] = [];
  parentRolesDropdownArr: any[] = [];
  rolePermissions: any = [];
  advancedSettings = {
    uiAccess: {},
    serverAccess: {}
  };
  sampleJSON = {
    uiAccess: {},
    serverAccess: {}
  };
  breadcrumbData: any = {
    title: 'roles.labels.roleDetails',
    subTitle: 'roles.labels.addRole',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'roles.labels.role',
      link: ROUTER_LINKS_FULL_PATH['roles']
    },
    {
      text: 'roles.labels.addRole',
      link: ''
    }
    ]
  };

  /**
   * 
   * @param translatorService
   * @param toasterService ToasterService instance
   * @param fb Form builder instance
   * @param route Activated Route class instance
   * @param _route Router class instance
   * @param manageRoles Manage roles class instance
   * @param manageRolesService Manage Roles Service class instance
   * @param sharedData Shared Data class instance
   * @param navigationService NavigationService class instance
   * @param translateService TranslateService class instance
   */
  constructor(
    public translatorService: TranslatorService,
    public toasterService: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _route: Router,
    private manageRoles: ManageRoles,
    private _manageRolesService: ManageRolesService,
    private sharedData: SharedData,
    private translateService: TranslateService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.modulesList = Object.assign([], MENU_CONFIG_ALL_MENUS);
    this.setLocaleObj();
    this.createForm();
    this.getSampleJSON();
    this.route.params.subscribe(params => {
      this.roleId = params['roleId'];
      if (this.roleId) {
        this.editFlag = true;
        this.breadcrumbData.data[2].text = 'roles.labels.editRole';
        this.breadcrumbData.subTitle = 'roles.labels.editRole';
        this.getRoleDetails(this.roleId);
      }
    });
    this.setParentRolesList();
  }
  /*Sets common labels from language jsons*/
  setLocaleObj() {
    this.translateService.get('biddings').subscribe(res => {
      this.commonLabelsObj = res;
    });
  }
  /**
  * set parent roles dropdown list
  */
  setParentRolesList() {
    if (!this.roleId) {
      this.renderPage = false;
    }
    this._manageRolesService.getParentRoles().subscribe((response: any) => {
      if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const parentRoles = response.payload.result;
          this.parentRolesDropdownArr = Common.getMultipleSelectArr(parentRoles, ['id'], ['roleName']);
          this.parentRoles = parentRoles;
        } else {
          this.parentRolesDropdownArr = [];
          this.parentRoles = [];
        }
      } else {
        this.parentRolesDropdownArr = [];
        this.parentRoles = [];
      }
      if (!this.roleId) {
        this.renderPage = true;
      }
    },
      error => {
        this.parentRolesDropdownArr = [];
        this.parentRoles = [];
        if (!this.roleId) {
          this.renderPage = true;
        }
      });
  }
  /*get sample json for role permissions*/
  getSampleJSON() {
    this._manageRolesService.getSampleJSON().subscribe((response: any) => {
      this.sampleJSON.uiAccess = JSON.stringify(response.uiAccess);
      this.sampleJSON.serverAccess = JSON.stringify(response.fieldAccessJson);
    }, (error: any) => {
      this.sampleJSON.uiAccess = {};
      this.sampleJSON.serverAccess = {}
    }
    )
  }

  /**
   * Redirecting to Manage roles screen
   * @param roleId as String of Role Id
   */
  navigateTo() {
    this.navigationService.navigate([ROUTER_LINKS_FULL_PATH['roles']]);
  }

  /*get role details*/
  getRoleDetails(roleId: string) {
    this._manageRolesService.getRoleDetails(roleId).subscribe((responseData: any) => {
      if (responseData && Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        const roleDetails = responseData.payload.result;
        const formRoleDetails = ManageRolesDataModel.getFormDetails(roleDetails);
        this.roleDetails = formRoleDetails;
        this.setFormValues(formRoleDetails);
      } else {
        this.roleDetails = {};
        this.toasterService.error(responseData.header.message);
      }
      this.renderPage = true;
    },
      error => {
        this.roleDetails = {};
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
        this.renderPage = true;
      });
  }
  selectedParentRole(value) {
    if (typeof (value) === 'string') {
      const rolesDataObj = _.find(this.parentRoles, { 'id': value });
      if (rolesDataObj) {
        rolesDataObj.parentId = value ? value : "";
        rolesDataObj.modules = (rolesDataObj.rolePermissions && rolesDataObj.rolePermissions.length > 0) ? rolesDataObj.rolePermissions : [];
        const rolesFormDetails = ManageRolesDataModel.getFormDetails(rolesDataObj);
        const formValues = this.roleDetailsForm.value;
        rolesFormDetails['roleName'] = formValues['roleName'];
        this.setFormValues(rolesFormDetails);
      }
    }
  }
  /*create role details form*/
  createForm() {
    this.roleDetailsForm = this.manageRoles.createRoleDetailsFormGroup();
    this.createModuleFormArr();
  }

  /*create module form array*/
  createModuleFormArr() {
    const modules = this.roleDetailsForm.get('modules') as FormArray;
    modules.controls = [];
    for (let i = 0; i < this.modulesList.length; i++) {
      const moduleGroup = this.manageRoles.createModuleFormGroup();
      moduleGroup.patchValue({
        menu: this.modulesList[i].text,
        moduleId: this.modulesList[i].moduleId,
        subModuleLevel: this.modulesList[i].subModuleLevel,
        canLandingPage: this.modulesList[i].canLandingPage
      });
      modules.push(moduleGroup);
    }
  }

  /**
   * Fetch Form Array instance of modules
   */
  fetchFormArray() {
    return this.roleDetailsForm.get('modules') as FormArray;
  }

  /**
   * Return Form Group of passed formArray instance with passed index value
   * @param formArray as instance of FormArray
   * @param index as Integer used as Index of form array
   */
  fetchFormGroup(formArray, index) {
    return formArray.controls[index] as FormGroup;
  }

  /**
   * Set form Values
   * @param roleDetails as object of role Details
   */
  setFormValues(roleDetails) {
    this.roleDetailsForm.patchValue({
      roleName: roleDetails.roleName,
      parentRole: roleDetails.parentRole,
      landingModuleId: roleDetails.landingModuleId
    });
    const modulesFormArr = this.fetchFormArray();
    const modulesArr = this.setModules(roleDetails.modules);
    for (let moduleIndex = 0; moduleIndex < modulesFormArr.controls.length; moduleIndex++) {
      const moduleFormGroup = this.fetchFormGroup(modulesFormArr, moduleIndex);
      const moduleObj = modulesArr[moduleFormGroup.value.moduleId];
      moduleFormGroup.patchValue({
        id: moduleObj ? moduleObj.id : '',
        roleId: roleDetails.id ? roleDetails.id : '',
        view: moduleObj ? moduleObj.view : false,
        create: moduleObj ? moduleObj.create : false,
        edit: moduleObj ? moduleObj.edit : false,
        delete: moduleObj ? moduleObj.delete : false
      });
    }
  }

  /**
   * Setting role permissions object with moduleId as key and module Data as value
   * @param modules as Array of modules obj
   */
  setModules(modules) {
    const rolePermissionsObj: any = {};
    modules.forEach((data, i) => {
      rolePermissionsObj[data.moduleId] = data;
    });
    return rolePermissionsObj;
  }

  /**
   * Uncheck the check all checkbox if single cell is unchecked
   * @param value as Boolean of checkbox is checked or not
   * @param module as instance of FormGroup as module control group
   * @param controlName as String of Control name
   */
  onChangeRow(value, module: FormGroup, controlName) {
    if (!value) {
      module.controls['checkRow'].setValue(false);
      this.roleDetailsForm.controls[controlName].setValue(false);
    }

  }

  /**
   * Check all control level checkbox as checked by row
   * @param value as Boolean of checkbox is checked or not
   * @param module as instance of FormGroup of module control group
   */
  checkAllRows(value, module: FormGroup) {
    module.patchValue({
      view: this.isLandingPage(module.value.moduleId) ? true : value,
      create: value,
      edit: value,
      delete: value
    });
  }

  /**
   * Check all control level checkbox as checked column wise
   * @param value as Boolean of checkbox is checked or not
   * @param actionName as String getting for dynamically set control name
   */
  checkAllColumns(value, actionName) {
    const modules = this.fetchFormArray();
    for (let i = 0; i < modules.controls.length; i++) {
      const moduleGroup = this.fetchFormGroup(modules, i);
      if (actionName === 'view' && this.isLandingPage(moduleGroup.value.moduleId) && !value) {
        moduleGroup.controls[actionName].setValue(true);
      }
      else {
        moduleGroup.controls[actionName].setValue(value);
      }
    }
  }

  /**
   * Set selected control of module id as Landing Module Id
   * @param value as Boolean of control is selected as landing page or not
   * @param module as FormGroup instance
   */
  setLandingPage(value, module: FormGroup) {
    this.roleDetailsForm.controls['landingModuleId'].setValue(value);
    module.controls['view'].setValue(true);
  }

  /**
   * Check control level module Id is set as Landing page
   * @param moduleId as String
   */
  isLandingPage(moduleId) {
    if (this.roleDetailsForm.controls['landingModuleId'].value === moduleId) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Open Advance Settings modal popup
   * @param module as instance of FormGroup
   */
  openAdvancedSettings(module: FormGroup) {
    this.clearSettings();
    this.moduleId = module.value.moduleId;
    this.moduleName = module.value.menu;
    this.moduleAccessId = module.value.id;
    this.advancedSettings = {
      uiAccess: '',
      serverAccess: ''
    };
    this.getAdvancedSettingsData();
    this.classicModal.show();
  }

  /**
   * Get Advance Settings Details by id
   */
  getAdvancedSettingsData() {
    this.advancedSettingsRenderPage = false;
    this._manageRolesService.getModuleAccessDetails(this.roleId, this.moduleId).subscribe((response: any) => {

      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          const moduleDetails = response.payload.result;
          try {
            this.advancedSettings.uiAccess = moduleDetails.uiAccess ? JSON.stringify(JSON.parse(moduleDetails.uiAccess)) : '';
            this.advancedSettings.serverAccess = moduleDetails.serverAccess ? JSON.stringify(JSON.parse(moduleDetails.serverAccess)) : '';
          } catch (e) {
            console.log(e);
          }
        }
        this.advancedSettingsRenderPage = true;
      } else {
        this.advancedSettings.uiAccess = '';
        this.advancedSettings.serverAccess = '';
      }
    },
      error => {
        this.advancedSettingsRenderPage = true;
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
      });
  }

  /**
   * Save Advance Settings Details
   */
  saveAdvancedSettingsDetails() {
    const formDetails = {
      roleId: this.roleId,
      moduleAccessId: this.moduleAccessId,
      uiAccess: this.advancedSettings.uiAccess ? this.advancedSettings.uiAccess : null,
      serverAccess: this.advancedSettings.serverAccess ? this.advancedSettings.serverAccess :null
    };
    this.advancedSettingsSpinnerFlag = true;
    this._manageRolesService.putModuleAccessDetails(this.roleId, this.moduleId, formDetails).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.toasterService.success(response.header.message);
        this.classicModal.hide();
        this.clearSettings();
      } else {
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
      }
      this.advancedSettingsSpinnerFlag = false;
    },
      error => {
        this.advancedSettingsSpinnerFlag = false;
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
      });
  }

  /**
   * Clear Advance settings for details
   */
  clearSettings() {
    this.advancedSettings.uiAccess = '';
    this.advancedSettings.serverAccess = '';
    this.moduleId = '';
    this.moduleAccessId = '';
  }

  /**
   * Clear form details for changing of language
   */
  clearFormDetails() {
    const modules = this.roleDetailsForm.get('modules') as FormArray;
    modules.controls = [];
    this.roleDetailsForm.reset();
  }

  /**
   * Save Role Details
   */
  saveRoleDetails() {
    this.submmitedFormFlag = true;
    const roleData = this.roleDetailsForm.value;
    if (this.roleDetailsForm.valid) {
      this.spinnerFlag = true;
      this.submmitedFormFlag = false;
      const finalRoleData = ManageRolesDataModel.getWebServiceDetails(roleData);
      if (this.roleId) {
        finalRoleData['parentId'] = this.roleDetails['parentRole'];
        this.updateRoleDetails(finalRoleData);
      } else {
        this.createRole(finalRoleData);
      }
    } else {
      let target;
      for (let index in this.roleDetailsForm.controls) {
        if (!this.roleDetailsForm.controls[index].valid) {
          target = this.roleDetailsForm.controls[index];
          break;
        }
      }
      if (target) {
        this.spinnerFlag = false;
        let el = $('.ng-invalid:not(form):first');
        $('html,body').animate({ scrollTop: (el.offset().top - 100) }, 'slow', () => {
          el.focus();
        });
      }
    }
  }

  /*method to create new freelancer advance */
  createRole(rolesFormData) {
    this._manageRolesService.postData(rolesFormData).subscribe((responseData: any) => {
      if (responseData && Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.roles).then(() => {
          this.toasterService.success(responseData.header.message);
        });
      } else {
        this.toasterService.error(responseData.header.message);
      }
      this.spinnerFlag = false;
    },
      error => {
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
        this.spinnerFlag = false;
      });
  }
  /*method to create new freelancer advance */


  /*method to update existing freelancer advance */
  updateRoleDetails(advanceFormData) {
    this._manageRolesService.putData(advanceFormData, this.roleId).subscribe((responseData: any) => {
      if (responseData && Common.checkStatusCodeInRange(responseData.header.statusCode)) {
        this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.roles).then(() => {
          this.toasterService.success(responseData.header.message);
        });
      } else {
        this.toasterService.error(responseData.header.message);
      }
      this.spinnerFlag = false;
    },
      error => {
        this.toasterService.error(this.commonLabelsObj.errorMessages.error);
        this.spinnerFlag = false;
      });
  }
}

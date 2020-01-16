import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTER_LINKS_FULL_PATH, LOCAL_STORAGE_CONSTANTS, EVENT_TYPES, ACTION_TYPES } from '@app/config';
import { SessionService, Common, NavigationService, TriggerService } from '@app/common';
import { ConfigurationService } from './configuration.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SharedData } from '@app/shared/shared.data';
import { ProjectsData } from '../../../projects.data';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  isClicked = false;
  configTable: any;
  projectId: any;
  configurationData: any;
  configurationForm: any;
  showLoadingFlg = false;
  spinnerFlag = false;
  error: any;
  budgetId: any;
  subscription: Subscription;
  showFloatingBtn: boolean = false;
  pendingRecursive = 0;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  permissionObj: any = {};
  constructor(
    private _configurationService: ConfigurationService,
    private navigationService: NavigationService,
    private toastrService: ToastrService,
    private sharedData: SharedData,
    private projectsData: ProjectsData,
    private fb: FormBuilder,
    private translate: TranslateService,
    private triggerService: TriggerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setPermissionsDetails();
    this.getConfiguration();
    this.createConfigurationTreeForm();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type === EVENT_TYPES.syncWholeProject) {
          this.getConfiguration();
          this.createConfigurationTreeForm();
        }
      }
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showFloatingBtn = Common.isInView($('#fixed-btn')) ? false : true;
  }
  //set module permission details
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.data['moduleID'];
    var modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
  getConfiguration() {
    this.showLoadingFlg = true;
    this._configurationService.getConfigurationData(this.budgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.configurationData = response.payload.results;
          this.createConfigurationTreeArr();
          this.showFloatingBtn = true;
        } else {
          this.configurationData = {};
        }
      } else {
        this.configurationData = {};
      }
      this.showLoadingFlg = false;
    },
      error => {
        this.showLoadingFlg = false;
        this.configurationData = {};
      });
  }
  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.spinnerFlag) {
        this.updateConfigurationDetails();
      }
    }
  }
  createConfigurationTreeForm() {
    this.configurationForm = this.fb.group({
      configurationTreeArr: this.fb.array([])
    });
  }
  createConfigurationTreeArr() {
    const configurationTreeArr = <FormArray>this.configurationForm.get('configurationTreeArr');
    configurationTreeArr.controls = [];
    for (let i = 0; i < this.configurationData.length; i++) {
      const configurationGroup = this.configFormGroup(this.configurationData[i]);
      this.checkAccounts(this.configurationData, i, configurationGroup);
      configurationTreeArr.push(configurationGroup);
    }
  }
  checkAccounts(data, index, configurationGroup) {
    if (data[index].accounts && data[index].accounts.length > 0) {
      const accounts = data[index].accounts;
      const configurationAccountsArr = <FormArray>configurationGroup.get('accounts');
      for (let i = 0; i < accounts.length; i++) {
        const frmGroup = this.configFormGroup(accounts[i]);
        this.checkAccounts(accounts, i, frmGroup);
        configurationAccountsArr.push(frmGroup);
      }
    }
  }
  checkNestedLevelFlag(configurationGroup) {
    const configurationAccountsArr = <FormArray>configurationGroup.get('accounts');
    this.pendingRecursive++;
    for (let i = 0; i < configurationAccountsArr.controls.length; i++) {
      // tslint:disable-next-line:no-shadowed-variable
      const configurationGroup = <FormGroup>configurationAccountsArr.controls[i];
      configurationGroup.controls['showLevel'].setValue(true);
      this.checkNestedLevelFlag(configurationGroup);
      --this.pendingRecursive;
    }
    if (!this.pendingRecursive) {
      return true;
    }
  }

  configFormGroup(data): FormGroup {
    return this.fb.group({
      accounts: this.fb.array([]),
      id: [data.id],
      masterSettingsConfigurationId: [data.masterSettingsConfigurationId],
      projectId: [data.projectId],
      i18n: this.fb.group({
        mappingName: data.i18n && data.i18n.mappingName
      }),
      projectSettingsId: [data.projectSettingsId],
      parent: [data.parent],
      freelancerApplicable: [data.freelancerApplicable],
      vendorApplicable: [data.vendorApplicable],
      locationApplicable: [data.locationApplicable],
      talentApplicable: [data.talentApplicable],
      annualContractRequired: [data.annualContractRequired],
      projectContractRequired: [data.projectContractRequired],
      advancesApplicable: [data.advancesApplicable],
      budgetLine: [data.budgetLine],
      showLevel: [true]
    });
  }
  toggleLevels(levelData: FormGroup, value) {
    let self = this;
    new Promise(function (resolve, reject) {
      levelData.controls['showLevel'].setValue(value);
      if (value) {
        $('.category-plus.category_' + levelData.value.id).hide();
        $('.category-minus.category_' + levelData.value.id).show();
        self.pendingRecursive = 0;
        let isRecursionFinished = self.checkNestedLevelFlag(levelData);
        // if (isRecursionFinished)
        //   resolve(true);
        setTimeout(() => {
          resolve(true);
        }, 50);
      }
      else {
        $('.category-plus.category_' + levelData.value.id).show();
        $('.category-minus.category_' + levelData.value.id).hide();
        setTimeout(() => {
          resolve(true);
        }, 50);
      }

    }).then(function (result) {
      self.onWindowScroll();
    })

  }
  checked(levelFormArray: FormGroup, controlName, value, isRootNode: boolean = true) {
    this.checkUncheckAllChildren(levelFormArray, controlName, value);
    if (!isRootNode) {
      this.checkUncheckAllAnchestors(levelFormArray, controlName, value);
    }
  }

  checkUncheckAllAnchestors(levelFormArray, controlName, value) {
    if (levelFormArray) {
      const group = levelFormArray.parent;
      if (group && group._parent && group._parent.controls[controlName]) {
        const accountsArr = group.value;
        if ((accountsArr.length > 0)) {
          if (value) {
            const obj = {};
            obj[controlName] = false;
            const filteredAccountsArr = _.filter(accountsArr, obj);
            if (filteredAccountsArr.length === 0) {
              group._parent.controls[controlName].setValue(value);
            }
          } else {
            group._parent.controls[controlName].setValue(value);
          }
        }
      }
      this.checkUncheckAllAnchestors(group, controlName, value);
    }
  }
  checkUncheckAllChildren(configurationGroup, controlName, value) {
    const configurationAccountsArr = <FormArray>configurationGroup.get('accounts');
    for (let i = 0; i < configurationAccountsArr.controls.length; i++) {
      // tslint:disable-next-line:no-shadowed-variable
      const configurationGroup = <FormGroup>configurationAccountsArr.controls[i];
      configurationGroup.controls[controlName].setValue(value);
      this.checkUncheckAllChildren(configurationGroup, controlName, value);
    }

  }

  updateConfigurationDetails() {
    const categoriesObj = {
      categories: []
    };
    if (this.configurationForm.value) {
      categoriesObj['categories'] = this.configurationForm.value.configurationTreeArr;
      this.isClicked = true;
      this.spinnerFlag = true;
      this._configurationService.updateConfigurationData(this.budgetId, categoriesObj).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.spinnerFlag = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            // tslint:disable-next-line:max-line-length
            this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]).then(() =>
              this.toastrService.success(responseData.header.message)
            );
          } else {
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.isClicked = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });
    }
  }

  navigateTo() {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectId, this.budgetId])]);
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTER_LINKS_FULL_PATH, ACTION_TYPES } from '@app/config';
import { CustomValidators, Common, SessionService, NavigationService } from '@app/common';
import { ApprovalHierarchyService } from './approval-hierarchy.service';
import { ApprovalData } from './approval-hierarchy.data.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SharedData } from '@app/shared/shared.data';
import { ProjectsData } from '../../../projects.data';

declare var $: any;
@Component({
  selector: 'app-approval-hirerachy',
  templateUrl: './approval-hirerachy.component.html',
  styleUrls: ['./approval-hirerachy.component.scss']
})
export class ApprovalHirerachyComponent implements OnInit {
  projectId: any;
  showMsg: any = [];
  submitApprovalForm = false;
  submitSettlementApprovalForm = false;
  submitVisibiltyForm = false;
  disableButton = false;
  limitMsg = false;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  public approvalForm: FormGroup;
  add_input_error = false;
  submitAdvanceApprovalForm: Boolean = false;
  submitTalentApprovalForm: Boolean = false;
  submitInvoiceApprovalForm: Boolean = false;
  approvalHierarchyForm: FormGroup;
  approvalRoles: any;
  approvalVisibiltyRoles: any;
  approvalVisibiltyUsers: any = [];
  submitTalentInvoiceApprovalForm: Boolean = false;
  approvalDropdown: any;
  approvalUsersDropdown: any;
  approvalVisibiltyUsersDropdown: any;
  approvalVisibiltyRolesDropdown: any;
  approvalArray: FormGroup;
  approvalLevelForm: FormGroup;
  index: any;
  approvalHierarchyData: any;
  approvalFormDetails: any;
  error: any;
  spinnerFlag = false;
  showLoadingFlg = false;
  budgetId: any;
  MODULE_ID: any;
  ACTION_TYPES = ACTION_TYPES;
  uiAccessPermissionsObj: any;
  permissionObj:any={};
  constructor(private fb: FormBuilder,
    private _approvalService: ApprovalHierarchyService,
    private navigationService: NavigationService,
    private sharedData: SharedData,
    private projectsData: ProjectsData,
    private route: ActivatedRoute,
    private toastrService: ToastrService, 
    private translate: TranslateService) { }


  ngOnInit() {
    this.showLoadingFlg = true;
    this.projectId = this.projectsData.projectId;
    this.budgetId = this.projectsData.budgetId;
    this.setPermissionsDetails();
    this.getApprovalDetails();
    this.createApprovalForm();
    this.geRoles();
    this.getVisibilityRoles();

    this.translate.get('common').subscribe(res => {
      this.error = res;
    });

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
  getApprovalDetails() {
    this._approvalService.getApprovalHierarchy(this.budgetId).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.approvalHierarchyData = response.payload.result;
          this.approvalFormDetails = ApprovalData.getApprovalData(this.approvalHierarchyData);
          if (this.approvalFormDetails.approvalHierarchy.length === 0) {
            this.addRole(false, 0, 'approvalHierarchy');
          }
          if (this.approvalFormDetails.projectVisibility.length === 0) {
            this.addVisibility(false);
          }
          //temporarily advance payment approval hierarchy removed so no formgroups added in formarray
          // if (this.approvalFormDetails.advancesApprovalHierarchy.length === 0) {
          //   this.addRole(false, 0, 'advancesApprovalHierarchy');
          // }
          if (this.approvalFormDetails.talentApprovalHierarchy.length === 0) {
            this.addRole(false, 0, 'talentApprovalHierarchy');
          }
          if (this.approvalFormDetails.talentInvoiceApprovalHierarchy.length === 0) {
            this.addRole(false, 0, 'talentInvoiceApprovalHierarchy');
          }
          if (this.approvalFormDetails.invoiceApprovalHierarchy.length === 0) {
            this.addRole(false, 0, 'invoiceApprovalHierarchy');
          }
          if (this.approvalFormDetails.settlementApprovalHierarchy.length === 0) {
            this.addRole(false, 0, 'settlementApprovalHierarchy');
          }
          this.setApprovalHierarchy(this.approvalFormDetails);
        } else {
          this.approvalFormDetails = [];
          this.showLoadingFlg = false;
        }
      }
      else {
        this.approvalFormDetails = [];
        this.showLoadingFlg = false;
      }
    },
      error => {
        this.approvalFormDetails = [];
        this.showLoadingFlg = false;
      });
  }
  setApprovalHierarchy(approvalFormDetails) {
    if (approvalFormDetails.approvalHierarchy && approvalFormDetails.approvalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('approvalHierarchy');
      for (let i = 0; i < approvalFormDetails.approvalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.approvalHierarchy[i].level, 'approvalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.approvalHierarchy[i].role, i, false, 'approvalHierarchy');
        // this.getUsers(approvalFormDetails.approvalHierarchy[i].role, i);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.approvalHierarchy[i].user,
          'startLimit': approvalFormDetails.approvalHierarchy[i].startLimit,
          'endLimit': approvalFormDetails.approvalHierarchy[i].endLimit,
          'role': approvalFormDetails.approvalHierarchy[i].role
        });
      }
    }
    if (approvalFormDetails.talentApprovalHierarchy && approvalFormDetails.talentApprovalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('talentApprovalHierarchy');
      for (let i = 0; i < approvalFormDetails.talentApprovalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.talentApprovalHierarchy[i].level, 'talentApprovalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.talentApprovalHierarchy[i].role, i, false, 'talentApprovalHierarchy');
        // this.getUsers(approvalFormDetails.approvalHierarchy[i].role, i);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.talentApprovalHierarchy[i].user,
          'startLimit': approvalFormDetails.talentApprovalHierarchy[i].startLimit,
          'endLimit': approvalFormDetails.talentApprovalHierarchy[i].endLimit,
          'role': approvalFormDetails.talentApprovalHierarchy[i].role
        });
      }
    }
    if (approvalFormDetails.talentInvoiceApprovalHierarchy && approvalFormDetails.talentInvoiceApprovalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('talentInvoiceApprovalHierarchy');
      for (let i = 0; i < approvalFormDetails.talentInvoiceApprovalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.talentInvoiceApprovalHierarchy[i].level, 'talentInvoiceApprovalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.talentInvoiceApprovalHierarchy[i].role, i, false, 'talentInvoiceApprovalHierarchy');
        // this.getUsers(approvalFormDetails.approvalHierarchy[i].role, i);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.talentInvoiceApprovalHierarchy[i].user,
          'startLimit': approvalFormDetails.talentInvoiceApprovalHierarchy[i].startLimit,
          'endLimit': approvalFormDetails.talentInvoiceApprovalHierarchy[i].endLimit,
          'role': approvalFormDetails.talentInvoiceApprovalHierarchy[i].role
        });
      }
    }
    if (approvalFormDetails.invoiceApprovalHierarchy && approvalFormDetails.invoiceApprovalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('invoiceApprovalHierarchy');
      for (let i = 0; i < approvalFormDetails.invoiceApprovalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.invoiceApprovalHierarchy[i].level, 'invoiceApprovalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.invoiceApprovalHierarchy[i].role, i, false, 'invoiceApprovalHierarchy');
        // console.log(approvalFormDetails.invoiceApprovalHierarchy[i]);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.invoiceApprovalHierarchy[i].user,
          'startLimit': approvalFormDetails.invoiceApprovalHierarchy[i].startLimit,
          'endLimit': approvalFormDetails.invoiceApprovalHierarchy[i].endLimit,
          'role': approvalFormDetails.invoiceApprovalHierarchy[i].role,
        });
      }
    }

    if (approvalFormDetails.settlementApprovalHierarchy && approvalFormDetails.settlementApprovalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('settlementApprovalHierarchy');
      for (let i = 0; i < approvalFormDetails.settlementApprovalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.settlementApprovalHierarchy[i].level, 'settlementApprovalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.settlementApprovalHierarchy[i].role, i, false, 'settlementApprovalHierarchy');
        // console.log(approvalFormDetails.settlementApprovalHierarchy[i]);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.settlementApprovalHierarchy[i].user,
          'role': approvalFormDetails.settlementApprovalHierarchy[i].role,
        });
      }
    }
    // use above when services are ready (siddhant)
    // if (approvalFormDetails.invoiceApprovalHierarchy && approvalFormDetails.invoiceApprovalHierarchy.length > 0) {
    //   const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('settlementApprovalHierarchy');
    //   for (let i = 0; i < approvalFormDetails.invoiceApprovalHierarchy.length; i++) {
    //     this.addRole(false, approvalFormDetails.invoiceApprovalHierarchy[i].level, 'settlementApprovalHierarchy');
    //     this.getApprovalHierarchyUsers(approvalFormDetails.invoiceApprovalHierarchy[i].role, i, false, 'settlementApprovalHierarchy');
    //     console.log(approvalFormDetails.invoiceApprovalHierarchy[i]);
    //     editApprovalArray.controls[i].patchValue({
    //       "user": approvalFormDetails.invoiceApprovalHierarchy[i].user,
    //       'startLimit': approvalFormDetails.invoiceApprovalHierarchy[i].startLimit,
    //       'endLimit': approvalFormDetails.invoiceApprovalHierarchy[i].endLimit,
    //       'role': approvalFormDetails.invoiceApprovalHierarchy[i].role,
    //     });
    //   }
    // }


    if (approvalFormDetails.projectVisibility && approvalFormDetails.projectVisibility.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('projectVisibility');
      for (let i = 0; i < approvalFormDetails.projectVisibility.length; i++) {

        this.addVisibility(false);
        this.getVisibilityUsers(approvalFormDetails.projectVisibility[i].visibilityRole, i);
        editApprovalArray.controls[i].patchValue({
          'visibilityRole': approvalFormDetails.projectVisibility[i].visibilityRole,
          'visibilityUser': approvalFormDetails.projectVisibility[i].visibilityUser
        });
      }
    }
  }
  createApprovalForm() {
    this.approvalHierarchyForm = this.approvalFormGroup();

  }

  approvalFormGroup(): FormGroup {
    return this.fb.group({
      approvalHierarchy: this.fb.array([]),
      // advancesApprovalHierarchy: this.fb.array([]),
      talentApprovalHierarchy: this.fb.array([]),
      talentInvoiceApprovalHierarchy: this.fb.array([]),
      invoiceApprovalHierarchy: this.fb.array([]),
      settlementApprovalHierarchy: this.fb.array([]),
      projectVisibility: this.fb.array([])
    });
  }
  saveApprovalHierarchy() {
    this.submitApprovalForm = true;
    this.submitVisibiltyForm = true;
    this.submitAdvanceApprovalForm = true;
    this.submitSettlementApprovalForm = true;
    this.submitTalentApprovalForm = true;
    this.submitInvoiceApprovalForm = true;
    this.submitTalentInvoiceApprovalForm = true;
    const visibilityArray = <FormArray>this.approvalHierarchyForm.controls['projectVisibility'];
    for (let i = 0; i < visibilityArray.controls.length; i++) {
      if ((visibilityArray.controls[i].value.visibilityRole == '' ||
        visibilityArray.controls[i].value.visibilityRole == null) &&
        visibilityArray.controls.length > 0) {
        visibilityArray.removeAt(i);
        this.approvalVisibiltyUsers.splice(i, 1);
      }

    }
    this.approvalHierarchyForm['projectVisibility'] = visibilityArray;
    // visibilityArray.controls
    if (this.approvalHierarchyForm.valid) {
      //this.approvalHierarchyForm['projectVisibility'] = visibilityArray;
      this.disableButton = true;
      this.spinnerFlag = true;
      const formValueObj = this.approvalHierarchyForm.value;
      const projectVisibilityArr = formValueObj.projectVisibility;
      for (let index = projectVisibilityArr.length - 1; index >= 0; index--) {
        if (!projectVisibilityArr[index]['visibilityRole'] && projectVisibilityArr[index]['visibilityUser'].length == 0) {
          projectVisibilityArr.splice(index, 1);
          this.approvalVisibiltyUsers.splice(index, 1);
        }
      }
      formValueObj['projectVisibility'] = projectVisibilityArr;



      const approvalHierarchyArr = this.approvalHierarchyForm.value.approvalHierarchy;
      const tempHierarchyArr = approvalHierarchyArr;
      for (let index = 0; index < approvalHierarchyArr.length; index++) {
        tempHierarchyArr[index]['level'] = index + 1;
      }
      formValueObj['approvalHierarchyArr'] = tempHierarchyArr;
      // for (let index = 0; index < formValueObj.advancesApprovalHierarchy.length; index++) {
      //   const obj = formValueObj.advancesApprovalHierarchy[index];
      //   obj['level'] = index + 1;
      // }
      for (let index = 0; index < formValueObj.invoiceApprovalHierarchy.length; index++) {
        const obj = formValueObj.invoiceApprovalHierarchy[index];
        obj['level'] = index + 1;
      }
      for (let index = 0; index < formValueObj.talentApprovalHierarchy.length; index++) {
        const obj = formValueObj.talentApprovalHierarchy[index];
        obj['level'] = index + 1;
      }
      for (let index = 0; index < formValueObj.talentInvoiceApprovalHierarchy.length; index++) {
        const obj = formValueObj.talentInvoiceApprovalHierarchy[index];
        obj['level'] = index + 1;
      }
      for (let index = 0; index < formValueObj.settlementApprovalHierarchy.length; index++) {
        const obj = formValueObj.settlementApprovalHierarchy[index];
        obj['level'] = index + 1;
      }
      const finalVendorData = ApprovalData.setApprovalData(formValueObj);
      this._approvalService.updateApprovalHierarchy(finalVendorData, this.budgetId).subscribe((response: any) => {
        const visibilityArray = <FormArray>this.approvalHierarchyForm.controls['projectVisibility'];
        for (let i = 0; i < visibilityArray.controls.length; i++) {
          if ((visibilityArray.controls[i].value.visibilityRole === '' ||
            visibilityArray.controls[i].value.visibilityRole == null) &&
            visibilityArray.controls[i].value.visibilityUser.length === 0) {
            visibilityArray.removeAt(i);
            //this.approvalVisibiltyUsers.splice(i, 1);
          }
        }

        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.createApprovalForm();
          this.geRoles();
          this.getVisibilityRoles();
          this.showLoadingFlg = true;
          this.getApprovalDetails();
          this.toastrService.success(response.header.message);
        } else {
          this.toastrService.error(response.header.message);
        }
        this.spinnerFlag = false;
        this.disableButton = false;
      },
        error => {
          this.disableButton = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });
    }
  }

  // Approval Hierarchy
  approvalLevel(): FormGroup {
    return this.fb.group({
      user: ['', [CustomValidators.required]],
      startLimit: ['', [CustomValidators.required]],
      endLimit: ['', [CustomValidators.required]],
      role: ['', [CustomValidators.required]],
      level: [''],
      usersList: [],
      filteredUsersList: []
    }
      , {
        validator: CustomValidators.checkLimit // your validation method
      });
  }
  approvalLevelForSettlement(): FormGroup {
    return this.fb.group({
      user: ['', [CustomValidators.required]],
      role: ['', [CustomValidators.required]],
      level: [''],
      usersList: [],
      filteredUsersList: []
    });
    // , {
    //   validator: CustomValidators.checkLimit // your validation method
    // });
  }

  approvalLevelForAdvavances(): FormGroup {
    return this.fb.group({
      user: [''],
      role: [''],
      level: [''],
      usersList: [],
      filteredUsersList: []
    });
    // , {
    //   validator: CustomValidators.checkLimit // your validation method
    // });
  }
  // checkLimitRange(item){
  //   if(item.controls['startLimit'].value >= item.controls['endLimit'].value)
  //   this.limitMsg = true;
  //   else
  //   this.limitMsg = false;
  // }
  addRole(checkValidation, index, formArrayName) {
    if (formArrayName === 'approvalHierarchy') {
      this.submitApprovalForm = false;
    }
    if (formArrayName === 'settlementApprovalHierarchy') {
      this.submitSettlementApprovalForm = false;
    }
    if (formArrayName === 'talentApprovalHierarchy') {
      this.submitTalentApprovalForm = false;
    }
    if (formArrayName === 'talentInvoiceApprovalHierarchy') {
      this.submitTalentInvoiceApprovalForm = false;
    }
    if (formArrayName === 'invoiceApprovalHierarchy') {
      this.submitInvoiceApprovalForm = false;
    }
    // if (formArrayName === 'advancesApprovalHierarchy') {
    //   this.submitAdvanceApprovalForm = false;
    // }
    if (formArrayName === 'settlementApprovalHierarchy') {
      this.approvalLevelForm = this.approvalLevelForSettlement();
    } else {
      this.approvalLevelForm = this.approvalLevel();
    }

    // if (formArrayName === 'advancesApprovalHierarchy') {
    //   this.approvalLevelForm = this.approvalLevelForAdvavances();
    // }
    const roleArray = <FormArray>this.approvalHierarchyForm.controls[formArrayName];
    if (checkValidation) {
      const roleFormGrp = roleArray.controls[index];
      if (roleFormGrp.valid) {
        this.approvalLevelForm.controls['level'].setValue(index + 1);
        roleArray.push(this.approvalLevelForm);
      }
      else {
        if (formArrayName === 'approvalHierarchy') {
          this.submitApprovalForm = true;
        }
        if (formArrayName === 'settlementApprovalHierarchy') {
          this.submitSettlementApprovalForm = true;
        }
        if (formArrayName === 'talentApprovalHierarchy') {
          this.submitTalentApprovalForm = true;
        }
        if (formArrayName === 'talentInvoiceApprovalHierarchy') {
          this.submitTalentInvoiceApprovalForm = true;
        }
        if (formArrayName === 'invoiceApprovalHierarchy') {
          this.submitInvoiceApprovalForm = true;
        }
        // if (formArrayName === 'advancesApprovalHierarchy') {
        //   this.submitAdvanceApprovalForm = true;
        // }
      }
    }
    else {
      this.approvalLevelForm.controls['level'].setValue(index);
      roleArray.push(this.approvalLevelForm);
    }

  }
  removeRole(eventIndex, controlName, formGrp: FormGroup) {
    const roleArray = <FormArray>this.approvalHierarchyForm.controls[controlName];
    const userId = formGrp.value.user;
    const role = formGrp.value.role;
    roleArray.removeAt(eventIndex);
    for (let i = 0; i < roleArray.length; i++) {
      const formGroup = <FormGroup>roleArray.controls[i];
      if (role === formGroup.value.role) {
        const users: any = JSON.parse(JSON.stringify(formGroup.value.usersList));
        const filteredUsers: any = formGroup.value.filteredUsersList;
        const user = _.find(users, { 'id': userId });
        filteredUsers.push(user);
        formGroup.controls['filteredUsersList'].setValue(filteredUsers);
      }

    }

  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.spinnerFlag && !this.showLoadingFlg) {
        this.saveApprovalHierarchy();
      }
    }
  }
  geRoles() {
    this._approvalService.getRoles().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.approvalDropdown = response.payload.results;
          this.approvalDropdown.forEach(obj => {
            obj['name'] = obj['roleName'];
          });
          this.approvalRoles = Common.getMultipleSelectArr(this.approvalDropdown, ['id'], ['name']);
        } else {
          this.approvalRoles = [];
        }
      } else {
        this.approvalRoles = [];
      }
    }, error => {
      this.approvalRoles = [];
    });
  }
  removedRole(item: FormGroup) {
    item.controls['usersList'].setValue([]);
    item.controls['filteredUsersList'].setValue([]);
  }
  removedVissibilityRole(index) {
    this.approvalVisibiltyUsers[index] = [];
  }
  getApprovalHierarchyUsers(roleID, i, canfilter, controlName) {
    const editApprovalArray = <FormArray>this.approvalHierarchyForm.get(controlName);
    const formGrp = <FormGroup>editApprovalArray.controls[i];
    this._approvalService.getUserData(roleID).subscribe((response: any) => {
      this.showLoadingFlg = false;
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {

          const users = response.payload.results;
          let approvalUsersDropdown = users;
          if (canfilter) {
            approvalUsersDropdown = this.filterApprovalHierarchyUsers(roleID, users, controlName);
          }
          formGrp.controls['usersList'].setValue(Common.getMultipleSelectArr(users, ['id'], ['i18n', 'displayName']));
          // tslint:disable-next-line:max-line-length
          formGrp.controls['filteredUsersList'].setValue(Common.getMultipleSelectArr(approvalUsersDropdown, ['id'], ['i18n', 'displayName']));
        } else {
          formGrp.controls['usersList'].setValue([]);
          formGrp.controls['filteredUsersList'].setValue([]);
        }
      } else {
        formGrp.controls['usersList'].setValue([]);
        formGrp.controls['filteredUsersList'].setValue([]);
      }
    }, error => {
      formGrp.controls['usersList'].setValue([]);
      formGrp.controls['filteredUsersList'].setValue([]);
      this.showLoadingFlg = false;
    });
  }
  // Approval Hierarchy
  filterApprovalHierarchyUsers(roleID, approvalHierarchyUsers, controlName) {
    const users = [];
    const advancesApprovalHierarchy = this.approvalHierarchyForm.value[controlName];
    const filteredUsersWithSameRole = _.filter(advancesApprovalHierarchy, { 'role': roleID });
    const userIdsArr = _.map(filteredUsersWithSameRole, 'user');
    approvalHierarchyUsers.forEach((obj, index) => {
      if (!userIdsArr.includes(obj.id)) {
        users.push(obj);
      }
    });
    return users;
  }
  userChanged(value, controlName) {
    const currencyConversionArr = <FormArray>this.approvalHierarchyForm.get(controlName);
    for (let i = 0; i < currencyConversionArr.length; i++) {
      const formGroup = <FormGroup>currencyConversionArr.controls[i];
      if (value !== formGroup.value.user) {
        const users: any = JSON.parse(JSON.stringify(formGroup.value.filteredUsersList));
        _.remove(users, { 'id': value });
        formGroup.controls['filteredUsersList'].setValue(users);
      }

    }
  }
  // Project Visibility
  projectVisibilityLevel(): FormGroup {
    return this.fb.group({
      visibilityRole: [''],
      visibilityUser: ['']
    });
  }
  addVisibility(checkValidation, index = 0) {
    this.submitVisibiltyForm = false;
    const visibilityArray = <FormArray>this.approvalHierarchyForm.controls['projectVisibility'];
    if (checkValidation) {
      // let visibilityFormGrp = visibilityArray.controls[index];
      if (this.approvalHierarchyForm.value.projectVisibility[index].visibilityRole !== '' &&
        this.approvalHierarchyForm.value.projectVisibility[index].visibilityRole != null) {
        this.showMsg[index] = false;
        visibilityArray.push(this.projectVisibilityLevel());
      }
      else {
        this.showMsg[index] = true;
        this.submitVisibiltyForm = true;
      }
    }
    else {
      visibilityArray.push(this.projectVisibilityLevel());
    }

  }
  removeVisibility(eventIndex) {
    const visibilityArray = <FormArray>this.approvalHierarchyForm.controls['projectVisibility'];
    visibilityArray.removeAt(eventIndex);
    this.approvalVisibiltyUsers.splice(eventIndex, 1);
  }
  getVisibilityRoles() {
    this._approvalService.getVisibilityRolesData().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.approvalVisibiltyRolesDropdown = response.payload.results;
          this.approvalVisibiltyRolesDropdown.forEach(obj => {
            obj['name'] = obj['name'];
          });
          this.approvalVisibiltyRoles = Common.getMultipleSelectArr(this.approvalVisibiltyRolesDropdown, ['id'], ['name']);
        } else {
          this.approvalVisibiltyRoles = [];
        }
      } else {
        this.approvalVisibiltyRoles = [];
      }
    },
      error => {
        this.approvalVisibiltyRoles = [];
      });
  }
  getVisibilityUsers(roleID, i) {
    if (!this.approvalVisibiltyUsers[i]) {
      this.approvalVisibiltyUsers[i] = [];
    }
    this.showMsg[i] = false;
    this._approvalService.getUserData(roleID).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.approvalVisibiltyUsersDropdown = response.payload.results;
          this.approvalVisibiltyUsersDropdown.forEach(obj => {
            obj['name'] = obj['i18n']['displayName'];
          });
          this.approvalVisibiltyUsers[i] = Common.getMultipleSelectArr(this.approvalVisibiltyUsersDropdown, ['id'], ['name']);
        } else {
          this.approvalVisibiltyUsers[i] = [];
        }
      } else {
        this.approvalVisibiltyUsers[i] = [];
      }
    },
      error => {
        this.approvalVisibiltyUsers[i] = [];
      });
  }

  // Project Visibility
  navigateTo() {
    this.navigationService.navigate([Common.sprintf(ROUTER_LINKS_FULL_PATH.purchaseOrder, [this.projectsData.projectId, this.budgetId])]);
  }
}

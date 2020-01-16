import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Common, CustomValidators } from '@app/common';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ROUTER_LINKS, ROUTER_LINKS_FULL_PATH } from '@app/config/routing.config';
import { BIDDING_ROUTER_LINKS_FULL_PATH } from '../Constants';
import * as _ from 'lodash';
import { BiddingApprovalHierarchyService } from './bid-approval-hierarchy.service';
import { BidApprovalData } from './bid-approval.data.model';
import { ToastrService } from 'ngx-toastr';
import { ManageBidData } from '../manage-bid/manage-bid.data';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-bid-approval-hierarchy',
  templateUrl: './bid-approval-hierarchy.component.html',
  styleUrls: ['./bid-approval-hierarchy.component.scss']
})
export class BidApprovalHierarchyComponent implements OnInit, OnDestroy {
  // breadcrumbs dataROUTER_LINKS = ROUTER_LINKS;
  public approvalHierarchyForm: FormGroup;
  mangeBidBreadcrumbData: any;
  approvalLevelForm: FormGroup;
  showLoadingFlg: Boolean = false;
  isBiddingListParentPath: Boolean = false;
  disableButton: Boolean = false;
  submitApprovalForm: Boolean = false;
  spinnerFlag: Boolean = false;
  breadcrumbData: any = {};
  bidListBreadcrumbData: any = {
    title: 'biddings.labels.biddingList',
    subTitle: 'biddings.labels.biddingListSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'biddings.labels.biddingListTitle',
      link: ROUTER_LINKS_FULL_PATH['bids']
    },
    {
      text: 'biddings.labels.approvalHierarchy',
      link: ''
    }
    ]
  };
  projectId: any;
  approvalDropdown: any;
  approvalRoles: any[];
  approvalHierarchyData: any;
  approvalFormDetails: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    @Optional() public manageBidData: ManageBidData,
    private _approvalService: BiddingApprovalHierarchyService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.showLoadingFlg = true;
    this.route.parent.parent.params.subscribe(params => {
      this.projectId = params.id;
    });
    this.createApprovalForm();
    this.approvalFormGroup();
    this.mangeBidBreadcrumbData = {
      title: 'biddings.labels.viewBid',
      subTitle: 'biddings.labels.viewBidSubtitle',
      data: [{
        text: 'common.labels.home',
        link: '/'
      },
      {
        text: 'biddings.labels.biddingListTitle',
        link: ROUTER_LINKS.bidding
      },
      {
        text: 'biddings.labels.manageBid',
        link: Common.sprintf(BIDDING_ROUTER_LINKS_FULL_PATH.manageBid, [this.projectId])
      },
      {
        text: 'biddings.labels.approvalHierarchy',
        link: ''
      }]
    };
    $('#manage-bid').hide();
    this.route.params.subscribe(params => {
      this.isBiddingListParentPath = this.route.snapshot.parent.data['isBiddingList'];
      this.breadcrumbData = this.isBiddingListParentPath ? this.bidListBreadcrumbData : this.mangeBidBreadcrumbData;
    });
    this.setPageDetails();
  }

  /**
   * OnDestroy lifecycle hook
   */
  ngOnDestroy() {
    $('#manage-bid').show();
  }
   /**
   * Sets dafault page details
   */
  setPageDetails() {
    this.showLoadingFlg = true;
    const combined = Observable.forkJoin(
      this._approvalService.getRoles(),
      this._approvalService.getApprovalHierarchy(this.projectId)
    );
    combined.subscribe((latestValues: any) => {
      let rolesResponse: any = latestValues[0];
      let approvalDetailsResponse: any = latestValues[1];
      if (Common.checkStatusCodeInRange(rolesResponse.header.statusCode)) {
        if (rolesResponse.payload && rolesResponse.payload.results) {
          this.approvalDropdown = rolesResponse.payload.results;
          this.approvalRoles = Common.getMultipleSelectArr(this.approvalDropdown, ['id'], ['name']);
        } else {
          this.approvalRoles = [];
        }
      } else {
        this.approvalRoles = [];
      }
      if (Common.checkStatusCodeInRange(approvalDetailsResponse.header.statusCode)) {
        if (approvalDetailsResponse.payload && approvalDetailsResponse.payload.result && !Common.isEmptyObject(approvalDetailsResponse.payload.result)) {
          this.approvalFormDetails = BidApprovalData.getApprovalData(approvalDetailsResponse.payload.result.approvalHierarchy);
          if (this.approvalFormDetails.bidApprovalHierarchy && this.approvalFormDetails.bidApprovalHierarchy.length === 0) {
            this.addRole(false, 0, 'bidApprovalHierarchy');
            this.approvalFormDetails = [];
            this.showLoadingFlg = false;
          } else {
            this.setApprovalHierarchy(this.approvalFormDetails);
          }
        } else {
          this.approvalFormDetails = [];
          this.showLoadingFlg = false;
          this.addRole(false, 0, 'bidApprovalHierarchy');
        }
      }
      else {
        this.approvalFormDetails = [];
        this.showLoadingFlg = false;
        this.addRole(false, 0, 'bidApprovalHierarchy');

      }
    },
      error => {
        this.approvalFormDetails = [];
        this.showLoadingFlg = false;
        this.addRole(false, 0, 'bidApprovalHierarchy');

      })
  }

  /**
   * Creates approval hierarchy form
   */
  createApprovalForm() {
    this.approvalHierarchyForm = this.approvalFormGroup();

  }

  /**
   * Creates approval hierarchy form group
   */
  approvalFormGroup(): FormGroup {
    return this.fb.group({
      bidApprovalHierarchy: this.fb.array([]),
    });
  }

  /**
   * Navigates conditionally to Manage bid screen or Deals list
   */
  navigateTo() {
    if (this.isBiddingListParentPath) {
      this.router.navigate([ROUTER_LINKS_FULL_PATH.bids]);
    } else {
      this.manageBidData.navigateToEitherBasicInfoOrPassesTab();
    }
  }

  /**
   * Gets role dropdown data
   */
  geRoles() {

    this._approvalService.getRoles().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.approvalDropdown = response.payload.results;
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

  /**
   * Gets users on role selection
   * @param roleID as Roel Id
   * @param i as form array index
   * @param canfilter as filter flag
   * @param controlName as dynamic form control name
   */
  getApprovalHierarchyUsers(roleID, i, canfilter, controlName, arrLength?: number) {
    if (typeof (roleID) == "string") {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get(controlName);
      const formGrp = <FormGroup>editApprovalArray.controls[i];
      this._approvalService.getUserData(roleID).subscribe((response: any) => {
        if ((i == (arrLength - 1))) {
          this.showLoadingFlg = false;
        }
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
  }

  /**
   * Filters repeating users in the approval hierarchy selection
   * @param roleID as Role Id for which the users need to be filtered
   * @param approvalHierarchyUsers as users from the already selected users
   * @param controlName as dynamic form control name
   */
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

  /**
   * Sets saved approval hierarchy
   * @param approvalFormDetails as saved approval details
   */
  setApprovalHierarchy(approvalFormDetails) {
    if (approvalFormDetails && approvalFormDetails.bidApprovalHierarchy && approvalFormDetails.bidApprovalHierarchy.length > 0) {
      const editApprovalArray = <FormArray>this.approvalHierarchyForm.get('bidApprovalHierarchy');
      for (let i = 0; i < approvalFormDetails.bidApprovalHierarchy.length; i++) {
        this.addRole(false, approvalFormDetails.bidApprovalHierarchy[i].level, 'bidApprovalHierarchy');
        this.getApprovalHierarchyUsers(approvalFormDetails.bidApprovalHierarchy[i].role, i, false, 'bidApprovalHierarchy', approvalFormDetails.bidApprovalHierarchy.length);
        editApprovalArray.controls[i].patchValue({
          'user': approvalFormDetails.bidApprovalHierarchy[i].user,
          'role': approvalFormDetails.bidApprovalHierarchy[i].role,
        });
      }
    }
  }

  /**
   * FIlters users if role changed
   * @param value as changed role
   * @param controlName as dynamic form control name
   */
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
  /**
   * Approval hierachy form group which is needed to push in form array
   */
  approvalLevelForbid(): FormGroup {
    return this.fb.group({
      user: ['', [CustomValidators.required]],
      role: ['', [CustomValidators.required]],
      level: [''],
      usersList: [],
      filteredUsersList: []
    });
  }

  /**
   * Adds approval hirarchy form control in from array
   * @param checkValidation as check form control validity
   * @param index as at which index control needs to be added
   * @param formArrayName as in which form array control needs to be added
   */
  addRole(checkValidation, index, formArrayName) {
    this.submitApprovalForm = false;
    this.approvalLevelForm = this.approvalLevelForbid();
    const roleArray = <FormArray>this.approvalHierarchyForm.controls[formArrayName];
    if (checkValidation) {
      const roleFormGrp = roleArray.controls[index];
      if (roleFormGrp.valid) {
        this.approvalLevelForm.controls['level'].setValue(index + 1);
        roleArray.push(this.approvalLevelForm);
      }
      else {
        this.submitApprovalForm = true;
      }
    }
    else {
      this.approvalLevelForm.controls['level'].setValue(index);
      roleArray.push(this.approvalLevelForm);
    }

  }

  /**
   * Adds approval hirarchy form control in from array
   * @param eventIndex as at which index control needs to be removed
   * @param controlName as which form control is needed to be removed
   * @param formGrp as from which form group form control is needed to be removed
   */
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
   * Saves Bid approval hierarchy
   */
  saveBidApprovalHeirarchy() {
    this.submitApprovalForm = true;
    if (this.approvalHierarchyForm.valid) {
      this.disableButton = true;
      this.spinnerFlag = true;
      const formValueObj = this.approvalHierarchyForm.value;
      for (let index = 0; index < formValueObj.bidApprovalHierarchy.length; index++) {
        const obj = formValueObj.bidApprovalHierarchy[index];
        obj['level'] = index;
      }
      const finalVendorData = BidApprovalData.setApprovalData(formValueObj);
      this._approvalService.updateApprovalHierarchy(finalVendorData, this.projectId).subscribe((response: any) => {
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
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
        });
    }
  }
}

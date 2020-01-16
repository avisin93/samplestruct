import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedData } from '@app/shared/shared.data';
import { ROLES_CONST, LOCAL_STORAGE_CONSTANTS } from '@app/config';
import { SessionService, Common } from '@app/common';
import { ProjectAssignmentService } from './project-assignment.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../../../projects.data';

declare var $: any;

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  projectId: any;
  userInfo: any;
  palFileUrl: any = "";
  projectContractId: any;
  commonLabelObj: any;
  projectAssignmentDetails: any = [];
  showPALFlag: boolean = true;
  showSubmitBtn: boolean = true;
  showLoadingFlg: boolean = false;
  isAccepted: boolean = false;
  showAcceptanceErrorMsg: boolean = false;
  disableButtonFlag: boolean = false;
  showSpinnerFlag: boolean = false;
  submittedFlag: boolean = false;
  constructor(private sharedData: SharedData,
    private _projectAssignmentService: ProjectAssignmentService,
    private toastrService: ToastrService,
    private projectsData: ProjectsData,
    private sessionService: SessionService, private translate: TranslateService) { }

  ngOnInit() {
    Common.scrollTOTop();
    this.projectId = this.projectsData.projectId;
    this.userInfo = this.sharedData.getUsersInfo();
    if (this.userInfo) {
      if (this.userInfo.rolesArr && ((this.userInfo.rolesArr.includes(ROLES_CONST.freelancer) || (this.userInfo.rolesArr.includes(ROLES_CONST.vendor))))) {
        this.getProjectAssignment();
      }
    }
    this.translate.get('common').subscribe(res => {
      this.commonLabelObj = res;
    });
  }
  getProjectAssignment() {
    this.showLoadingFlg = true;
    this._projectAssignmentService.getProjectAssignment(this.projectId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        this.showLoadingFlg = false;
        if (response.payload && response.payload.result) {
          this.projectAssignmentDetails = response.payload.result;
          let fileObj = this.projectAssignmentDetails.file;
          this.palFileUrl = (fileObj && fileObj.fileUrl) ? fileObj.fileUrl : "";
          this.projectContractId = this.projectAssignmentDetails.id;
          if (this.projectAssignmentDetails.acceptTerms) {
            this.showSubmitBtn = false;
            $("#termsAndConditionsCheck").attr("checked", "checked");
            $("#termsAndConditionsCheck").attr("disabled", true);
          }

          this.showPALFlag = true;
        } else {
          this.projectAssignmentDetails = [];
          this.showPALFlag = false;
          this.toastrService.error(response.header.message);
        }
      } else {
        this.projectAssignmentDetails = [];
        this.showLoadingFlg = false;
        this.showPALFlag = false;
        this.toastrService.error(response.header.message);
      }
    },
      error => {
        this.projectAssignmentDetails = [];
        this.showLoadingFlg = false;
        this.showPALFlag = false;
        if (this.commonLabelObj && this.commonLabelObj.errorMessages && this.commonLabelObj.errorMessages.error) {
          this.toastrService.error(this.commonLabelObj.errorMessages.error);
        }
      });
  }
  termsAndConditionsAccepted(value) {
    this.isAccepted = value;
    this.showAcceptanceErrorMsg = !this.isAccepted;
  }
  palAccepted() {
    this.submittedFlag = true;
    if (this.isAccepted) {
      this.submittedFlag = false;
      this.showAcceptanceErrorMsg = false;
      this.disableButtonFlag = true;
      this.showSpinnerFlag = true;
      this._projectAssignmentService.putData(this.projectContractId, {}).subscribe((response: any) => {
        this.disableButtonFlag = false;
        this.showSpinnerFlag = false;
        if (Common.checkStatusCodeInRange(response.header.statusCode)) {
          $("#termsAndConditionsCheck").attr('disabled', true);
          this.showSubmitBtn = false;
          this.toastrService.success(response.header.message);
        }
        else {
          $("#termsAndConditionsCheck").attr("disabled", false);
          this.toastrService.error(response.header.message);
        }
      },
        error => {
          $("#termsAndConditionsCheck").attr("disabled", false);
          this.disableButtonFlag = false;
          this.showSpinnerFlag = false;
          this.toastrService.error(this.commonLabelObj.errorMessages.responseError);
        });
    } else {
      this.showAcceptanceErrorMsg = true;
    }

  }
}

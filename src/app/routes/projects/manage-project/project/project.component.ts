import { Component, OnInit, HostListener } from '@angular/core';
import {
  ROUTER_LINKS_FULL_PATH, LOCAL_STORAGE_CONSTANTS, PROJECT_DIVISION,
  EVENT_TYPES, PROJECT_TYPES, ROLES_CONST, COOKIES_CONSTANTS, UI_ACCESS_PERMISSION_CONST, ACTION_TYPES
} from '../../../../config';
import { Common, SessionService, NavigationService, TriggerService, CustomValidators } from '../../../../common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '../../../../shared/shared.data';
import { SharedService } from '../../../../shared/shared.service';
import { ProjectService } from './project.service';
import { ManageProjectData } from './project.data.model';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsData } from '../../projects.data';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  PROJECT_TYPES = PROJECT_TYPES;
  isClicked: Boolean = false;
  UI_ACCESS_PERMISSION_CONST = UI_ACCESS_PERMISSION_CONST;
  isDocSaveClicked: Boolean = false;
  projectDetails: any;
  showManageDocumentPanel: Boolean = false;
  projectId: any;
  disableButton: Boolean = false;
  projectType: any;
  projectDetailsForm: any;
  showProducerControl: Boolean = false;
  showDirectorControl: Boolean = false;
  logo1Control: Boolean = false;
  logo2Control: Boolean = false;
  logo3Control: Boolean = false;
  commonLabelsObj: any;
  data: any = [];
  multipleDocumentUpload: any = [];
  submmitedOtherDocFlag: Boolean = false;
  userInfo: any;
  disableButtonFlag: Boolean = false;
  spinnerFlag: Boolean = false;
  subscription: Subscription;
  // projectTypesKeyArr: any = Common.keyValueDropdownArr(PROJECT_DIVISION, 'id', 'text');
  projectTypesKeyArr: any;
  permissionObj: any={};
  MODULE_ID: any;
  uiAccessPermissionsObj: any;
  ACTION_TYPES=ACTION_TYPES;
  constructor(private sharedData: SharedData,
    private _projectService: ProjectService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private triggerService: TriggerService,
    private projectsData: ProjectsData,
    private toastrService: ToastrService, private translate: TranslateService) { }

  ngOnInit() {
    const projectData: any = this.projectsData.getProjectsData();
    if (projectData) {
      this.projectType = projectData.type;
    }
    this.projectId = this.projectsData.projectId;
    this.userInfo = this.sharedData.getUsersInfo();
    this.createForm();
    this.getTranslatedLabels();
    this.getProjectDetails();
    this.subscription = this.triggerService.getEvent().subscribe((data) => {
      if (data.event) {
        if (data.event.type && (data.event.type === EVENT_TYPES.projectDetailsEvent)) {
          this.getProjectDetails();
        }
        //  else if (data.event.type && (data.event.type === EVENT_TYPES.syncWholeProject)) {
        //   projectData = this.projectsData.getProjectsData();
        //   if (projectData) {
        //     this.projectType = projectData.type;
        //   }
        //   this.projectId = this.projectsData.projectId;
        //   this.getProjectDetails();
        // }
      }
    });

    this.translate.get('common').subscribe(res => {
      this.commonLabelsObj = res;
    });
    this.setPermissionsDetails();
  }


  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.disableButton && !this.isClicked) {
        if (this.showManageDocumentPanel) {
          if (!this.disableButtonFlag && !this.isDocSaveClicked) {
            this.updateDocumentsData();
          }
        } else {
          this.updateProjectsData();
        }
      }
    }
  }
  getProjectDetails() {
    const projectDetails: any = this.projectsData.projectsDetails;
    if (projectDetails) {
      this.projectDetails = ManageProjectData.getProjectFormDetails(projectDetails);
      this.setFormValues(this.projectDetails);
    }
  }

  getTranslatedLabels() {
    this.projectTypesKeyArr = Common.changeDropDownValues(this.translate, PROJECT_DIVISION);
    this.projectTypesKeyArr = Common.keyValueDropdownArr(this.projectTypesKeyArr, 'id', 'text');
  }
  createForm() {
    this.projectDetailsForm = this.fb.group({
      logo1Url: [''],
      logo2Url: [''],
      logo3Url: [''],
      logo1Id: [''],
      logo2Id: [''],
      logo3Id: [''],
      logo1Name: [''],
      logo2Name: [''],
      logo3Name: [''],
      director: [''],
      foreignProducer: [''],
      projectType: [''],
      // loader1:[false],
      // loader2:[false],
      // loader3:[false],

      projectDocuments: this.fb.array([])
    });
  }
  setFormValues(projectDetails) {
    this.projectDetailsForm.patchValue({
      logo1Url: projectDetails.logo1Url,
      logo2Url: projectDetails.logo2Url,
      logo3Url: projectDetails.logo3Url,
      logo1Id: projectDetails.logo1Id,
      logo2Id: projectDetails.logo2Id,
      logo3Id: projectDetails.logo3Id,
      logo1Name: projectDetails.logo1Name,
      logo2Name: projectDetails.logo2Name,
      logo3Name: projectDetails.logo3Name,
      director: projectDetails.director,
      foreignProducer: projectDetails.foreignProducer,
      projectType: projectDetails.projectType
    });
    const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.get('projectDocuments');
    projectDocumentsControlArray.controls = [];
    if (projectDetails.projectDocuments && projectDetails.projectDocuments.length > 0) {
      for (let i = 0; i < projectDetails.projectDocuments.length; i++) {
        this.addDocument();
        this.multipleDocumentUpload[i] = true;
        const frmGroup = <FormGroup>projectDocumentsControlArray.controls[i];
        frmGroup.controls['name'].setValidators([CustomValidators.required]);
        frmGroup.patchValue({
          'name': projectDetails.projectDocuments[i].name,
          'fileName': projectDetails.projectDocuments[i].fileName,
          'url': projectDetails.projectDocuments[i].url,
          'fileId': projectDetails.projectDocuments[i].fileId
        });
      }
    }
    else {
      this.addDocument();
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    this.checkFileUploadingStatus();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkFileUploadingStatus() {
    if (this.multipleDocumentUpload.length > 0 && this.disableButtonFlag) {
      let disableButtonFlag = false;
      for (let index = 0; index < this.multipleDocumentUpload.length; index++) {
        if (!this.multipleDocumentUpload[index]) {
          this.disableButtonFlag = true;
          disableButtonFlag = true;
          break;
        }
      }
      // if (disableButtonFlag) {
      //   break;
      // }
      if (!disableButtonFlag) {
        this.disableButtonFlag = false;
      }
    }
  }
  discardAndToggleDocumentsData() {
    this.discardDocumentsData();
    this.showManageDocumentPanel = !this.showManageDocumentPanel;
  }
  discardDocumentsData() {
    if (this.projectDetails.projectDocuments && this.projectDetails.projectDocuments.length > 0) {
      const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.get('projectDocuments');
      projectDocumentsControlArray.controls = [];
      for (let i = 0; i < this.projectDetails.projectDocuments.length; i++) {
        this.addDocument();
        this.multipleDocumentUpload[i] = true;
        const frmGroup = <FormGroup>projectDocumentsControlArray.controls[i];
        frmGroup.controls['name'].setValidators([CustomValidators.required]);
        frmGroup.patchValue({
          'name': this.projectDetails.projectDocuments[i].name,
          'fileName': this.projectDetails.projectDocuments[i].fileName,
          'url': this.projectDetails.projectDocuments[i].url,
          'fileId': this.projectDetails.projectDocuments[i].fileId
        });
      }
    }
    else {
      const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.get('projectDocuments');
      projectDocumentsControlArray.controls = [];
      projectDocumentsControlArray.setValue([]);
      this.addDocument();
    }

  }
  addDocument() {
    const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.controls['projectDocuments'];
    projectDocumentsControlArray.push(this.getDocumentFormGroup());
    this.multipleDocumentUpload[projectDocumentsControlArray.length - 1] = true;
  }
  removeDocument(index) {
    if ( this.projectDetailsForm.value['projectDocuments'].length > 1 && !this.disableButtonFlag) {
      const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.controls['projectDocuments'];
      projectDocumentsControlArray.removeAt(index);
    }

  }
  getDocumentFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      url: [''],
      fileName: [''],
      fileId: [''],
      showLoader: [false]
    });
  }
  fileChangeListener(event, type, control) {
    this.disableButton = true;
    if (event.target.files[0]) {
      const file: File = event.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'image/png') {
        this.uploadFile(file, type, control);
        event.target.value = '';
      }
      else {
        event.target.value = '';
        this.toastrService.error(this.commonLabelsObj.errorMessages.invalidFileType);
      }
    }
  }
  fileChangeEvent(event, type, control) {
    this.disableButton = true;
    if (!this.multipleDocumentUpload) {
      this.multipleDocumentUpload = [];
    }
    if (!this.multipleDocumentUpload[control]) {
      this.multipleDocumentUpload[control] = false;
    }
    this.multipleDocumentUpload[control] = false;


    this.disableButtonFlag = true;
    if (event.target.files[0]) {
      const file: File = event.target.files[0];
      // tslint:disable-next-line:max-line-length
      if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/bmp' || file.type == 'image/png' || file.type == 'image/gif') {
        event.target.value = '';
        this.toastrService.error(this.commonLabelsObj.errorMessages.invalidFileType);
        this.multipleDocumentUpload[control] = true;
      }
      else {
        this.uploadFile(file, type, control);
        event.target.value = '';
      }
    }
  }
  uploadFile(file, type, control) {
    const formData = Common.setFormData(file);
    const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.controls['projectDocuments'];
    const projectDocumentFrmGrp = <FormGroup>projectDocumentsControlArray.controls[control];
    if (type == 'document') {
      projectDocumentFrmGrp.controls['showLoader'].setValue(true);
    }
    this._sharedService.uploadFile(formData).subscribe((imageResponse: any) => {
      if (Common.checkStatusCodeInRange(imageResponse.header.statusCode)) {
        if (imageResponse.payload && imageResponse.payload.result) {
          this.data = imageResponse.payload.result;
          this.setUploadedData(type, control, this.data);
          this.disableButton = false;
        } else {
          this.data = [];
        }
      } else {
        this.data = [];
        this.toastrService.error(imageResponse.header.message);
        if (type == 'document') {
          projectDocumentFrmGrp.controls['showLoader'].setValue(false);
        }
      }
    },
      error => {
        this.toastrService.error(this.commonLabelsObj.errorMessages.responseError);
        if (type == 'document') {
          projectDocumentFrmGrp.controls['showLoader'].setValue(false);
        }
      });
  }
  documentNameChanged(projectDocumentFrmGrp: FormGroup) {
    if (projectDocumentFrmGrp.value.name) {
      projectDocumentFrmGrp.controls['fileId'].setValidators([CustomValidators.required]);
    }
    else {
      projectDocumentFrmGrp.controls['fileId'].setValidators([]);
    }
    projectDocumentFrmGrp.controls['fileId'].updateValueAndValidity();
  }
  updateDocumentsData() {
    const formValue = this.projectDetailsForm.value;
    const projectDocumentsData = {};
    this.submmitedOtherDocFlag = true;
    const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.controls['projectDocuments'];
    if (projectDocumentsControlArray.valid) {
      this.isDocSaveClicked = true;
      this.spinnerFlag = true;
      const projectDetailsData = ManageProjectData.getWebServiceDetails(formValue);
      projectDocumentsData['projectDocuments'] = projectDetailsData['projectDocuments'];
      projectDocumentsData['id'] = this.projectId;
      this._projectService.updateOtherDocumentsData(this.projectId, projectDocumentsData).
        subscribe((responseData: any) => {
          this.isDocSaveClicked = false;
          this.submmitedOtherDocFlag = false;
          this.spinnerFlag = false;

          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.showManageDocumentPanel = !this.showManageDocumentPanel;
            // setting structure as per form data
            let projectDocumentsData = this.getProjectDocuments(this.projectDetailsForm.value.projectDocuments);
            this.projectDetails['projectDocuments'] = projectDocumentsData;
            // setting structure as per api data
            this.projectsData.projectsDetails['projectDocuments'] = this.setProjectDocuments(this.projectDetailsForm.value.projectDocuments);
            this.discardDocumentsData();
            // this.toastrService.success('Documents uploaded successfully');
            this.toastrService.success(responseData.header.message);
          } else {
            this.toastrService.error(responseData.header.message);
          }
        },
          error => {
            this.toastrService.error(this.commonLabelsObj.errorMessages.responseError);
          });
    }
  }
  getProjectDocuments(projectDocumentsData) {
    const projectDocumentsDataArr = [];

    for (let i = 0; i < projectDocumentsData.length; i++) {
      if (projectDocumentsData[i].fileId) {
        projectDocumentsDataArr.push({
          'name': projectDocumentsData[i].name ? projectDocumentsData[i].name : '',
          'fileName': projectDocumentsData[i].fileName ? projectDocumentsData[i].fileName : '',
          'url': projectDocumentsData[i].url ? projectDocumentsData[i].url : '',
          'fileId': projectDocumentsData[i].fileId ? projectDocumentsData[i].fileId : '',
        });
      }
    }
    return projectDocumentsDataArr;
  }
  setProjectDocuments(projectDocumentsData) {
    const projectDocumentsDataArr = [];

    for (let i = 0; i < projectDocumentsData.length; i++) {
      if (projectDocumentsData[i].fileId) {
        let obj = {
          'name': projectDocumentsData[i].fileName ? projectDocumentsData[i].fileName : '',
          'url': projectDocumentsData[i].url ? projectDocumentsData[i].url : '',
          'id': projectDocumentsData[i].fileId ? projectDocumentsData[i].fileId : '',
        }
        projectDocumentsDataArr.push({
          'name': projectDocumentsData[i].name ? projectDocumentsData[i].name : '',
          'file': obj
        });
      }
    }
    return projectDocumentsDataArr;
  }
  updateProjectsData() {
    const formValue = this.projectDetailsForm.value;
    this.isClicked = true;
    this.spinnerFlag = true;
    const projectDetailsData = ManageProjectData.getWebServiceDetails(formValue);
    delete projectDetailsData['projectDocuments'];
    projectDetailsData['id'] = this.projectId;
    this._projectService.updateProjectsData(this.projectId, projectDetailsData).
      subscribe((responseData: any) => {
        this.isClicked = false;
        this.spinnerFlag = false;

        if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
          this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.projects).then(() => {
            this.toastrService.success(responseData.header.message);
          })
        } else {
          this.toastrService.error(responseData.header.message);
        }
      },
        error => {
          this.isClicked = false;
          this.spinnerFlag = false;
          this.toastrService.error(this.commonLabelsObj.errorMessages.responseError);
        });
  }
  navigateTo() {
    this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.projects);
    this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectId);
    this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectName);
    this.sessionService.removeLocalStorageItem(LOCAL_STORAGE_CONSTANTS.projectData);
    this.sessionService.deleteCookie(COOKIES_CONSTANTS.currency);
  }

  setUploadedData(type, control, data) {
    const localThis = this;
    switch (type) {
      case 'logo':
        this.projectDetailsForm.controls[control + 'Url'].setValue(data.url);
        this.projectDetailsForm.controls[control + 'Id'].setValue(data.id);
        //  this.projectDetailsForm.controls[loader].setValue(false);
        setTimeout(function () {
          localThis.toastrService.success(localThis.commonLabelsObj.successMessages.imageUploadedSuccessfully);
        }, 1500);
        break;
      case 'document':
        this.multipleDocumentUpload[control] = true;
        const projectDocumentsControlArray = <FormArray>this.projectDetailsForm.controls['projectDocuments'];
        const projectDocumentFrmGrp = <FormGroup>projectDocumentsControlArray.controls[control];
        projectDocumentFrmGrp.patchValue({
          fileName: data.name,
          url: data.url,
          fileId: data.id,
          showLoader: false
        });
        projectDocumentFrmGrp.controls['name'].setValidators([CustomValidators.required]);
        projectDocumentFrmGrp.controls['name'].updateValueAndValidity();
        setTimeout(function () {
          localThis.toastrService.success(localThis.commonLabelsObj.successMessages.documentUploadedSuccessfully);
        }, 1500);
        break;
    }
  }
  setPermissionsDetails() {
    this.permissionObj = this.sharedData.getRolePermissionData();
    this.MODULE_ID = this.route.snapshot.parent.parent.data['moduleID'];
    const modulePermissionObj = this.permissionObj[this.MODULE_ID];
    if (modulePermissionObj.uiAccess) {
      this.uiAccessPermissionsObj = modulePermissionObj.uiAccess;
    }
  }
}

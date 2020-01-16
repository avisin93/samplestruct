import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { SharedData } from '@app/shared/shared.data';
import {
  ROUTER_LINKS_FULL_PATH, ROLES,
  PROJECT_DIVISION, PROJECT_TYPES,
  BUDGET_SHEET_FILE_TYPES
} from '@app/config';
import { CustomValidators, Common, NavigationService } from '@app/common';
import { SharedService } from '@app/shared/shared.service';
import { AddProjectService } from './add-project.service';
import { AddProjectData } from './add-project.data.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProjectComponent implements OnInit {
  isClicked: Boolean = false;
  addProjectForm: FormGroup;
  submmitedProjectForm: Boolean = false;
  addBudgetSheetForm: Boolean = false;
  ROUTER_LINKS_FULL_PATH = ROUTER_LINKS_FULL_PATH;
  showLoader: Boolean = false;
  ROLES = ROLES;
  selectprojectName: any;
  // PROJECT_DIVISION = PROJECT_DIVISION;
  companies = [];
  company: any = [];
  projectTypes = [];
  projectType: any = [];
  fileName: any;
  spinnerFlag: Boolean = false;
  disablebutton: Boolean = false;
  renderPage: Boolean = false;
  // disablebutton: Boolean = false;
  PROJECT_TYPES = PROJECT_TYPES;
  data: any = [];
  error: any;
  breadcrumbData: any = {
    title: 'projects.labels.addProjectTitle',
    subTitle: 'projects.labels.addProjectSub',
    data: [{
      text: 'common.labels.home',
      link: '/'
    },
    {
      text: 'projects.labels.projectList',
      link: ROUTER_LINKS_FULL_PATH.projects
    },
    {
      text: 'projects.labels.addProjectTitle',
      link: ''
    }
    ]
  };
  PROJECT_DIVISION: { id: number; text: string; }[];
  operation: any;
  budgetTypesArr: any;
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private navigationService: NavigationService,
    private _addProjectService: AddProjectService,
    private _sharedService: SharedService, private translate: TranslateService) { }

  ngOnInit() {
    this.setBudgetTypes();
    this.setCompanies();
    this.getProjectTypes();
    this.translate.get('common').subscribe(res => {
      this.error = res;
    });
    this.getDropdownValues();
  }

  /**
* Submits on enter key
* @param event as enter key event
*/
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this.spinnerFlag && !this.disablebutton) {
      this.addProject();
      }
    }
  }
  getDropdownValues() {
    this.PROJECT_DIVISION = Common.changeDropDownValues(this.translate, PROJECT_DIVISION);
  }
  /**
  * Creates add project form
  */
  createAddForm() {
    this.addProjectForm = this.addProjectFormGroup();
  }
  /**
  * Creates add project Form Group
  */
  addProjectFormGroup(): FormGroup {
    return this.fb.group({
      company: ['', [CustomValidators.required]],
      projectType: ['', [CustomValidators.required]],
      projectName: ['', [CustomValidators.required]],
      division: [''],
      budgetSheetArr: this.fb.array([]),
    });
  }
  /**
   * Set companies dropdown
   */
  setCompanies() {
    this._sharedService.getCompanies().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.companies = response.payload.results;
          this.company = Common.getMultipleSelectArr(this.companies, ['id'], ['i18n', 'name']);
        } else {
          this.companies = [];
          this.renderPage = true;
        }
      } else {
        this.companies = [];
        this.renderPage = true;
      }
    },
      error => {
        this.companies = [];
        this.renderPage = true;
      });
  }
  /**
   * Sets budget sheet dropdown
   */
  setBudgetTypes() {
    this._addProjectService.getBudgetTypes().subscribe((response: any) => {
      if (Common.checkStatusCode(response.header.statusCode)) {
        if (response.payload && response.payload.results) {
          this.budgetTypesArr = response.payload.results;
          this.createAddForm();
          this.addBudgetSheet(false);
        } else {
          this.budgetTypesArr = [];
          this.renderPage = true;
        }
      }
      else {
        this.budgetTypesArr = [];
        this.renderPage = true;
      }
    }, error => {
      this.budgetTypesArr = [];
      this.renderPage = true;
    });
  }
  /**
   * Fetches project types
   */
  getProjectTypes() {
    this._sharedService.getProjectTypes().subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.results) {

          this.projectTypes = response.payload.results;
          this.projectType = Common.getMultipleSelectArr(this.projectTypes, ['id'], ['name']);
        } else {
          this.projectTypes = [];
          this.renderPage = true;
        }
      } else {
        this.projectTypes = [];
        this.renderPage = true;
      }
    },
      error => {
        this.projectTypes = [];
        this.renderPage = true;
      });
  }
  /**
    * Uploads files and assigns file name and id to form fields
    * @param event is a browse window event
    * @param index specifies for which record the file should be uploaded
    */
  fileChangeEvent(event, index) {
    const budgetSheetArray = <FormArray>this.addProjectForm.controls['budgetSheetArr'];
    const budgetSheetFormGroup = <FormGroup>budgetSheetArray.controls[index];
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const type = this.getFileType(file);
      if (this.checkFileType(type)) {
        const formData = this.setFormData(file);
        this.fileName = '';
        this.disablebutton = true;
        budgetSheetFormGroup.controls['showLoader'].setValue(true);
        this._sharedService.uploadFile(formData).subscribe((response: any) => {
          if (Common.checkStatusCodeInRange(response.header.statusCode)) {
            if (response.payload && response.payload.result) {
              budgetSheetFormGroup.controls['showLoader'].setValue(false);
              this.data = response.payload.result;
              this.fileName = this.data.name;
              budgetSheetFormGroup.controls['budgetSheetFileId'].setValue(this.data.id);
              budgetSheetFormGroup.controls['budgetSheetName'].setValue(this.data.name);
              this.disablebutton = false;
            } else {
              this.disablebutton = false;
              budgetSheetFormGroup.controls['showLoader'].setValue(false);
              this.disablebutton = false;
              this.data = [];
            }
          } else {
            this.disablebutton = false;
            budgetSheetFormGroup.controls['showLoader'].setValue(false);
            this.disablebutton = false;
            this.data = [];
            if (response.header) {
              this.toastrService.error(response.header.message);
            } else {
              this.disablebutton = false;
              this.toastrService.error(this.error.errorMessages.responseError);
            }
          }

        },
          error => {
            this.disablebutton = false;
            budgetSheetFormGroup.controls['showLoader'].setValue(false);
            this.disablebutton = false;
            this.data = [];
          });
      }
      else {
        this.toastrService.error(this.error.errorMessages.invalidFileType);
      }
    }
  }
  /**
 * Budget sheet form group which will be pushed in budgetSheetArr
 */
  budgetSheetRecordForm(): FormGroup {
    return this.fb.group({
      budgetSheetType: ['', [CustomValidators.required]],
      budgetSheetFileId: ['', [CustomValidators.required]],
      budgetSheetName: [''],
      showLoader: [false],
      filteredBudgetList: [this.getFilteredBudgetType()]
    });
  }
  /**
 * Adds budget sheet record
 * @param addOnPageLoad as boolean which specifies to load initial FormGroup on page load
 * @param index as number to add Budget sheet record at that particular index
 */
  addBudgetSheet(addOnPageLoad, index = 0) {
    this.addBudgetSheetForm = false;
    const budgetSheetArray = <FormArray>this.addProjectForm.controls['budgetSheetArr'];
    const budgetSheetFormGroup = <FormGroup>budgetSheetArray.controls[index];
    if (addOnPageLoad) {
      if (budgetSheetFormGroup.valid) {
        budgetSheetArray.push(this.budgetSheetRecordForm());
      }
      else {
        this.addBudgetSheetForm = true;
      }
    } else {
      budgetSheetArray.push(this.budgetSheetRecordForm());
    }
  }
  /**
 * Returns file type
 * @param file as filename
 */
  getFileType(file) {
    const fileNameArr = file.name.split('.');
    const type = fileNameArr[fileNameArr.length - 1];
    return type;
  }
  /**
  * Retuns true if file type valid and false on invalid file type
  * @param filetype as file extension
  */
  checkFileType(filetype) {
    const validtype = _.find(BUDGET_SHEET_FILE_TYPES, { 'type': filetype.toLowerCase() });
    if (validtype) {
      return true;
    }
    else {
      return false;
    }

  }
  /**
   * Updates form validation project type change
   * @param event
   */
  projectTypeChanged(event) {

    if (this.addProjectForm.value.projectType == PROJECT_TYPES.corporate) {
      this.addProjectForm.controls['division'].setValue('');
      this.addProjectForm.controls['division'].setValidators([]);
      this.addProjectForm.controls['division'].disable();
    }
    else {
      this.addProjectForm.controls['division'].enable();
      this.addProjectForm.controls['division'].setValidators([CustomValidators.required]);
    }
    this.addProjectForm.controls['division'].markAsUntouched();
    this.addProjectForm.controls['division'].updateValueAndValidity();
  }
  /**
 * Sets file which will be sent to the upload service
 * @param file is a file which which will be uploaded
 */
  setFormData(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return formData;
  }

  /**
   * Filters budget sheet dropdown when multiple budget sheet records are added
   */
  getFilteredBudgetType() {
    const formValue = this.addProjectForm.value;
    const selectedBudgetIds = _.map(formValue.budgetSheetArr, 'budgetSheetType');
    const companies = JSON.parse(JSON.stringify(this.budgetTypesArr));
    let filteredBudgetIds = [];
    if (selectedBudgetIds.length > 0) {
      companies.forEach((obj, index) => {
        if (!selectedBudgetIds.includes(obj.id)) {
          obj['text'] = obj.name;
          filteredBudgetIds.push(obj);
        }
      });
    }
    else {
      filteredBudgetIds = Common.getMultipleSelectArr(JSON.parse(JSON.stringify(companies)), ['id'], ['name']);
    }

    this.renderPage = true;
    return filteredBudgetIds;


  }
  /**
  * Filters budget sheet values on budget type change
  * @param value which needs to be filtered
  */
  budgetTypeChanged(value) {
    const budgetTypeArr = <FormArray>this.addProjectForm.get('budgetSheetArr');
    for (let i = 0; i < budgetTypeArr.length; i++) {
      const formGroup = <FormGroup>budgetTypeArr.controls[i];
      if (value != formGroup.value.budgetSheetType) {
        const budgetTypes: any = JSON.parse(JSON.stringify(formGroup.value.filteredBudgetList));
        _.remove(budgetTypes, { 'id': value });
        formGroup.controls['filteredBudgetList'].setValue(budgetTypes);
      }

    }
  }
  /**
  * Removes budget sheet record and updated budgetsheet dropdown
  * @param eventIndex as string which defines which record is to be removed
  * @param formGrp as FormGroup in budgetsheetArr
  */
  removeBudgetType(eventIndex, formGrp: FormGroup) {
    const roleArray = <FormArray>this.addProjectForm.get('budgetSheetArr');
    const budgetID = formGrp.value.budgetSheetType;
    roleArray.removeAt(eventIndex);
    for (let i = 0; i < roleArray.length; i++) {
      const formGroup = <FormGroup>roleArray.controls[i];
      const budgetTypes: any = JSON.parse(JSON.stringify(this.budgetTypesArr));
      const filteredBudgetTypes: any = formGroup.value.filteredBudgetList;
      budgetTypes.forEach((obj) => {
        obj['text'] = obj.name;
      });
      const budgetType = _.find(budgetTypes, { 'id': budgetID });
      filteredBudgetTypes.push(budgetType);
      formGroup.controls['filteredBudgetList'].setValue(filteredBudgetTypes);
    }

  }
  /**
   * Posts new project data
   */
  addProject() {
    this.submmitedProjectForm = true;
    this.addBudgetSheetForm = true;
    if (this.addProjectForm.valid) {
      this.spinnerFlag = true;
      this.isClicked = true;
      const formvalue = this.addProjectForm.value;
      const finalUserData = AddProjectData.getWebServiceDetails(formvalue);
      this._addProjectService.postData(finalUserData).
        subscribe((responseData: any) => {
          this.isClicked = false;
          this.spinnerFlag = false;
          if (Common.checkStatusCodeInRange(responseData.header.statusCode)) {
            this.navigationService.navigate(ROUTER_LINKS_FULL_PATH.projects).then(() =>
              this.toastrService.success(responseData.header.message)
            );
          } else {
            this.spinnerFlag = false;
            this.isClicked = false;
            this.toastrService.error(responseData.header.message);
          }
        }, error => {
          this.spinnerFlag = false;
          this.isClicked = false;
          this.toastrService.error(this.error.errorMessages.responseError);
        });

    }
    else {
      $('html, body').animate({ scrollTop: 0 }, 'slow');
    }


  }
  /**
   * Navigates to project list
   */
  navigateTo() {
    this.navigationService.navigate([ROUTER_LINKS_FULL_PATH.projects]);
  }
}

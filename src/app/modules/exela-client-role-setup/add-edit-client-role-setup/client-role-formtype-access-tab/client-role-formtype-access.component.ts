import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange, MatSelectChange, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { AddEditFormTypeAccessComponent } from './add-edit-formtype-access/add-edit-formtype-access.component';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';

@Component({
  selector: 'app-client-role-formtype-access-tab',
  templateUrl: './client-role-formtype-access.component.html',
  styleUrls: ['./client-role-formtype-access.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientRoleFormtypeAccessTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input('roleId') roleId: string = '';

  @Input('projectId') projectId = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  clientMenuSetupForm: FormGroup;

  allprojects: Array<any> = [];
  projects: Array<any> = [];
  docTypes: Array<any> = [];
  formElements: Array<any> = [];
  queueSize = 0;

  columns: Array<any> = [
    {
      title: 'METADATA FIELD NAME',
      key: 'name'
    },
    {
      title: 'DISPLAY NAME',
      key: 'displayname'
    },
    {
      title: 'READ',
      key: 'canread',
      displayColumnEvent: true
    },
    {
      title: 'UPDATE',
      key: 'canupdate',
      displayColumnEvent: true
    }
  ];

  dialogOptions: any = {
    width: '500px',
    height: '200px',
    panelClass: 'appModalPopup'
  };
  records: Array<any> = [];
  totalRows: number = 0;
  hasActionButtons: boolean = true;
  selectedItems = [];

  selectedProject = '';
  selectedDocType: any;
  roleFormEleMap: Array<any> = [];

  constructor (public dialog: MatDialog,
        private _router: Router,
        public _toastCtrl: ToastrService,
        private httpService: HttpService,
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private _fb: FormBuilder) {
    this.clientMenuSetupForm = this._fb.group({
      project: new FormControl('', [Validators.required]),
      docType: new FormControl('', [Validators.required]),
      assignedFormTypeList: this._fb.array([]),
      read: new FormControl(''),
      update: new FormControl(''),
      id: new FormControl('')

    });
  }

  ngOnInit () {
    this.getAllProjects();
  }

  getAllProjects (isUpdated?) {
    let reqData = {
      organizationId: this.organizationId
    };
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl, reqData).subscribe(response => {
      this.allprojects = response;
      this.allprojects.forEach((prj) => {
        this.projects.push({
          text: prj.name,
          value: prj._id
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    console.log('save-->',value);

        // let project = JSON.parse(value.project);
        // let selectedQueues = [];
        // let reqData = {
        //     roleId: this.roleId,
        //     projectId: project._id,
        //     projectName: project.name,
        //     projectCode: project.code,
        //     queues: selectedQueues
        // }
        // this.httpService.save(UrlDetails.$exela_addOrUpdateProjectQueueAccessUrl, reqData).subscribe(response => {
        //     this._toastCtrl.successToast("Project queue access updated Successfully");
        // });
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

  get _assignedFormTypeList (): FormArray {
    return this.clientMenuSetupForm.get('assignedFormTypeList') as FormArray;
  }

  formTypeForm (item: any) {
    return new FormGroup({
      id: new FormControl(item._id),
      name: new FormControl(item.name),
      read: new FormControl(item.read),
      update: new FormControl(item.update)
    });
  }

  onProjectChange (event: MatSelectChange) {
    this.selectedProject = event.value;
    this.records = [];
    this.getDocType();

    let reqObj = {
      projectId: this.selectedProject,
      'roleId': this.roleId
    };
    this.httpService.get(UrlDetails.$findProjectByroles, reqObj)
        .subscribe((response) => {
          if (response) {
            this.queueSize = response.queues ? response.queues.length : 0;
          }
        },(error) => {
          console.log(error);
          this.loaderService.hide();
        });
  }

  onDocTypeChange (event: MatSelectChange) {

    this.clearFormArray(this._assignedFormTypeList);
    this.selectedDocType = {id: event.value._id,
      name: event.value.name,
      description: event.value.description
    };
    this.getRoleDocType();

  }

  editFormType (record: any) {
    if (this.queueSize > 0) {
      let reqData: any = {};
      reqData.formElement = JSON.parse(JSON.stringify(record.rowData));
      if (record.columnKey === 'canread') {
        reqData.formElement.canread = !reqData.formElement.canread;
      } else if (record.columnKey === 'canupdate') {
        reqData.formElement.canupdate = !reqData.formElement.canupdate;
      }
      reqData.projectId = this.selectedProject;
      reqData.docType = this.selectedDocType;
      reqData.organizationId = this.organizationId;
      reqData.roleId = this.roleId;
      this.httpService.save(UrlDetails.$exelaAddUpdateRoleDocTypeFormElement, reqData)
                .subscribe(response => {
                  if (record.columnKey === 'canread') {
                    record.rowData.canread = !record.rowData.canread;
                  } else if (record.columnKey === 'canupdate') {
                    record.rowData.canupdate = !record.rowData.canupdate;
                  }
                  this._toastCtrl.success(response.message);
                  if (!record.rowData.canread && !record.rowData.canupdate) {
                    let req = {
                      projectId: this.selectedProject,
                      docTypeId: this.selectedDocType.id,
                      roleId: this.roleId,
                      formElementId: record.rowData._id
                    };
                    this.httpService.save('UrlDetails.$updateListHeader',req).subscribe((res) => {// TODO Nikola
                      console.log(res);
                    });
                  }

                }, (error) => {
                  if (error.status === 400) {
                    this._toastCtrl.error(error._body);
                  } else {
                    this._toastCtrl.error('Something went wrong');
                  }
                });
    } else {
      this._toastCtrl.error('Project not Assigned');
    }
  }

    // deleteFormType(record: any) {
    //     let deleteQueueSetupAlert = new SweetAlertController();
    //     deleteQueueSetupAlert.deleteConfirm({}, () => {
    //         let reqData:any = {};
    //             reqData.formElement = record;
    //             reqData.formElement.active = false;
    //             reqData.projectId = this.selectedProject;
    //             reqData.docType = this.selectedDocType;
    //             reqData.organizationId = this.organizationId;
    //             reqData.roleId = this.roleId;
    //             this.httpService.save(UrlDetails.$exela_addUpdateRoleDocTypeFormElement, reqData)
    //                 .subscribe(response => {
    //                 this._toastCtrl.successToast(response.message);
    //                 }, (error) => {
    //                     this._toastCtrl.errorToast('Something went wrong');
    //                 });

    //     });

    // }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getDocType () {
    this.docTypes = [];
    this.clientMenuSetupForm.controls['docType'].patchValue('');
    let prj = this.allprojects.find((item: any) => {
      return item._id === this.selectedProject;
    });
    if (prj && prj.doctypes) {
      prj.doctypes.forEach((item: any) => {
        if (item.active) {
          this.docTypes.push(item);
        }
      });
    }
  }

  getFormElement () {
    let formList = [];
    let project = this.allprojects.find((item: any) => {
      return item._id === this.selectedProject;
    });
    if (project && project.doctypes) {
      let docType = project.doctypes.find((item: any) => {
        return item._id === this.selectedDocType.id;
      });
      if (docType && docType.formelements) {
        this.formElements = docType.formelements;
      } else {
        this.formElements = [];
      }
    }
    if (this.formElements.length > 0) {
      this.formElements.forEach((item) => {
        this._assignedFormTypeList.push(this.formTypeForm(item));
        if (item.active) {
          formList.push(item);
        }

      });
      this.records = formList;
      for (let obj of this.records) {
        if (this.roleFormEleMap[obj._id]) {
          obj.canupdate = this.roleFormEleMap[obj._id].canupdate;
          obj.canread = this.roleFormEleMap[obj._id].canread;
          obj.name = this.roleFormEleMap[obj._id].name;
        }
      }
      this.totalRows = formList.length;
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    } else {
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
    }
  }

  getRoleDocType () {
    let reqObj = {
      roleId: this.roleId,
      organizationId: this.organizationId,
      docTypeId: this.selectedDocType.id,
      projectId: this.selectedProject
    };
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exelaGetRoleDocType,reqObj)
        .subscribe((response) => {
          for (let formEle of response) {
            this.roleFormEleMap[formEle._id] = formEle;
          }
          this.getFormElement();
          this.loaderService.hide();
        },(error) => {
          console.log(error);
          this.loaderService.hide();
        });

  }
}

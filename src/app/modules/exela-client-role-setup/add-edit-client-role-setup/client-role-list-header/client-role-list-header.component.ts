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
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';

@Component({
  selector: 'app-client-role-list-header-tab',
  templateUrl: './client-role-list-header.component.html',
  styleUrls: ['./client-role-list-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientRoleListHeaderTabComponent implements OnInit {

  @Input('organizationId') organizationId = '';

  @Input('type') type = '';

  @Input('mode') mode: string = '';

  @Input('roleId') roleId: string = '';

  @Input('projectId') projectId = '';

  @ViewChild(NgDataTablesComponent)
  private dataTableComp: NgDataTablesComponent;

  allprojects: Array<any> = [];
  projects: Array<any> = [];
  docTypes: Array<any> = [];
  formElements: Array<any> = [];

  // columns: Array<any> = [
  //   {
  //     title: 'METADATA FIELD NAME',
  //     key: 'name',
  //   },
  //   {
  //     title: 'DISPLAY NAME',
  //     key: 'displayname',
  //   },
  //   {
  //     title: 'SEQUENCE NUMBER',
  //     key: 'priority',
  //   },
  //   {
  //     title: 'SET AS HEADER',
  //     key: 'isListHeader',
  //     displayColumnEvent:true
  //   }

  // ];

  dialogOptions: any = {
    width: '500px',
    height: '200px',
    panelClass: 'appModalPopup'
  };
  records: Array<any> = [];
  totalRows: number = 0;
  hasActionButtons: boolean = true;
  selectedItems = [];
  selectedProject: any;
  selectedDocType: any;
  roleFormEleMap: Array<any> = [];
  // ========================================
  roleListHeaderFrom: FormGroup;
  selectedItem: any;
  selectedItemIndex: number = -1;
  side: string = 'left';
  listing: Array<any> = [];
  roles: Array<any> = [];
  removedFormElementId = [];
  initialAssignedUsers = [];
  clients;
  showClientList;
  headerList: Array<any> = [];

  constructor (public dialog: MatDialog,
    private _router: Router,
    public _toastCtrl: ToastrService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private _fb: FormBuilder) {

  }

  ngOnInit () {
    this.roleListHeaderFrom = this._fb.group({
      project: new FormControl('', [Validators.required]),
      docType: new FormControl('', [Validators.required]),
      accessibleFormEle: this._fb.array([]),
      assignedHeaderEle: this._fb.array([])
    });
    this.getAssignedProjectAndDocTypeList();
  }

  getAssignedProjectAndDocTypeList () {
    this.httpService.get(UrlDetails.$getRoleProjectDocType, { roleId: this.roleId }).subscribe((response) => {
      this.projects = response;
    }, (error) => {
      console.log(error);
    });
  }

  gotoClientVendorSetup () {
    let base = SessionService.get('base-role');
    this.route.parent.url.subscribe((urlPath) => {
      const menuUrl = urlPath[urlPath.length - 1].path;
      this._router.navigate(['/' + base + '/' + menuUrl]);
    });
  }

  formTypeForm (item: any) {
    return new FormGroup({
      id: new FormControl(item._id),
      name: new FormControl(item.name),
      isListHeader: new FormControl(item.isListHeader)
    });
  }

  onProjectChange (event: MatSelectChange) {
    this.clearFormArray(this._accessibleFormElement);
    this.clearFormArray(this._headerList);
    this.selectedProject = event.value;
    this.docTypes = event.value.doctypes;
    this.records = [];
  }

  onDocTypeChange (event: MatSelectChange) {
    this.clearFormArray(this._accessibleFormElement);
    this.clearFormArray(this._headerList);
    this.selectedDocType = event.value;
    this.getRoleWiseHeader();
  }

  // editFormType(record: any) {
  //   let reqData: any = {};
  //   let isUpdate = true;
  //   reqData.formElement = JSON.parse(JSON.stringify(record.rowData));
  //   if (record.columnKey === 'isListHeader') {
  //     reqData.formElement.isListHeader = !reqData.formElement.isListHeader;
  //   }
  //   reqData.projectId = this.selectedProject._id;
  //   reqData.docTypeId = this.selectedDocType._id;
  //   reqData.formEleId = record.rowData._id;
  //   reqData.roleId = this.roleId;
  //   if (isUpdate) {
  //     this.httpService.save(UrlDetails.$saveRoleWiseListHeader, reqData)
  //       .subscribe(response => {
  //         if (record.columnKey === 'isListHeader') {
  //           record.rowData.isListHeader = !record.rowData.isListHeader;
  //         }
  //         this._toastCtrl.successToast('Updated successfully.');
  //       }, (error) => {
  //         if (error.status == 400) {
  //           this._toastCtrl.errorToast(error._body);
  //         } else {
  //           this._toastCtrl.errorToast('Something went wrong');
  //         }
  //       });
  //   }
  // }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  // getFormElement() {

  //   if (this.formElements.length > 0) {
  //     this.records = this.formElements;
  //     this.totalRows = this.formElements.length;
  //     this.dataTableComp.setPage(1);
  //     this.loaderService.hide();
  //   } else {
  //     this.loaderService.hide();
  //     this.dataTableComp.setPage(1);
  //   }
  // }

  getRoleWiseHeader () {
    let reqObj = {
      roleId: this.roleId,
      docTypeId: this.selectedDocType._id,
      projectId: this.selectedProject._id
    };
    this.loaderService.show();
    this.httpService.get('UrlDetails.$getRoleWiseListHeader', reqObj)// TODO Nikola
      .subscribe((response) => {
        this.headerList = [];
        this.formElements = response;
        this.formElements = this.formElements.sort((a,b) => { return a.priority - b.priority; });
        response.forEach((ele) => {
          if (ele.isListHeader) {
            this.headerList.push(ele);
            this._headerList.push(this.formEle(ele));
          } else {
            this._accessibleFormElement.push(this.formEle(ele));
          }
        });

        this.loaderService.hide();
      }, (error) => {
        console.log(error);
        this.loaderService.hide();
      });

  }

  formEle (item: any) {
    return new FormGroup({
      _id: new FormControl(item._id),
      name: new FormControl(item.displayname)
    });
  }
  onSelectItem (item, index, side) {
    this.selectedItem = item;
    this.selectedItemIndex = index;
    this.side = side;
  }

  get _accessibleFormElement (): FormArray {
    return this.roleListHeaderFrom.get('accessibleFormEle') as FormArray;
  }

  get _headerList (): FormArray {
    return this.roleListHeaderFrom.get('assignedHeaderEle') as FormArray;
  }

  moveLeft () {
    if (this.selectedItemIndex !== -1 && this.side === 'right') {
      this._headerList.removeAt(this.selectedItemIndex);
      this._accessibleFormElement.push(this.selectedItem);
      this.headerList.splice(this.selectedItemIndex,1);
      this.selectedItemIndex = -1;
      if (this.removedFormElementId.indexOf(this.selectedItem.value.id) === -1) {
        this.removedFormElementId.push(this.selectedItem.value.id);
      }
      this.selectedItem = null;
    }
  }

  moveRight () {
    if (this.selectedItemIndex !== -1 && this.side === 'left') {
      this._accessibleFormElement.removeAt(this.selectedItemIndex);
      this._headerList.push(this.selectedItem);
      this.headerList.push(this.selectedItem.value);
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveAllLeft () {
    if (this._headerList.length > 0) {
      for (let i = 0; i < this._headerList.length; i++) {
        this._accessibleFormElement.push(this._headerList.at(i));
        if (this.removedFormElementId.indexOf(this._headerList.at(i).value.id) === -1) {
          this.removedFormElementId.push(this._headerList.at(i).value.id);
        }
      }
      for (let i = this._headerList.length - 1; i >= 0; i--) {
        this._headerList.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
      this.headerList = [];
    }
  }

  moveAllRight () {
    if (this._accessibleFormElement.length > 0) {
      for (let i = 0; i < this._accessibleFormElement.length; i++) {
        this._headerList.push(this._accessibleFormElement.at(i));
      }

      for (let i = this._accessibleFormElement.length - 1; i >= 0; i--) {
        this._accessibleFormElement.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
      this.headerList = this.roleListHeaderFrom.controls['assignedHeaderEle'].value;
    }
  }

  moveUp () {
    if (this.selectedItemIndex !== -1 && this.side === 'right') {
      let i = this.selectedItemIndex;
      if (i > 0) {
        this.headerList = this.roleListHeaderFrom.controls['assignedHeaderEle'].value;
        let element = this.headerList[i - 1];
        this.headerList[i - 1] = this.headerList[i];
        this.headerList[i] = element;
        let formControl = this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i - 1];
        this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i - 1] = this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i];
        this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i] = formControl;
        this.selectedItemIndex = i - 1;
      }

    }
  }

  moveDown () {
    if (this.selectedItemIndex !== -1 && this.side === 'right') {
      let i = this.selectedItemIndex;
      if (i < this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'].length - 1) {
        this.headerList = this.roleListHeaderFrom.controls['assignedHeaderEle'].value;
        let element = this.headerList[i + 1];
        this.headerList[i + 1] = this.headerList[i];
        this.headerList[i] = element;
        let formControl = this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i + 1];
        this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i + 1] = this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i];
        this.roleListHeaderFrom.controls['assignedHeaderEle']['controls'][i] = formControl;
        this.selectedItemIndex = i + 1;
      }
    }
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.roleListHeaderFrom.controls['project'].markAsTouched();
      this.roleListHeaderFrom.controls['docType'].markAsTouched();
    } else {
      let assignedHeaderList = [];
      if (value.assignedHeaderEle.length > 0) {
        // value.assignedHeaderEle.forEach((item, index) => {
        //   assignedHeaderList.push(item.id);
        // });

        let assignReq = {
          assignedHeaderList:  this.headerList,
          projectId : this.selectedProject._id,
          docTypeId : this.selectedDocType._id,
          roleId : this.roleId
        };
        this.httpService.save('UrlDetails.$saveRoleWiseListHeader', assignReq).subscribe(response => {// TODO Nikola
          this._toastCtrl.success('Header configured successfully.');
        });
      } else {
        this._toastCtrl.error('Please add at least one header to assign');
      }
    }
  }

  dragStart (item, index, side) {
    this.selectedItem = item;
    this.selectedItemIndex = index;
    this.side = side;
  }

  drop (event) {
    if (this.side === 'left') {
      this.moveRight();
    } else if (this.side === 'right') {
      this.moveLeft();
    }
  }

  dragEnd (event) {
    this.side = null;
  }
}

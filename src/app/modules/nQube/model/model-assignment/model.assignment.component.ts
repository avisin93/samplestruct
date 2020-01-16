import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../../../shared/providers/storage.service';
import { AddEditModelComponent } from './add-edit-model/add-edit-model.component';
import { ExecuteFileComponent } from './add-edit-model/execute.file.component';
import { ModelAssignmentService } from './model-assignment.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

const superAdminRole = 'SUPERADMIN';

@Component({
  selector: 'app-model-assignment',
  templateUrl: './model.assignment.component.html',
  styleUrls: ['./model.assignment.component.scss'],
  providers: [ModelAssignmentService]
})
export class ModelAssignmentComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    public dataTableComp: NgDataTablesComponent;
  public showDeactivateButton: boolean = true;
  public searchBox: boolean = true;
  fileData: string;
  fileName: string;
  columns: Array<any> = [
    {
      title: 'PROJECT NAME',
      key: 'projectName',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'DOC TYPE',
      key: 'formType',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'MODEL NAME',
      key: 'modelName',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'MODEL DESCRIPTION',
      key: 'modelDescription',
      sortable: true,
      filter: true,
      link: false
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Model Assignment',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '420px',
    height: '320px'
  };

  executeFileOptions: any = {
    width: '640px',
    height: '480px'
  };

  userType: string;
  hasSuperAdminRole: boolean = false;
  showClientList: boolean = false;
  clients;
  organizationId;
  constructor (
    public dialog: MatDialog,
    private httpService: HttpService,
    private toaster: ToastrService,
    private loaderService: LoaderService,
    private modelService: ModelAssignmentService
  ) {}

  ngOnInit () {
    this.userType = StorageService.get(StorageService.userRole);
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    this.hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });

    if (this.hasSuperAdminRole) {
      this.showClientList = true;
      this.getAllClients();

    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.getAllModels();
    }
  }

  ngOnDestroy () {

  }

  getAllClients () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      this.loaderService.hide();
      if (response.length !== 0) {
        this.clients = response;
        this.onClientChange(this.clients[0]._id);
      }
    }, () => {
      this.loaderService.hide();
    });
  }

  onClientChange (value) {
    this.organizationId = value;
    this.getAllModels();
  }

  getAllModels () {
    const self = this;
    this.loaderService.show();
    this.modelService.getAllModels({ organizationId: this.organizationId }).subscribe(response => {
      this.records = response.slice(0);
      this.records.forEach((record) => {
        record.modelName = record.modelname.modelname;
        record.modelname = record.modelname._id;
      });
      this.totalRows = this.records.length;
      this.loaderService.hide();
      self.dataTableComp.setPage(1);
    }, () => {
      this.loaderService.hide();
      self.dataTableComp.setPage(1);
    });
  }

  addModelPopup () {
    if (this.userType === superAdminRole) {
      this.dialogOptions.width = '600px';
      this.dialogOptions.height = '420px';
    }
    let addModelAssignmentDialogRef = this.dialog.open(AddEditModelComponent, this.dialogOptions);
    addModelAssignmentDialogRef.componentInstance.heading = 'Assign Model';
    addModelAssignmentDialogRef.componentInstance.saveButtonTitle = 'Assign';
    addModelAssignmentDialogRef.componentInstance.mode = 'Add';
    addModelAssignmentDialogRef.componentInstance.organizationId = this.organizationId;
    addModelAssignmentDialogRef.afterClosed().subscribe(result => {
      this.getAllModels();
    });
  }

  openExecutePopup () {
    let executeFilePopup = this.dialog.open(ExecuteFileComponent, this.executeFileOptions);
    executeFilePopup.componentInstance.heading = 'Select Model To Run';
    executeFilePopup.afterClosed().subscribe(result => {

    });
  }

  editModelPopup (assignedModel) {
    if (this.userType === superAdminRole) {
      this.dialogOptions.width = '600px';
      this.dialogOptions.height = '420px';
    }
    let editModelAssignmentDialogRef = this.dialog.open(AddEditModelComponent, this.dialogOptions);
    editModelAssignmentDialogRef.componentInstance.heading = 'Edit Model';
    editModelAssignmentDialogRef.componentInstance.saveButtonTitle = 'Update';
    editModelAssignmentDialogRef.componentInstance.mode = 'Edit';
    editModelAssignmentDialogRef.componentInstance.organizationId = this.organizationId;
    editModelAssignmentDialogRef.componentInstance.setEditFormValues(assignedModel);
    editModelAssignmentDialogRef.afterClosed().subscribe(result => {
      this.getAllModels();
    });

  }

  updateNQubeModel (row) {
    let finalModel = Object.assign({}, row);
    delete finalModel['_id'];
    const payload = { modelId: row._id, modelData: finalModel };
       // this.loaderService.show();
    this.modelService.updateAssignmentModel(payload).subscribe(data => {
      this.toaster.success('Model Updated successfully');
      this.loaderService.hide();
      this.getAllModels();
    },() => {
      this.toaster.error('Model could not be updated');
      // this.loaderService.hide();
      this.getAllModels();
    });
  }

  deleteModel (assignedModel) {
    let deleteUserSetupAlert = new SweetAlertController();
    deleteUserSetupAlert.deleteConfirm({}, () => {
      this.loaderService.show();
      const payload = { modelId: assignedModel._id };
      this.modelService.removeModel(payload).subscribe(data => {
        this.toaster.success('Model is deleted successfully');
        this.loaderService.hide();
        this.getAllModels();
      },() => {
        this.toaster.error('Something went wrong');
        this.loaderService.hide();
        this.getAllModels();
      });
    });
  }

  deActivateModel (row) {
    const activeStatus = row.active ? 'Activate' : 'Deactivate';
    this.showConfirmation(`Are you sure you want to ${activeStatus} model?`, () => {
      if (!isNullOrUndefined(this.records) && this.records.length > 0) {
        this.records.every((record) => {
          if (record._id === row._id) {
            record.active = row.active;
            return false;
          } else return true;
        });
      }
      this.updateNQubeModel(row);
    }, () => {
      this.getAllModels();
    });
  }

  showConfirmation (msg, yesCallback, noCallback) {
    let swalert = new SweetAlertController();
    const options = {
      title: 'Confirm Message',
      text: msg,
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
    swalert.deleteConfirm(options, yesCallback, noCallback);
  }

}

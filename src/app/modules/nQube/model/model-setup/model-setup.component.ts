import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { ModelSetupService } from './model-setup.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { ModelSetup } from './model-setup';
import { MatDialog } from '@angular/material';
import { AddEditModelSetupComponent } from './add-edit-model-setup/add-edit-model-setup.component';
import { ExecuteFileComponent } from '../model-assignment/add-edit-model/execute.file.component';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-model-setup',
  templateUrl: './model-setup.component.html',
  providers: [ModelSetupService],
  styleUrls: ['./model-setup.component.scss']
})

export class ModelSetupComponent implements OnInit {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  modelSetups: ModelSetup[];
  errorMessage: any;
  displayStatus: boolean = false;
  showDeactivateButton: boolean = true;
  showTestButton: boolean = true;

  columns: Array<any> = [
    {
      title: 'MODEL NAME',
      key: 'modelname',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'LANGUAGE',
      key: 'language',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'CREATED ON',
      key: 'createdOn',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'MODEL FILE NAME',
      key: 'modelFileName',
      sortable: true,
      filter: true,
      link: false
    }

  ];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Model Setup',
      base: false,
      link: '',
      active: true
    }

  ];

  dialogOptions: any = {
    width: '450px'
  };
  executeFileOptions: any = {
    width: '640px',
    height: '480px'
  };
  records: Array<any> = [];
  selectedEntities: any[];
  totalRows: number = 0;
  searchBox: boolean = true;
  hasActionButtons: boolean = true;
  hasSuperAdminRole: boolean = false;
  showClientList: boolean = false;
  clients;
  organizationId;

  constructor (
    public dialog: MatDialog,
    private _router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private modelSetupService: ModelSetupService,
    private httpService: HttpService,
    public toaster: ToastrService
  ) { }

  ngOnInit () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    this.hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });

    if (this.hasSuperAdminRole) {
      this.showClientList = true;
      this.getAllClients();

    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.getModelSetupList();
    }
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
    this.getModelSetupList();
  }

  checkBoxSelectionChange (data: any) {
    this.selectedEntities = data;
  }

  getModelSetupList () {

    this.loaderService.show();
    this.modelSetupService.getModelSetups({ organizationId: this.organizationId }).subscribe(modelSetups => {
      this.records = modelSetups;
      this.records.forEach((record) => { record.modelFileName = record.uploadFile.name; });
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      this.loaderService.hide();
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    });
  }

  gotoLink (data: any) {
    this._router.navigate(['edit/' + data.row._id], { relativeTo: this.route });
  }

  saveModelSetup (rule: ModelSetup) {
    this.modelSetupService.saveModelSetup(rule).subscribe(
      modelSetups => this.modelSetups = modelSetups,
      error => this.errorMessage = error as any
    );
  }

  addOrUpdateModelSetup (rule: ModelSetup) {
    this.modelSetupService.addOrUpdateModelSetup(rule).subscribe(modelSetups => {
      this.modelSetups = modelSetups;
    }, error => {
      this.errorMessage = error as any; this.toaster.error('Something went wrong');
    });
  }

  createModelPopup () {

    let addModelDialogRef = this.dialog.open(AddEditModelSetupComponent, this.dialogOptions);
    addModelDialogRef.componentInstance.mode = 'Add';
    addModelDialogRef.componentInstance.organizationId = this.organizationId;
    addModelDialogRef.afterClosed().subscribe((result) => {
      this.loaderService.show();
      this.getModelSetupList();
    });

  }

  editModelSetupPopup (data: any) {
    let editModelDialogRef = this.dialog.open(AddEditModelSetupComponent, this.dialogOptions);
    editModelDialogRef.componentInstance.heading = 'Edit Model';
    editModelDialogRef.componentInstance.mode = 'Edit';
    editModelDialogRef.componentInstance.saveBtnTitle = 'Update';
    editModelDialogRef.componentInstance.organizationId = this.organizationId;
    editModelDialogRef.componentInstance.setEditFormValues(data);
    editModelDialogRef.afterClosed().subscribe(result => {
      this.getModelSetupList();
    });

  }

  openExecutePopup (row?) {
    let executeFilePopup = this.dialog.open(ExecuteFileComponent, this.executeFileOptions);
    executeFilePopup.componentInstance.heading = 'Select Model To Run';
    row['modelName'] = row['_id'];
    executeFilePopup.componentInstance.setEditFormValues(row);
    executeFilePopup.afterClosed().subscribe(result => {

    });
  }

  deleteModelSetup (data: any) {
    let deleteRoleSetUpAlert = new SweetAlertController();
    let txtMsg = 'Do you want to delete the ' + data.modelname + ' ?';
    this.showConfirmationMsg(txtMsg,() => {
      this.loaderService.show();
      const checkPayload = { modelId: data._id, organizationId: this.organizationId , shouldCheckActive: false };
      this.modelSetupService.checkDependentModels(checkPayload).subscribe(checkedModels => {
        const notSafeToDelete = (!isNullOrUndefined(checkedModels.modelCount) && checkedModels.modelCount > 0);
        if (notSafeToDelete) {
          this.toaster.error(`Model cannot be deleted as this model is assigned`);
          this.loaderService.hide();
        } else {
          this.modelSetupService.deleteModelSetup(data).subscribe(modelSetups => {
            this.toaster.success('Model is deleted successfully');
            this.loaderService.hide();
            this.getModelSetupList();
          },(error) => {
            this.errorMessage = error as any;
            this.loaderService.hide();
            this.toaster.error('Something went wrong');
          });
        }
      }, () => {
        this.loaderService.hide();
        this.toaster.error('Something went wrong');
      });
    },() => {});
  }

  showConfirmationMsg (textMsg,callbackfn,noCallbackfn) {
    let confimMsg = new SweetAlertController();
    let options = {
      title: 'Confirm Message',
      text: textMsg,
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
    confimMsg.deleteConfirm(options,callbackfn,noCallbackfn);
  }

  deActiveModel (row) {
    const activeStatus = row.active ? 'Activate' : 'Deactivate';
    row['id'] = row['_id'];
    this.showConfirmationMsg(`Are you sure you want to ${activeStatus} model?`, () => {
      this.loaderService.show();
      const checkPayload = { modelId: row._id, organizationId: this.organizationId, shouldCheckActive: !row.active };
      this.modelSetupService.checkDependentModels(checkPayload).subscribe(checkedModels => {
        const notSafeToDeactivate = (!isNullOrUndefined(checkedModels.modelCount) && checkedModels.modelCount > 0) && !row.active;
        if (notSafeToDeactivate) {
          this.toaster.error('The model cannot be Deactivated because active models are assigned');
          this.loaderService.hide();
          this.getModelSetupList();
        } else {
          this.loaderService.hide();
          this.addOrUpdateModelSetup(row);
        }
      },() => {
        this.loaderService.hide();
        this.getModelSetupList();
      });
    }, () => {
      this.getModelSetupList();
    });
  }

}

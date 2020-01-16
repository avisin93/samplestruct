import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../shared/providers/http.service';
import { ToastrService } from 'ngx-toastr';
import { UrlDetails } from '../../models/url/url-details.model';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { StorageService } from '../shared/providers/storage.service';
import { LoaderService } from '../shared/components/loader/loader.service';

@Component({
  selector: 'app-client-role-setup-tab',
  templateUrl: './client-role-setup.component.html',
  styleUrls: ['./client-role-setup.component.scss']
})

export class ClientRoleSetupTabComponent implements OnInit {

  @ViewChild(NgDataTablesComponent) private dataTableComp: NgDataTablesComponent;
  showClientList: boolean = false;
  organizationId;
  clients;
  hasSuperAdminRole;
  hasProductAdminRole;
  columns: Array<any> = [
    {
      title: 'ROLE NAME',
      key: 'roleName',
      sortable: true,
      filter: true
    },
    {
      title: 'CLIENT NAME',
      key: 'organizationName',
      sortable: true,
      filter: true
    },
    {
      title: 'PRODUCT NAME',
      key: 'productName',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 10;

  hasActionButtons: boolean = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Role Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '400px',
    height: '200px',
    panelClass: 'appModalPopup'
  };

  constructor (public dialog: MatDialog, private _router: Router,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService,
        public loaderService: LoaderService) {

  }

  ngOnInit () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    this.hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });
    this.hasProductAdminRole = userRoles.find((role) => {
      return role.roleName === 'PRODUCTADMIN';
    });
    if (this.hasSuperAdminRole || this.hasProductAdminRole) {
      this.showClientList = true;
      this.getAllClients();
    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.getAllRoles();
    }
  }

  getAllClients () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
        this.onClientChange(this.clients[0]._id);
      }
      this.loaderService.hide();
    }, (error) => {
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.loaderService.hide();
    });
  }

  onClientChange (value) {
    this.organizationId = value;
    this.getAllRoles();
  }

  getAllRoles () {
    this.httpService.get(UrlDetails.$exelaGetAllRolesUrl, { organizationId: this.organizationId }).subscribe(response => {
      this.records = response;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
    }, (error) => {
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.dataTableComp.setPage(1);
    });
  }

  addRole () {
    if ((this.hasSuperAdminRole || this.hasProductAdminRole) && !this.organizationId) {
      this.toastController.error('Please Select Client');
    } else {
      this._router.navigate(['add/' + this.organizationId], { relativeTo: this.route });
    }
  }

  editRoleSetup (data: any) {
    if (typeof data._id !== 'undefined') {
      if (data.roleName === 'CLIENTADMIN' || data.roleName === 'SUPERADMIN' || data.roleName === 'PRODUCTADMIN') {
        this.toastController.error(data.roleName + ' Role details can not be edited.');
      } else {
        this._router.navigate(['edit/' + data._id + '/' + this.organizationId],{ relativeTo: this.route });
      }
    }
  }

  deleteRole (record: any) {
    if (record.roleName === 'CLIENTADMIN' || record.roleName === 'SUPERADMIN' || record.roleName === 'PRODUCTADMIN') {
      this.toastController.error(record.roleName + ' Role details can not be Deleted.');
    } else {
      let deleteClientSetupAlert = new SweetAlertController();
      deleteClientSetupAlert.deleteConfirm({}, () => {
        record.active = false;
        this.httpService.update(UrlDetails.$exelaCreateOrUpdateClientProductRoleUrl, record).subscribe(response => {
          this.toastController.success('Record deleted Successfully');
          this.getAllRoles();
        }, error => {
          console.log(error);
          this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
        });
      });
    }
  }

}

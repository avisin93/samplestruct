import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { UrlDetails } from '../../models/url/url-details.model';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../shared/providers/storage.service';
import { HttpService } from '../shared/providers/http.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { UploadListComponent } from './add-edit-exela-client-user/upload-list/upload-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-user-setup',
  templateUrl: './exela-client-user-setup.component.html',
  styleUrls: ['./exela-client-user-setup.component.scss']
})

export class ExelaClientUserSetupComponent implements OnInit {
  organizationId = '';
  organizationName: string = '';
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  columns: Array<any> = [
    {
      title: 'USER NAME',
      key: 'fullname',
      sortable: true,
      filter: true
    },
    {
      title: 'LOGIN NAME',
      key: 'username',
      sortable: true,
      filter: true
    },
    {
      title: 'ROLES',
      key: 'roleName',
      sortable: true,
      filter: true
    },
    {
      title: 'EMAIL ID',
      key: 'email',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 1;

  hasActionButtons: boolean = true;

  showClientList: boolean = false;

  clients;

  userList: Array<any> = [];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'User Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '800px',
    height: '440px',
    panelClass: 'appModalPopup'
  };

  constructor (private _router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        private toaster: ToastrService,
        private loaderService: LoaderService,
        private dialog: MatDialog) {

  }

  ngOnInit () {
    const userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    const hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });
    const hasProductAdminRole = userRoles.find((role) => {
      return role.roleName === 'PRODUCTADMIN';
    });
    if (hasSuperAdminRole || hasProductAdminRole) {
      this.showClientList = true;
      this.getAllClients();
    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.httpService.get(UrlDetails.$exela_getClientUrl + '/' + this.organizationId, {}).subscribe(response => {
        this.organizationName = response[0].organizationname;
        this.getAllUsers();
      }, (error) => {
        console.log(error);
        this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
      });
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
      this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.loaderService.hide();
    });
  }

  onClientChange (value) {
    this.organizationId = value;
    if (this.organizationId !== '') {
      this.httpService.get(UrlDetails.$exela_getClientUrl + '/' + this.organizationId, {}).subscribe(response => {
        this.organizationName = response[0].organizationname;
        this.getAllUsers();
      }, (error) => {
        console.log(error);
        this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
      });
    } else {
      this.organizationName = '';
      this.records = [];
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
    }
  }
  getAllUsers () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getClientRolesUrl, { organizationId: this.organizationId }).subscribe((response) => {
      let tmpRoles = [];
      response.forEach((role) => {
        if (role.active === true) {
          tmpRoles.push({ value: role._id, text: role.roleName });
        }
      });
      this.httpService.get(UrlDetails.$exela_getAllClientUsersUrl + this.organizationId, {}).subscribe(response => {
        let userList = [];
                // this.refactorUser(response);
        response.forEach((user) => {
          let roleNames = '';
          if (user.roles) {
            for (let index = 0; index < user.roles.length; index++) {
              let role = tmpRoles.find(role => role.value === user.roles[index].roleId);
              if (role) {
                roleNames += user.roles[index].roleName + ', ';
              }
            }
            roleNames = roleNames.substring(0, roleNames.length - 2);
          }
          userList.push({
            _id: user._id,
            fullname: user.firstname + ' ' + user.lastname,
            organizationname: this.organizationName,
            username: user.username,
            email: user.email,
            roleName: roleNames,
            isBlocked: user.isBlocked
          });
        });
        this.records = userList;
        this.dataTableComp.setPage(1);
        this.totalRows = this.records.length;
        this.loaderService.hide();
      }, (error) => {
        console.log(error);
        this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
        this.dataTableComp.setPage(1);
        this.loaderService.hide();
      });
    }, (error) => {
      console.log(error);
      this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    });
  }

  editUser (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id + '/' + this.organizationId], { relativeTo: this.route });
    }
  }

  deleteUser (record: any) {
    const deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update(UrlDetails.$exela_updateUserUrl, record).subscribe(response => {
        const request = {
          organizationId: this.organizationId,
          username: record.username,
          customAttrReq: {
            customAttrName: 're_route_search_history'
          }
        };
        // TODO VIDO
        this.httpService.update('UrlDetails.$updateAttributesOnDelete', request).subscribe(response => {
          this.toaster.success('Record deleted Successfully');
          this.getAllUsers();
        }, error => {
          console.log(error);
          this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
        });
      }, (error) => {
        console.log(error);
        this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
      });

    });
  }

  addUser () {
    if (this.organizationId === '') {
      this.toaster.error('Please Select Client');
    } else {
      this._router.navigate(['add/' + this.organizationId], { relativeTo: this.route });
    }
  }

  uploadListPopup () {
    if (this.organizationId !== '') {
      let dialogRef = this.dialog.open(UploadListComponent, {
        height: '308px',
        width: '462px',
        panelClass: 'appModalPopup'
      });
      dialogRef.componentInstance.organizationId = this.organizationId;
      dialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          this.getAllUsers();
        }
      });
    } else {
      this.toaster.error('Please Select Client.');
    }
  }

  refactorUser (users) {
    this.userList = [];
    for (let user of users) {
      let roleNames = '';
      if (user.roles) {
        for (let index = 0; index < user.roles.length; index++) {
          if (index < user.roles.length - 1) {
            roleNames += user.roles[index].roleName + ',';
          } else {
            roleNames += user.roles[index].roleName;
          }
        }
      }
      let attValue = false;
      for (let userAttr of user.userAttributes) {
        if (userAttr.att_name === 'forceChangePassword') {
          attValue = userAttr.att_value;
          break;
        }
      }
      this.userList.push({
        firstName: user.firstname,
        lastName: user.lastname,
        userName: user.username,
        email: user.email,
        roleName: roleNames,
        Force_to_change_password: attValue
      });
    }
  }

  exportAsExcelFile () {
    if (this.records.length) {
      window.open(UrlDetails.$downloadUsers + this.organizationId, '_blank');
    } else {
      this.toaster.error('No record found.');
    }
        //   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('excelTable'),{raw:true});
        //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        //   XLSX.writeFile(wb, 'users_export_' + new Date().getTime() + '.xlsx');
  }

  blockUnblock (data: any) {
    const user = {
      userId: data._id,
      isBlocked: data.isBlocked
    };
    this.httpService.get(UrlDetails.$exela_blockUnblockUserUrl, user).subscribe(response => {
      this.toaster.info('Exela Auth', 'Successfully');
    }, (error) => {
      console.log(error);
      this.toaster.error('Error Exela Auth', 'Exela Auth is not available at moment');
    });
  }

}

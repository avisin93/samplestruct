import { Component, OnInit, OnDestroy, ViewChild,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { StorageService } from '../shared/providers/storage.service';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { SessionService } from '../shared/providers/session.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-client-setup',
  templateUrl: './exela-client-setup.component.html',
  styleUrls: ['./exela-client-setup.component.scss']
})

export class ExelaClientSetupComponent implements OnInit {

  @ViewChild(NgDataTablesComponent) private dataTableComp: NgDataTablesComponent;
  @Input() showDeleteButton: boolean = false;

  records: Array<any> = [];
  totalRows: number = 0;
  hasActionButtons: boolean = true;
  allowClientAdd: boolean = false;
  showUsersButton: boolean = false;

  columns: Array<any> = [
    {
      title: 'CLIENT CODE',
      key: 'organizationcode',
      sortable: true,
      filter: true
    },
    {
      title: 'CLIENT NAME',
      key: 'organizationname',
      sortable: true,
      filter: true
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
      text: 'Client Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (
      private _router: Router,
      private route: ActivatedRoute,
      public httpService: HttpService,
      public toastController: ToastrService,
      private loaderService: LoaderService
  ) {}

  ngOnInit () {
    const userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    const hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });
    const hasProductAdminRole = userRoles.find((role) => {
      return role.roleName === 'PRODUCTADMIN';
    });
    if (hasSuperAdminRole || hasProductAdminRole) {
      this.allowClientAdd = true;
      this.showDeleteButton = true;
      this.showUsersButton = false;
    }
    this.getAllClient();
  }

  getAllClient () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      this.dataTableComp.setPage(1);
      let tmpRecords = [];
      response.forEach((item: any) => {
        if (item.active) {
          tmpRecords.push(item);
        }
      });
      this.records = tmpRecords;
      this.totalRows = this.records.length;
      this.loaderService.hide();
    }, (error) => {
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
    });
  }

  showUsers (data: any) {
    if (typeof data._id !== 'undefined') {
      StorageService.set(StorageService.organizationId, data._id);
      StorageService.set(StorageService.organizationName, data.organizationname);
      const base = SessionService.get('base-role');
      this._router.navigate(['/' + base + '/exela-client-user-setup']);
    }
  }

  editClient (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id], { relativeTo: this.route });
    }
  }

  deleteClient (record: any) {
    const deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update(UrlDetails.$exela_createClientUrl, record).subscribe(response => {
        this.toastController.success('Client Deleted Successfully');
        this.getAllClient();
      }, (error) => {
        this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
        console.log(error);
      });
    });
  }
}

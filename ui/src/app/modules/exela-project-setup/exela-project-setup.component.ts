import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../shared/providers/storage.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-project-setup',
  templateUrl: './exela-project-setup.component.html',
  styleUrls: ['./exela-project-setup.component.scss']
})

export class ExelaProjectSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  showClientList: boolean = false;
  organizationId;
  clients;
  hasProductAdminRole;

  columns: Array<any> = [
    {
      title: 'PROJECT CODE',
      key: 'code',
      sortable: true,
      filter: true
    },
    {
      title: 'PROJECT NAME',
      key: 'name',
      sortable: true,
      filter: true
    },
    {
      title: 'START DATE',
      key: 'showopendate',
      sortable: true,
      filter: true
    },
    {
      title: 'TARGET CLOSE DATE',
      key: 'showtargetclosedate',
      sortable: true,
      filter: true
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
      text: 'Project Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (private _router: Router,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService,
        private loaderService: LoaderService) {

  }

  ngOnInit () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));

    this.hasProductAdminRole = userRoles.find((role) => {
      return role.roleName === 'PRODUCTADMIN';
    });
    this.hasProductAdminRole = true;
    if (this.hasProductAdminRole) {
      this.showClientList = true;
      this.getAllClients();

    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.getAllProjects();
    }
  }
  getAllClients () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
        this.onClientChange(this.clients[0]._id);
      }
    }, () => {
    });
  }
  onClientChange (value) {
    this.organizationId = value;
    this.getAllProjects();
  }

  addProject () {
    if (this.hasProductAdminRole && this.organizationId === '') {
      this.toastController.error('Please Select Client');
    } else {
      this._router.navigate(['add/' + this.organizationId], { relativeTo: this.route });
    }
  }

  getAllProjects () {
    this.loaderService.show();
    let reqData = {
      organizationId: this.organizationId
    };
    this.httpService.get(UrlDetails.$exela_getAllProjectsUrl + '?' + Date.now(), reqData).subscribe(response => {
      let tmpRecords = [];
      console.log(response);
      response.forEach((item: any) => {
        if (item.active) {

          if (item.opendate != null) {
            item['opendate'] = item.opendate;
            item['showopendate'] = new Date(item.opendate).toLocaleDateString('en-US');
          }
          if (item.targetclosedate != null) {
            item['targetclosedate'] = item.targetclosedate;
            item['showtargetclosedate'] = new Date(item.targetclosedate).toLocaleDateString('en-US');
          }

          tmpRecords.push(item);
        }
      });

      this.records = tmpRecords;
      this.totalRows = tmpRecords.length;
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
    });
  }

  editClient (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id], { relativeTo: this.route });
    }
  }

  deleteClient (record: any) {
    record.openDate = new Date(record.openDate).getTime();
    record.closeDate = new Date(record.closeDate).getTime();
    record.targetCloseDate = new Date(record.targetCloseDate).getTime();
    record.openDate = record.openDate === 0 ? null : record.openDate;
    record.closeDate = record.closeDate === 0 ? null : record.closeDate;
    record.targetCloseDate = record.targetCloseDate === 0 ? null : record.targetCloseDate;

    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.delete(UrlDetails.$exela_addOrUpdateProjectUrl, record)
                .subscribe(response => {
                  this.toastController.success('Record deleted Successfully');
                  this.getAllProjects();
                }, () => {
                  this.toastController.error('Something went wrong, Please try again.');
                });

    });
  }

  ngOnDestroy () {

  }

}// class

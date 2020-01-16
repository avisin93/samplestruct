import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-setup',
  templateUrl: './client-setup.component.html',
  styleUrls: ['./client-setup.component.scss']
})

export class ClientSetupComponent implements OnInit {

  @ViewChild(NgDataTablesComponent) private dataTableComp: NgDataTablesComponent;
  columns: Array<any> = [
    {
      title: 'CLIENT CODE',
      key: 'organizationCode',
      sortable: true,
      filter: true
    },
    {
      title: 'CLIENT NAME',
      key: 'name',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'EMAIL ID',
      key: 'primaryContactEmail',
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
      text: 'Client Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (private _router: Router,
        private route: ActivatedRoute,
        public httpService: HttpService,
        public toastController: ToastrService) {

  }

  ngOnInit () {
    this.getAllClient();
  }

  getAllClient () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      this.records = response;
      this.totalRows = response.length;
      this.dataTableComp.setPage(1);
    }, (error) => {
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.dataTableComp.setPage(1);
    });
  }

  editClient (data: any) {
    if (typeof data.organizationId !== 'undefined') {
      this._router.navigate(['edit/' + data.organizationId], { relativeTo: this.route });
    }
  }

  deleteClient (record: any) {
    let client = { organizationId: record.organizationId };
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      // TODO: Vido
      this.httpService.delete('UrlDetails.$deleteClientUrl', client) .subscribe(response => {
        if (response.responseData) {
          this.toastController.success('Record deleted Successfully');
          this.getAllClient();
        } else {
          this.toastController.error('Selected Record is already deleted');
        }
      }, () => {
        this.toastController.error('Something went wrong, Please try again.');
      });
    });
  }
}// class

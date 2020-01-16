import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { LoaderService } from '../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../request.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-mail-template',
  templateUrl: './exela-mail-template.component.html',
  styleUrls: ['./exela-mail-template.component.scss']
})
export class ExelaMailTemplateComponent implements OnInit {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  columns: Array<any> = [
    {
      title: 'ACTION NAME',
      key: 'action',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  showDeleteButton: boolean = false;

  allowAddTemplate: boolean = true;

  clients;

  selectedClient;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Mail Template',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (
    private _router: Router,
    private route: ActivatedRoute,
    public httpService: HttpService,
    public requestService: RequestService,
    public toastController: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit () {
    this.loaderService.show();
    this.getAllClients();
  }

  getAllClients () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
        this.selectedClient = this.clients[0]._id;
        this.onClientChange(this.selectedClient);
      }
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
    });
  }

  getAllActions () {
    this.loaderService.show();
    const params = new HttpParams().set('organizationId', `${this.selectedClient}`);
    this.requestService.doGET('/api/reachout/notificationTemplatesByOrganizationId', 'API_CONTRACT', params).subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (item.active) {
          tmpRecords.push(item);
        }
      });
      this.records = tmpRecords;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
    });
  }

  editAction (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id + '/' + data.organization_id],{ relativeTo: this.route });
    }
  }

  deleteAction (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.requestService.doDELETE(`/api/reachout/notificationTemplates/${record._id}`, 'API_CONTRACT').subscribe(response => {
        this.toastController.success('Action Template Deleted Successfully');
        this.getAllActions();
      }, () => {
        this.toastController.error('Something went wrong, Please try again.');
      });
    });
  }

  onClientChange (value) {
    this.selectedClient = value;
    this.getAllActions();
  }

  ngOnDestroy () {}
}

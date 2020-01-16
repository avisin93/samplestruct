import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { StorageService } from '../shared/providers/storage.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auto-routing-setup',
  templateUrl: './exela-auto-routing.component.html',
  styleUrls: ['./exela-auto-routing.component.scss']
})

export class ExelaAutoRoutingComponent implements OnInit {

  @ViewChild(NgDataTablesComponent) private dataTableComp: NgDataTablesComponent;
  @Input() showDeleteButton: boolean = false;
  @Input() showDownArrowButton: boolean = true;
  @Input() showUpArrowButton: boolean = true;

  showClientList: Boolean = false;
  records: Array<any> = [];
  totalRows: number = 0;
  hasActionButtons: boolean = true;
  routingRuleFor: '';
  clients;
  selectedClient: any = null;
  organizationId;

  columns: Array<any> = [
    {
      title: 'RULE NAME',
      key: 'ruleName',
      sortable: true,
      filter: true
    },
    {
      title: 'EVENT TYPE',
      key: 'eventType',
      sortable: true,
      filter: true
    },
    {
      title: 'INVOCATION TRIGGER',
      key: 'invocationTrigger',
      sortable: true,
      filter: true
    },
    {
      title: 'PRIORITY',
      key: 'priority',
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
      text: 'Routing Rule',
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
  ) { }

  ngOnInit () {
    this.route.params.subscribe((params: any) => {
      StorageService.set(StorageService.autoRoutingRuleFor, params.ruleFor);
    });
    if (StorageService.get(StorageService.userRole) === 'SUPERADMIN') this.showClientList = true;
    this.loaderService.show();
    this.getAllClients();
  }

  getAllClients () {
    if (StorageService.get(StorageService.userRole) === 'SUPERADMIN') {
      this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
        if (response.length !== 0) {
          this.clients = response;
          this.selectedClient = this.clients[0];
          this.getAutoRoutingList();
        }
      }, (error) => {
        console.log(error);
        this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
      });
    } else {
      this.getAutoRoutingList();
    }
  }
  getAutoRoutingList () {
    this.loaderService.show();
    const reqData = {
      organizationCode: null,
      username: null,
      ruleFor: StorageService.get(StorageService.autoRoutingRuleFor)
    };
    if (StorageService.get(StorageService.userRole) !== 'SUPERADMIN') {
      reqData.organizationCode = StorageService.get(StorageService.organizationCode);
      this.organizationId = StorageService.get(StorageService.organizationId);
    } else {
      this.organizationId = this.selectedClient._id;
      reqData.organizationCode = this.selectedClient.organizationcode;
    }
    reqData.username = StorageService.get(StorageService.userName);

    this.httpService.get(UrlDetails.$getAutoRoutingListUrl, reqData).subscribe(response => {
      const tmpRecords = [];
      response.forEach((item: any) => {
        if (item.active) {
          item.priority = item.conditions.priority;
          item.eventType = item.event.params.action.name;
          tmpRecords.push(item);
        }
      });
      this.records = tmpRecords;
      this.totalRows = this.records.length;
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    }, (error) => {
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
      this.loaderService.hide();
      this.dataTableComp.setPage(1);
    });
  }

  editAutoRouting (data) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id + '/' + this.organizationId], { relativeTo: this.route });
    }
  }

  deleteAutoRouting (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      record.active = false;
      this.httpService.update(UrlDetails.$saveAutoRoutingUrl, record).subscribe(response => {
        this.toastController.success('Auto Routing Rule Deleted Successfully');
        this.getAutoRoutingList();
      }, (error) => {
        console.log(error);
        this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment')
      });

    });
  }

  increasePriority (record: any) {
    this.records.forEach((element, index) => {
      if (element._id === record._id) {
        if (index !== 0) {
          const priority = element.priority;
          element.priority = this.records[index - 1].priority;
          this.records[index - 1].priority = priority;
          const reqData = [{
            id: element._id,
            priority: element.priority
          },
            {
              id: this.records[index - 1]._id,
              priority: this.records[index - 1].priority
            }
          ];
          this.updatePriority(reqData);
        }
      }
    });
  }

  decreasePriority (record: any) {
    this.records.forEach((element, index) => {
      if (element._id === record._id) {
        if (index !== (this.records.length - 1)) {
          const priority = element.priority;
          element.priority = this.records[index + 1].priority;
          this.records[index + 1].priority = priority;
          const reqData = [{
            id: element._id,
            priority: element.priority
          },
            {
              id: this.records[index + 1]._id,
              priority: this.records[index + 1].priority
            }
          ];
          this.updatePriority(reqData);
        }
      }
    });
  }

  updatePriority (reqData) {
    this.httpService.save(UrlDetails.$updateAutoRoutingRulePriority, reqData).subscribe(response => {
      this.getAutoRoutingList();
    }, (error) => {
      console.log(error);
      this.toastController.error('Error Exela Auth', 'Exela Auth is not available at moment');
    });
  }
}// class

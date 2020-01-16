import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { HttpService } from '../shared/providers/http.service';
import { UrlDetails } from '../../models/url/url-details.model';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { StorageService } from '../shared/providers/storage.service';
import { AddEditExelaPulseSetupComponent } from './add-edit-exela-pulse-setup/add-edit-exela-pulse-setup.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../shared/components/loader/loader.service';
import { HttpParams } from '@angular/common/http';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-exela-pulse-setup',
  templateUrl: './exela-pulse-setup.component.html',
  styleUrls: ['./exela-pulse-setup.component.scss']
})

export class ExelaPulseSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  columns: Array<any> = [

    {
      title: 'GRAPH TITLE',
      key: 'graph_title',
      sortable: true,
      filter: true
    },
    {
      title: 'GRAPH TYPE',
      key: 'graph_type',
      sortable: true,
      filter: true
    },
    {
      title: 'SERVICE NAME',
      key: 'graph_code',
      sortable: true,
      filter: true
    },
    {
      title: 'GRAPH SEQUENCE',
      key: 'sequence',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 1;

  graphCodes = [
    { 'value': 'GC0001', 'key': 'Aging Summary' },
    { 'value': 'GC0002', 'key': 'Mail Action Distribution' },
    { 'value': 'GC0003', 'key': 'Top 10 Recipients' },
    { 'value': 'GC0004', 'key': 'Top 10 Senders' },
    { 'value': 'GC0005', 'key': 'Top 10 mail Scaning location' },
    { 'value': 'GC0006', 'key': 'Document Scanning Volumes' }
  ];

  graphTypes = [
    { value: 'barChart', key: 'Bar Chart' },
    { value: 'barWithLineChart', key: 'Bar With Line Chart' },
    { value: 'bubleChart', key: 'Buble Chart' },
    { value: 'donutChart', key: 'Donut Chart' },
    { value: 'horizontalBarChart', key: 'Horizontal Bar' },
    { value: 'lineChart', key: 'Line Chart' },
    { value: 'multiAxisBar', key: 'Multi AxisBar' },
    { value: 'multiAxisLineChart', key: 'Multi Axis Line Chart' },
    { value: 'multiBarChart', key: 'Multi Bar Chart' },
    { value: 'pieChart', key: 'Pie Chart' },
    { value: 'polarAreaChart', key: 'Polar Area Chart' },
    { value: 'pointStyleChart', key: 'Point Style Chart' },
    { value: 'radarChart', key: 'Radar Chart' },
    { value: 'scatterChart', key: 'Scatter Chart' },
    { value: 'scatterMultiAxisChart', key: 'Scatter Multi Axis Chart' },
    { value: 'stackedBarChart', key: 'Stacked Bar' },
    { value: 'stackedGroupBarChart', key: 'Stacked Group Bar Chart' },
    { value: 'stappedLineChart', key: 'Stapped Line Chart' }
  ];

  hasActionButtons: boolean = true;
  showDeactivateButton: boolean = true;
  deactivateCheckbox: boolean = true;
  activeLabel: string = 'Active';
  clients;
  selectedClient;
  showClientList: boolean = false;
  showDownArrowButton: boolean = true;
  showUpArrowButton: boolean = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Pulse Setup',
      base: false,
      link: '',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '710px',
    height: '510px'
  };

  constructor (
    public dialog: MatDialog,
    private httpService: HttpService,
    private requestService: RequestService,
    private toaster: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    let hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });
    let hasProductAdminRole = userRoles.find((role) => {
      return role.roleName === 'PRODUCTADMIN';
    });
    this.loaderService.show();
    if (hasSuperAdminRole || hasProductAdminRole) {
      this.showClientList = true;
      this.getAllClients();
    } else {
      let organizationId = StorageService.get(StorageService.organizationId);
      this.getAllPulseConfigs(organizationId);
    }
  }

  getAllClients () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
        this.selectedClient = this.clients[0]._id;
        this.getAllPulseConfigs(this.clients[0]._id);
      }
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
    });
  }

  getAllPulseConfigs (value) {
    this.selectedClient = value;
    const params = new HttpParams().set('organizationId', `${this.selectedClient}`);
    this.requestService.doGET('/api/pulseByOrganization','API_CONTRACT', params).subscribe(response => {
      this.getGraphCodeName(response);
      this.records = response as Array<any>;
      this.totalRows = this.records.length;

      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
    });
  }

  addPulsePopup () {
    if (this.selectedClient !== '') {
      let addUserDialogRef = this.dialog.open(AddEditExelaPulseSetupComponent, this.dialogOptions);
      addUserDialogRef.componentInstance.heading = 'Add Pulse Setup';
      addUserDialogRef.componentInstance.saveBtnTitle = 'Add';
      addUserDialogRef.componentInstance.mode = 'Add';
      addUserDialogRef.componentInstance.organizationId = this.selectedClient;
      addUserDialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          this.getAllPulseConfigs(this.selectedClient);
        }
      });
    } else {
      this.toaster.error('Please Select Client');
    }
  }

  editPulsePopup (pulse) {
    let editUserDialogRef = this.dialog.open(AddEditExelaPulseSetupComponent, this.dialogOptions);
    editUserDialogRef.componentInstance.heading = 'Edit Pulse Setup';
    editUserDialogRef.componentInstance.saveBtnTitle = 'Save';
    editUserDialogRef.componentInstance.mode = 'Edit';
    editUserDialogRef.componentInstance.selectedChartType = pulse.graph_type;
    const preparedData: any = {
      _id: pulse._id,
      graphCode: pulse.graph_code,
      graphTitle: pulse.graph_title,
      graphType: pulse.graph_type,
      options: pulse.options,
      organizationId: pulse.organization_id,
      sequence: pulse.sequence,
      active: pulse.active
    };
    editUserDialogRef.componentInstance.setEditFormValues(preparedData);
    editUserDialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.getAllPulseConfigs(this.selectedClient);
      }
    });

  }

  deletePulseConfig (pulse) {
    let deleteUserSetupAlert = new SweetAlertController();
    deleteUserSetupAlert.deleteConfirm({}, () => {
      pulse.active = false;
      pulse.isDeleted = true;
      pulse.graphCode = pulse.graphCode + '_' + new Date().getTime();
      this.requestService.doDELETE(`/api/pulse/${pulse._id}`, 'API_CONTRACT').subscribe(response => {
        this.getAllPulseConfigs(this.selectedClient);
        this.toaster.success('Pulse Configuration deleted successfully!');
      }, () => {
        this.toaster.error('something went wrong');
      });
    });
  }

  deActivate (pulse) {
    this.requestService.doPUT(`/api/pulse/${pulse._id}`, pulse, 'API_CONTRACT').subscribe(response => {
      this.getAllPulseConfigs(this.selectedClient);
    }, () => {
      this.toaster.error('something went wrong');
      pulse.active = !(pulse.active);
    });
  }

  onDeactivateClick (event) {
    if (this.deactivateCheckbox) {
      this.deactivateCheckbox = false;
      this.activeLabel = 'Deactive';
    } else {
      this.deactivateCheckbox = true;
      this.activeLabel = 'Active';
    }
    this.getAllPulseConfigs(this.selectedClient);
  }

  ngOnDestroy () {}

  getGraphCodeName (response) {
    response.forEach(element => {
      let graphCode = element.graphCode;
      let graphType = element.graphType;
      this.graphCodes.forEach(names => {
        if (graphCode === names.value) {
          element['graphCodeName'] = names.key;
        }
      });
      this.graphTypes.forEach(names => {
        if (graphType === names.value) {
          element['graphTypeName'] = names.key;
        }
      });
    });
  }

  increasePriority (records: any) {
    this.records.forEach((element, index) => {
      if (element._id === records._id) {
        if (index !== 0) {
          let sequence = element.sequence;
          element.sequence = this.records[index - 1].sequence;
          this.records[index - 1].sequence = sequence;
          let reqData = [{
            id: element._id,
            sequence: element.sequence
          },{
            id: this.records[index - 1]._id,
            sequence: this.records[index - 1].sequence
          }];
          this.updateSequence(reqData);
        }
      }
    }
    );
  }

  decresePriority (records: any) {
    this.records.forEach((element, index) => {
      if (element._id === records._id) {
        if (index !== (this.records.length - 1)) {
          let sequence = element.sequence;
          element.sequence = this.records[index + 1].sequence;
          this.records[index + 1].sequence = sequence;
          let reqData = [{
            id: element._id,
            sequence: element.sequence
          },{
            id: this.records[index + 1]._id,
            sequence: this.records[index + 1].sequence
          }];
          this.updateSequence(reqData);
        }
      }
    });
  }

  updateSequence (reqData) {
    this.requestService.doPOST('/api/pulse/upadtePulseSetupSequence', reqData, 'API_CONTRACT').subscribe(response => {
      this.getAllPulseConfigs(this.selectedClient);
    });
  }
}

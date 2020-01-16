import { Component, OnInit, ViewChild,Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgDataTablesComponent } from '../../shared/modules/ng-data-tables/ng-data-tables.component';
import { SweetAlertController } from '../../shared/controllers/sweet-alert.controller';
import { MatDialog } from '@angular/material';
import { CustomerSetUpService } from './exela-customer-setup.service';
import { ExelaCreateCustomerSetupComponent } from './exela-customer-create-setup/exela-create-customer-setup.component';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '../../request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-customer-setup',
  templateUrl: './exela-customer-setup.component.html',
  providers: [CustomerSetUpService],
  styleUrls: ['./exela-customer-setup.component.scss']
})
export class ExelaCustomerSetupComponent implements OnInit,OnChanges {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  showDeleteButton: boolean = true;
  showDeactivateButton: boolean = true;
  hasActionButtons: boolean = true;
  allowPoiFormAdd: boolean = true;
  showUsersButton: boolean = false;
  editRecord: boolean = false;
  totalRows: number = 0;
  mode: string = '';
  records: Array<any> = [];
  deleteRecord: Array<any> = [];
  public translatedText: string;

  @Output('emitCustomeSegmentData') emitCustomeData = new EventEmitter();
  @Output('deleteCustSegmentData') deleteCustSegment = new EventEmitter();
  @Output('segmentMode') segementMode = new EventEmitter();
  @Input() customeSegList: boolean = false;
  @Input() organizationId: string = '';
        // breadcrumbs: Array<any> = [
    //     {  text: 'Home', base: true,   link: '/home', active: false  },
    //     {  text: 'ReachOut', base: true, link: '/reachout-setup', active: false},
    //     {  text: 'POI List', base: true, link: '/ro-poi', active: false },
    //     { text: 'Customer Segment List', base: false, link: '', active: true } ];
  columns: Array<any> = [{ title: 'Customer Segment', key: 'customer_segment', sortable: true, filter: true } ];

  constructor (
    public requestService: RequestService,
    public toastController: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit () {
    this.getCustomerGroupDetails();
  }

  ngOnChanges () {
    if (this.customeSegList) {
      this.getCustomerGroupDetails();
    }
  }

  addCustomerGroup () {
    let addCustomerDialogRef = this.dialog.open(ExelaCreateCustomerSetupComponent, this.dialogOptions);
    addCustomerDialogRef.componentInstance.heading = 'Customer Segment Details';
    addCustomerDialogRef.componentInstance.mode = 'add';
    addCustomerDialogRef.afterClosed().subscribe(result => {
      this.getCustomerGroupDetails();
    });
  }

  getCustomerGroupDetails () {
    this.requestService.doGET('/api/reachout/customerGroups', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!item.deleteFlag && item.organization_id === this.organizationId) {
          tmpRecords.push(item);
        }
      });
      this.records = tmpRecords;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;

    }, () => {
      this.dataTableComp.setPage(1);
    });
  }

  deleteCustomerGroupDetail (record: any) {
    this.deleteRecord.push(record._id);
    this.deleteCustSegment.emit(this.deleteRecord);
    this.segementMode.emit('delete');
    let deleteClientSetupAlert = new SweetAlertController();
  }

  editCustomerGroupDeatil (data: any) {
    this.editRecord = true;
    this.segementMode.emit('edit');
    this.records.forEach(item => {
      if (item._id === data._id) {
        item.isEdit = true;
      } else {
        item.isEdit = false;
      }
    });
            // let editUserDialogRef = this.dialog.open(ExelaCreateCustomerSetupComponent, this.dialogOptions);
            // editUserDialogRef.componentInstance.heading = 'Edit Event Notification';
            // editUserDialogRef.componentInstance.setEditFormValues(data);
            // editUserDialogRef.componentInstance.mode = 'edit';
            // editUserDialogRef.afterClosed().subscribe(result => {
            //   this.getCustomerGroupDetails();
            // });
  }

  activateDeactivateCustSegment (record: any) {
    let txtMsg = '';
    if (!(record.active)) {
      txtMsg = 'Do you want to deactivate the ' + record.customer_segment + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + record.customer_segment + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.requestService.doPUT(`/api/reachout/customerGroups/${record._id}`, record, 'API_CONTRACT').subscribe(response => {
        this.toastController.success('Customer successfully updated');
      }, () => {
        this.toastController.error('Something Went Wrong');
      });
    }, () => {
      record.active = !(record.active);
    });
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

  customeSegment (event) {
    this.emitCustomeData.emit(event);
  }

  dialogOptions: any = {  width: '450px' };
}

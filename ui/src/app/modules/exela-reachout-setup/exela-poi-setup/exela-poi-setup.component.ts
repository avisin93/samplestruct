import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../shared/modules/ng-data-tables/ng-data-tables.component';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { StorageService } from '../../shared/providers/storage.service';
import { SweetAlertController } from '../../shared/controllers/sweet-alert.controller';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { MatDialog } from '@angular/material';
import { UploadListComponent } from './upload-list/upload-list-poi.component';
import { PoiSetUpService } from './exela-poi-setup.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exela-poi-setup',
  templateUrl: './exela-poi-setup.component.html',
  providers: [PoiSetUpService],
  styleUrls: ['./exela-poi-setup.component.scss']
})
export class ExelaPoiSetupComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  showDeleteButton: boolean = true;
  showDeactivateButton: boolean = true;
  columns: Array<any> = [
    {
      title: 'FIRST NAME',
      key: 'first_name',
      sortable: true,
      filter: true
    },
    {
      title: 'LAST NAME',
      key: 'last_name',
      sortable: true,
      filter: true
    },
    {
      title: 'POI ID',
      key: 'poi_id',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];
  mode: string = '';
  totalRows: number = 0;
  organizationId: String = '';
  hasActionButtons: boolean = true;
  showMailButton: boolean = false;
  allowPoiFormAdd: boolean = true;

  showUsersButton: boolean = false;
  showClientList: boolean = false;
  userRole: String = '';
  selectedClient;
  _id;
  clients;
  breadcrumbs: Array<any> = [
    {  text: 'Home',base: true, link: '/home', active: false },
    {  text: 'ReachOut', base: true, link: '/reachout-setup', active: false },
    {  text: 'POI List', base: false, link: '', active: true }
  ];

  constructor (
    private _router: Router,
    private route: ActivatedRoute,
    public httpService: HttpService,
    public toastController: ToastrService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private poisetupservice: PoiSetUpService
  ) {
    this.organizationId = StorageService.get(StorageService.organizationId);
    this.userRole = StorageService.get(StorageService.userRole);
  }

  ngOnInit () {
    this.route.data.subscribe((dataParams: any) => {
      this.route.params.subscribe((params: any) => {
        if (!isNullOrUndefined(params.organizationId)) {
          this.organizationId = params.organizationId;
        }
      });
    });

    if (this.userRole === 'SUPERADMIN' || this.userRole === 'PRODUCTADMIN') {
      this.loaderService.show();
      this.getAllClients();
      this.showClientList = true;
    } else {
      this.loaderService.show();
      this.getPoiDetails();
    }
  }

  getAllClients () {
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      if (response.length !== 0) {
        this.clients = response;
        if (isNullOrUndefined(this.organizationId) || this.organizationId === 'undefined') {
          this.organizationId = this.clients[0]._id;
        } else {
          this.organizationId = this.organizationId;
        }
        this.getPoiDetails();
      }
    }, () => {
      this.loaderService.hide();
    });
  }

  getPoiDetails () {
    this.poisetupservice.getAllPoiDetailService().subscribe(Poi => {
      let tmpRecords = [];
      Poi.forEach((item: any) => {
        if ((!item.deleteFlag && this.organizationId === item.organization_id)) {
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
  dialogOptions: any = {
    width: '400px',
    panelClass: 'appModalPopup'
  };

  navigateToAdd () {
    this._router.navigate(['create-poi/' + this.organizationId], { relativeTo: this.route });
  }

  deletePoiDetail (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      // record.active = false;
      this.poisetupservice.deletePoiDetailService(record._id).subscribe(response => {
        this.toastController.success('Poi Entry Deleted Successfully');
        this.getPoiDetails();
      }, () => {
        this.toastController.error('Something went wrong, Please try again.');
      });

    });
  }

  editPoiDetail (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id, { 'organizationId' : data.organization_id }], { relativeTo: this.route });
    }
  }

  activateDeactivatePoi (record: any) {
    let txtMsg = '';
    if (!(record.active)) {
      txtMsg = 'Do you want to deactivate the ' + record.first_name + ' ?';
    } else {
      txtMsg = 'Do you want to activate the ' + record.first_name + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.poisetupservice.updatePoiDetailService(record).subscribe(response => {
        this.getPoiDetails();
        this.toastController.success('Poi successfully updated');
      }, () => {
        this.toastController.error('Something went wrong');
      }, () => {});

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

  uploadListPopup (data: any) {
    this._id = this.organizationId;
    let addUserDialogRef = this.dialog.open(UploadListComponent, this.dialogOptions);
    addUserDialogRef.componentInstance.organizationid = this._id;
    addUserDialogRef.afterClosed().subscribe(result => {
      this.getPoiDetails();
    });
  }
    //   uploadListPopup() {
    //     let addUserDialogRef = this.dialog.open(UploadListComponent, this.dialogOptions);
    //     addUserDialogRef.componentInstance.organizationId= this.organizationId;
    //      addUserDialogRef.afterClosed().subscribe((result) => {
    //         this.getPoiDetails();
    //   });
    // }

  ngOnDestroy () {}
}

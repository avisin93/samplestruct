import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertController } from '../shared/controllers/sweet-alert.controller';
import { UrlDetails } from '../../models/url/url-details.model';
import { HttpService } from '../shared/providers/http.service';
import { NgDataTablesComponent } from '../shared/modules/ng-data-tables/ng-data-tables.component';
import { UtilitiesService } from '../shared/providers/utilities.service';
import { StorageService } from '../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit, OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  @Input('type') type: string = '';

  @Input('selectedFacility') selectedFacility: any = '';

  @Output('backToFacilities') backToFacilitiesEvent = new EventEmitter<any>();

  columns: Array<any> = [
    {
      title: 'GROUP NAME',
      key: 'groupName',
      sortable: true,
      filter: true,
      link: true
    },
    {
      title: 'PRODUCTS',
      key: 'products',
      sortable: true,
      filter: true
    },
    {
      title: 'USERS',
      key: 'users',
      sortable: true,
      filter: true
    },
    {
      title: 'APPROVAL MANAGERS',
      key: 'approvalManagers',
      sortable: true,
      filter: true
    }
  ];

  records: Array<any> = [];

  totalRows: number = 0;

  hasActionButtons: boolean = true;

  facility: any = {};

  isAddEditGroup: boolean = false;

  mode: string = '';

  selectedGroup: any = '';

  constructor (private _router: Router,
    private _route: ActivatedRoute,
    public httpService: HttpService,
    public toastController: ToastrService) {

  }

  ngOnInit () {
    this.getGroupsByFacilityId();
  }

  getGroupsByFacilityId () {
    if (this.selectedFacility !== '') {
      let facility = { facilityId : this.selectedFacility.facilityId ,organizationId: StorageService.get(StorageService.organizationId) };

      this.httpService.findById('UrlDetails.$getGroupListByFacilityIdUrl', facility).subscribe(response => { // TODO: Vido
        let data = response.responseData;
        if (data !== null) {
          data.forEach((item: any) => {
            item['products'] = UtilitiesService.arrayCollectionByKey(item['products'], 'productName');
            item['approvalManagers'] = UtilitiesService.arrayCollectionByKey(item['approvalManagers'], 'userName');
            item['users'] = item['users'].length;
          });
          this.records = data;
          this.totalRows = this.records.length;
        }

        this.dataTableComp.setPage(1);
      }, () => {
        this.totalRows = this.records.length;
        this.dataTableComp.setPage(1);
      });

      this.httpService.findById('UrlDetails.$getFacilityByIDUrl', facility).subscribe(response => { // TODO: Vido
        if (response.responseCode === '200') {
          this.facility = response.responseData;
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  gotoFacilities () {
    this.backToFacilitiesEvent.emit(true);
  }

  gotoLink (data: any) {
    if (data.columnKey === 'groupName') {
      this.mode = 'details';
      this.isAddEditGroup = true;
      this.selectedGroup = data.row;
    }
  }

  addGroup () {
    this.isAddEditGroup = true;
    this.mode = 'add';
  }

  editGroup (record: any) {
    if (typeof record.groupId !== 'undefined') {
      this.mode = 'edit';
      this.isAddEditGroup = true;
      this.selectedGroup = record;
    }
  }

  deleteGroup (record: any) {
    let deleteGroupConfirmAlert = new SweetAlertController();
    deleteGroupConfirmAlert.deleteConfirm({}, () => {
      let deleteGroupRequest = {
        groupId: record.groupId
      };

      this.httpService.remove('UrlDetails.$removeGroupUrl',deleteGroupRequest).subscribe(response => { // TODO: Vido
        if (response.responseCode === 200) {
          if (response.responseData === true) {
            this.toastController.success('Group deleted successfully');
            this.getGroupsByFacilityId();
          } else {
            this.toastController.success('Group deletion failed');
          }
        }
      }, (error) => {
        alert(error.status);
        this.toastController.success('Exception while deleting group, please try after some time');
      });
    });
  }

  backToGroups () {
    this.isAddEditGroup = false;
    this.getGroupsByFacilityId();
  }

  ngOnDestroy () {

  }

}

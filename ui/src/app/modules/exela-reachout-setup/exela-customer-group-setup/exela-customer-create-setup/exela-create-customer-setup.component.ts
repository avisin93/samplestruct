import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import { CustomerSetUpService } from '../exela-customer-setup.service';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-create-customer-setup',
  templateUrl: './exela-create-customer-setup.component.html',
  providers: [CustomerSetUpService],
  styleUrls: ['./exela-create-customer-setup.component.scss']
})
export class ExelaCreateCustomerSetupComponent implements OnDestroy {

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  showDeleteButton: boolean = true;
  showDeactivateButton: boolean = true;
  createCustomerForm: FormGroup;
  heading: String = 'Customer Segment Details';
  records: Array<any> = [];
  customeGroup: Array<any> = [];
  deleteRecord: Array<any> = [];
  POI: any;
  poiid: string = '';
  mode: string = '';
  totalRows: number = 0;
  id: string = '';
  hasActionButtons: boolean = true;
  allowClientAdd: boolean = false;
  showUsersButton: boolean = false;
  isDisabled: boolean = false;
  deleteFlag: boolean = false;
  getCustomeSegList: boolean = false;
  custValidation: boolean = false;
  customerId: number;
  organizationId: string = '';

  constructor (
    private requestService: RequestService,
    public _toastCtrl: ToastrService,
    public _dialogRef: MatDialogRef<ExelaCreateCustomerSetupComponent>,
    private _fb: FormBuilder
  ) {
    this.createCustomerForm = this._fb.group({
      _id : new FormControl(),
      customerSegment: new FormControl('', [Validators.required]),
      deleteFlag: false,
      active: true
    });

  }

  saveCustomerGroupForm ({ value, valid }: { value: any, valid: boolean }) {
    if (!this.deleteFlag) {
      if (!valid) {
        this.custValidation = true;
        this.createCustomerForm.markAsDirty();
      } else {
        value.organizationid = this.organizationId;
        this.getCustomeSegList = false;

        const newObject: any = {
          _id: value._id,
          customer_segment: value.customerSegment,
          organization_id: this.organizationId,
          active: value.active
        };

        if (this.mode === 'add') {
          this.requestService.doPOST('/api/reachout/customerGroups', newObject, 'API_CONTRACT').subscribe(response => {
            this._toastCtrl.success('Customer Segment method has been added Successfully');
            this.getCustomerGroupDetails();
            this.createCustomerForm.controls['customerSegment'].setValue('');
            this.getCustomeSegList = true;
            this.custValidation = false;
          }, (error) => {
            if (error.status === 400) {
              this._toastCtrl.error(error.error);
            }
          });
        } else {
          this.requestService.doPUT(`/api/reachout/customerGroups/${value._id}`, newObject, 'API_CONTRACT').subscribe(response => {
            this._toastCtrl.success('Customer Segment method  updated Successfully');
            this.closePopup();
          }, (error) => {
            if (error.status === 400) {
              this._toastCtrl.error(error.error);
            }
          });
        }
      }
    } else {
      this.getCustomeSegList = false;
      let deleteClientSetupAlert = new SweetAlertController();
      deleteClientSetupAlert.deleteConfirm({}, () => {
        this.requestService.doDELETE(`/api/reachout/customerGroups/${this.deleteRecord}`, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Customer Segment Entry Deleted Successfully');
          this.getCustomeSegList = true;
          this.deleteFlag = false;
          this.mode = 'add';
          this.getCustomerGroupDetails();
        }, () => {
          this._toastCtrl.error('Something went wrong, Please try again.');
        });
      });
    }

  }

  setEditFormValues (details?: any) {
    this.isDisabled = true;
    this.createCustomerForm.patchValue(details);
  }

  getCustomerGroupDetails () {
    this.requestService.doGET('/api/reachout/customerGroups', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      this.customeGroup = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!item.deleteFlag && item.organizationid === this.organizationId) {
          tmpRecords.push(item);
        }
      });
      this.customeGroup = tmpRecords;
    }, () => {
    });
  }

  editCustomerSegmentRecord (event) {
    this.createCustomerForm.controls['customerSegment'].setValue(event.customer_segment);
    this.createCustomerForm.controls['_id'].setValue(event._id);
    this.createCustomerForm.controls['deleteFlag'].setValue(event.deleteFlag);
    this.createCustomerForm.controls['active'].setValue(event.active);
    this.mode = 'edit';
  }

  deleteCustomeSeg (event) {
    this.mode = 'delete';
    this.deleteFlag = true;
    this.deleteRecord = event;
  }

  custSegmentMode (event) {
    this.mode = event;
  }

  closePopup () {
    this._dialogRef.close();
  }

  ngOnDestroy () {}
}

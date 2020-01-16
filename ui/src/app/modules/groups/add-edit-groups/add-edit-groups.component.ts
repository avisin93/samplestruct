import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AddGroupUserComponent } from '../add-group-user/add-group-user.component';
import { HttpService } from '../../shared/providers/http.service';
import { UrlDetails } from '../../../models/url/url-details.model';
import { Pattern } from '../../../models/util/pattern.model';
import { StorageService } from '../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-groups',
  templateUrl: './add-edit-groups.component.html',
  styleUrls: ['./add-edit-groups.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEditGroupsComponent implements OnInit {

  @Input() selectedFacility: any = '';

  @Input() selectedGroup: any = '';

  @Input() mode: string = '';

  @Output('backToGroups') backToGroupsEvent = new EventEmitter<any>();

  disabled: boolean = false;

  addGroupsForm: FormGroup;

  facilities = [];

  products = [];

  onlyNumberPattern: string ;

  onlyTwoDecimalPlacePattern: string;

  dialogOptions: any = {
    width: '510px',
    height: 'auto',
    panelClass: 'appModalPopup'
  };

  constructor (private _route: ActivatedRoute, private _router: Router, private _fb: FormBuilder, public dialog: MatDialog ,public httpService: HttpService ,public toastController: ToastrService) {
    this.onlyNumberPattern = Pattern.ONLY_NUMBER_PATTERN;
    this.onlyTwoDecimalPlacePattern = Pattern.ONLY_TWO_DECIMALPLACE_PATTERN;
    this.addGroupsForm = this._fb.group({
      groupName: new FormControl('', [Validators.required]),
      numberOfJobsPerDay: new FormControl('', [Validators.required,Validators.min(1),Validators.pattern(this.onlyNumberPattern)]),
      jobPricePerUserPerDay: new FormControl('', [Validators.required ,Validators.min(1), Validators.pattern(this.onlyTwoDecimalPlacePattern)]),
      facility: this._fb.group(
        {
          facilityId: new FormControl('', [Validators.required])
        }
          ),
      groupProducts: new FormControl([], [Validators.required]),
      users: this._fb.array([]),
      approvalManagers: this._fb.array([])
    });
  }

  ngOnInit () {
        // place fork join call here.

    this.getAllFacilities();
    this.getAllProducts();

    if (this.mode === 'edit' || this.mode === 'details') {
      this.setEditFormValues(this.selectedGroup.groupId);
    }

    if (this.mode === 'details') {
      this.disabled = true;
      this.addGroupsForm.disable();
    }
  }

  get _users (): FormArray {
    return this.addGroupsForm.get('users') as FormArray;
  }

  get _managers (): FormArray {
    return this.addGroupsForm.get('approvalManagers') as FormArray;
  }

  usersFormModel (id, name) {
    return new FormGroup({
      userId: new FormControl(id),
      userName: new FormControl(name)
    });
  }

  managersFormModel (id, name) {
    return new FormGroup({
      userId: new FormControl(id),
      userName: new FormControl(name)
    });
  }

  addUserPopup (type: string) {
    let dialogRef = this.dialog.open(AddGroupUserComponent, this.dialogOptions);
    dialogRef.componentInstance.userType = type;
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined' && result.length !== 0) {
        if (type === 'user') {
          if (result) {
            result.forEach((user) => {
              if (this._users.value.filter(addedUser => addedUser.userId === user.userId).length === 0) {
                this._users.push(this.usersFormModel(user.userId, user.userName));
              }
            });
          }
        } else {
          if (result) {
            result.forEach((user) => {
              if (this._managers.value.filter(addedManager => addedManager.userId === user.userId).length === 0) {
                this._managers.push(this.usersFormModel(user.userId, user.userName));
              }
            });
          }
        }
      }
    });
  }

  saveGroup ({ value, valid }: {value: any, valid: boolean}) {
    if (!valid) {
      this.addGroupsForm.markAsDirty();
      this.addGroupsForm.get('facility').get('facilityId').markAsTouched();
      this.addGroupsForm.get('groupProducts').markAsTouched();
    } else {
      let postData = {
        products: []
      };
      value.groupProducts.forEach((pId) => {
        postData.products.push({
          productId: pId
        });
      });
      value.products = postData.products;
      value.organizationId = StorageService.get(StorageService.organizationId);

      if (this.mode === 'edit') {
        value.groupId = this.selectedGroup.groupId;
      }

      this.httpService.save('UrlDetails.$getGroupSaveUrl' , value).subscribe(response => { // TODO: Vido
        if (response.responseCode === 200) {

          if (this.mode === 'edit') {
            this.toastController.success('Group updated successfully');
          } else {
            this.toastController.success('Group added successfully');
          }

          this.gotoGroups();
        } else if (response.responseCode === 409) {
          this.toastController.error(response.responseMessage);
        } else {
          if (this.mode === 'edit') {
            this.toastController.error('Group updation failed');
          } else {
            this.toastController.error('Group saving failed');
          }
        }
      } , () => {
        if (this.mode === 'edit') {
          this.toastController.error('Exception while updating group, Please try after some time');
        } else {
          this.toastController.error('Exception while saving group, Please try after some time');
        }
      });
    }
  }

  getAllProducts () {
    console.log('get all products call');
    this.httpService.getAll(UrlDetails.$exela_getAllProductsUrl).subscribe(response => {
      this.products = response.responseData;
      console.log(this.products);
    });
  }

  getAllFacilities () {
    console.log('get all facility call');
    this.httpService.getAllFacility('UrlDetails.$facilityGetUrl') // TODO: Vido
            .subscribe(response => {
              this.facilities = response.responseData;
            });
  }

  setEditFormValues (groupId?: any) {
    this.httpService.findById('UrlDetails.$groupGetByGroupIdUrl',{ 'groupId' : groupId }).subscribe(response => { // TODO: Vido
      let group = response.responseData;

      let products = [];
      group.products.forEach((product) => {
        products.push(product.productId);
      });
      group.groupProducts = products;
      this.addGroupsForm.patchValue(group);

      group.users.forEach((user) => {
        this._users.push(this.usersFormModel(user.userId, user.userName));
      });
      group.approvalManagers.forEach((user) => {
        this._managers.push(this.managersFormModel(user.userId, user.userName));
      });
    });
  }

  removeUser (index) {
    this._users.removeAt(index);
  }

  removeManager (index) {
    this._managers.removeAt(index);
  }

  gotoGroups () {
    this.backToGroupsEvent.emit(true);
  }

}

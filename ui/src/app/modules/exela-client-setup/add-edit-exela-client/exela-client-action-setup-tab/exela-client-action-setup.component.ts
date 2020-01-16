import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../shared/providers/session.service';

@Component({
  selector: 'app-exela-client-setup-action-tab',
  templateUrl: './exela-client-action-setup.component.html',
  styleUrls: ['./exela-client-action-setup.component.scss']
})

export class ExelaClientActionTabComponent implements OnInit, OnDestroy {

  @Input('organizationId') organizationId = '';

  assignActionForm: FormGroup;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Client setup',
      base: false,
      link: '',
      active: true
    }
  ];

  selectedItem: any;

  selectedItemIndex: number = -1;

  side: string = 'left';

  listing: Array<any> = [];

  constructor (private _fb: FormBuilder,
        public _toastCtrl: ToastrService,
        private _router: Router,
        private httpService: HttpService) {
    this.assignActionForm = this._fb.group({
      currentActionList: this._fb.array([]),
      assignActionList: this._fb.array([])
    });
  }

  ngOnInit () {
    this.getActionList();

  }

  getActionList () {
    this.httpService.get('UrlDetails.$getActionListUrl',{}).subscribe(response => { // TODO: Vido
      let prod;
      response.forEach((item) => {
        let alreadyAssigned = false;
        let index = item.client.findIndex(record => record.organizationId === this.organizationId);
        console.log(index);
        if (index >= 0) {
          alreadyAssigned = true;
          this._assignActionList.push(this.actionForm(item));
        } else {
          this._currentActionList.push(this.actionForm(item));
        }
      });
      console.log(this._currentActionList);
    }, () => {
    });
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.assignActionForm.controls['client'].markAsTouched();
    } else {
           // console.log(value);
      let assignedActions = [];
      if (value.assignActionList.length > 0) {
        value.assignActionList.forEach((item) => {
          assignedActions.push(item.id);
        });
        let assignReq = {
          organizationId: this.organizationId,
          actions: assignedActions
        };
        this.httpService.update('UrlDetails.$assignActionsToClient', assignReq).subscribe(response => {
          this._toastCtrl.success('Actions assigned successfully');
        },() => {
          this._toastCtrl.error('Something went wrong');
        });
      } else {

        this._toastCtrl.error('Please add at least one Actions to assign');
      }

    }
  }

  get _currentActionList (): FormArray {
    return this.assignActionForm.get('currentActionList') as FormArray;
  }

  get _assignActionList (): FormArray {
    return this.assignActionForm.get('assignActionList') as FormArray;
  }

  actionForm (item: any) {
    return new FormGroup({
      id: new FormControl(item._id),
      name: new FormControl(item.name)
    });
  }

  onSelectItem (item, index, side) {
    this.selectedItem = item;
    this.selectedItemIndex = index;
    this.side = side;
  }

  moveLeft () {
    if (this.selectedItemIndex !== -1 && this.side === 'right') {
      this._assignActionList.removeAt(this.selectedItemIndex);
      this._currentActionList.push(this.selectedItem);
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveRight () {
    if (this.selectedItemIndex !== -1 && this.side === 'left') {
      this._currentActionList.removeAt(this.selectedItemIndex);
      this._assignActionList.push(this.selectedItem);
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveAllLeft () {
    if (this._assignActionList.length > 0) {
      for (let i = 0; i < this._assignActionList.length; i++) {
        this._currentActionList.push(this._assignActionList.at(i));
      }

      for (let i = this._assignActionList.length - 1; i >= 0; i--) {
        this._assignActionList.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  moveAllRight () {
    if (this._currentActionList.length > 0) {
      for (let i = 0; i < this._currentActionList.length; i++) {
        this._assignActionList.push(this._currentActionList.at(i));
      }

      for (let i = this._currentActionList.length - 1; i >= 0; i--) {
        this._currentActionList.removeAt(i);
      }
      this.selectedItemIndex = -1;
      this.selectedItem = null;
    }
  }

  gotoClientSetup () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/exela-client-setup']);
  }

  ngOnDestroy () {

  }

}

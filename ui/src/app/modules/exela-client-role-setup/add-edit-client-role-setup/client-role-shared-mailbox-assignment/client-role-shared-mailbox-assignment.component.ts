import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange, MatSelectChange } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../shared/providers/http.service';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { SessionService } from '../../../shared/providers/session.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { element } from 'protractor';

@Component({
  selector: 'app-client-role-shared-mailbox-assignment-tab',
  templateUrl: './client-role-shared-mailbox-assignment.component.html',
  styleUrls: ['./client-role-shared-mailbox-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClientSharedMailboxAssignmentTabComponent implements OnInit {

  @Input('roleId') roleId: string = '';

  @Input('mode') mode: string = '';

  @Input('organizationId') organizationId: string = '';

  noShareMailbox: boolean = false;
  constructor (private _router: Router, public _toastCtrl: ToastrService,
        private httpService: HttpService, public loaderService: LoaderService) {
  }
  sharedMailBoxes = [];
  ngOnInit () {
    this.getSharedMailBoxes();
  }
  getSharedMailBoxes () {
    this.loaderService.show();
    this.httpService.get('UrlDetails.$getSharedMailboxesUrl', { organizationId: this.organizationId }).// TODO Nikola
            subscribe(response => {
              this.sharedMailBoxes = response;
              if (this.sharedMailBoxes.length > 0) {
                this.sharedMailBoxes.forEach(element => {
                  if (element.roleIds !== undefined && element.roleIds.indexOf(this.roleId) !== -1) {
                    element['checked'] = true;
                  } else {
                    element['checked'] = false;
                  }
                });
              } else {
                this.noShareMailbox = true;
              }
              this.loaderService.hide();
            }, error => {
              console.log(error);
              this.loaderService.hide();
            });
  }
  onChange (event: any, data: any) {
    if (this.roleId !== '') {
      let index = -1;
      if (data.roleIds !== undefined) {
        index = data.roleIds.indexOf(this.roleId);
      }
      if (event.checked) {
        if (index === -1) {
          if (data.roleIds !== undefined) {
            data.roleIds.push(this.roleId);
          } else {
            data['roleIds'] = [this.roleId];
          }
        }
      } else {
        let deleted = data.roleIds.splice(index, 1);
      }
      let reqData = {
        id: data._id,
        roleIds: data.roleIds
      };
      this.httpService.save('UrlDetails.$updateShareMailboxRoleUrl', reqData).subscribe(response => {// TODO Nikola
        if (event.checked) this._toastCtrl.success('Shared Mailbox assigned to role');
        else this._toastCtrl.success('Shared Mailbox unassigned');
      }, error => {
        console.log(error);
      });
    }
  }

}

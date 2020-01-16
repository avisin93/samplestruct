import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { SessionService } from '../../../shared/providers/session.service';
import { RoutingRuleMoveToFolderComponent } from './move-to-folder/routing-rule-move-to-folder.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rule-execution',
  templateUrl: './rule-execution.component.html',
  styleUrls: ['./rule-execution.component.scss']
})

export class RuleExecutionComponent implements OnInit {

  eventTypes: Array<any> = [];
  dialogOptions: any = {
    width: '450px',
    height: '300px',
    disableClose: true
  };
  moveToFolder = 'Move To Folder';
  deliverTo = 'Deliver To';
  showEmailRequiredError: boolean = false;
  emailList: Array<any> = [];
  eventType = '';
  navigatorOptions = {};
  showEmailList: boolean = false;
  navigatorNodes = [];
  path = [];
  absolutePath: String = '';
  childPath = [];
  organizationCode = null;

  @Input('form') autoRoutingForm: FormGroup;
  @Input('autoRoutingId') autoRoutingId;
  @Output('stepChange') stepChange = new EventEmitter<any>();
  @Input('organizationId') organizationId;

  constructor (
    private httpService: HttpService,
    public toastController: ToastrService,
    private _router: Router,
    private dialog: MatDialog
  ) { }

  getEventTypes () {
    if (StorageService.get(StorageService.autoRoutingRuleFor) === 'organization') {
      this.eventType = this.deliverTo;
      this.showEmailList = true;
      this.eventTypes.push({
        value: 'Deliver To', text: 'Deliver To'
      });
    } else {
      this.showEmailList = false;
      this.eventType = this.moveToFolder;
      this.eventTypes.push({
        value: 'Move To Folder', text: 'Move To Folder'
      });
    }
  }

  ngOnInit () {
    if (this.autoRoutingForm.get('eventType').value === this.moveToFolder) {
      this.showEmailList = false;
    }
    this.getEventTypes();
    this.getRolesByClient();
    this.setExtractPath();
    this.getClientDetails();
    this.getRolesByClient();
  }
  getClientDetails () {
    this.httpService.get(UrlDetails.$exela_getClientUrl + '/' + this.organizationId,{}).subscribe(response => {
      this.organizationCode = response[0].organizationcode;
    });
  }
  setExtractPath () {
    // Set value of path if event type is 'Move To Folder'
    let requestData = {
      'userName': StorageService.get(StorageService.userName),
      'userEmail': StorageService.get(StorageService.userEmail),
      'projectId': StorageService.get(StorageService.projectId)
    };
    this.httpService.get(UrlDetails.$mailAdminInboxNavigatorSummaryUrl, requestData).subscribe((data: any) => {
      this.navigatorNodes = data;
      if (data.length > 0) {
        for (let i = 0; i < this.navigatorNodes.length; i++) {
          this.path = [];
          this.childPath = [];
          this.path.push(this.navigatorNodes[i].name);
          this.extractPath(this.navigatorNodes[i], this.path);
        }
      }
    }, (error) => {
      console.log(error);
    });
  }
  setEmailId () {
    let reqData = {
      lookupInput: this.autoRoutingForm.get('email').value,
      projectRoles: this.projectRoles,
      organizationId: this.organizationId
    };
    this.httpService.get(UrlDetails.$lookupMailAdmin, reqData).subscribe(response => {
      if (response[0] !== undefined) {
        this.email = response[0].username;
        this.autoRoutingForm.controls['lookupInput'].setValue(response[0].firstname + ' ' + response[0].lastname);
      }
    }, () => {});
  }

  extractPath (node, path) {
    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        if (i > 0) {
          let j = i - 1;
          while (j >= 0) {
            let index = this.childPath.indexOf(node.children[j].name);
            while (index >= 0 && index < this.childPath.length) {
              this.childPath.splice(index);
              index++;
            }
            j--;
          }
        }
        if (node.children[i].id === this.autoRoutingForm.controls['folderId'].value) {
          this.path.push(node.children[i].name);
          this.absolutePath = this.path[0];
          this.childPath.forEach(element => {
            this.absolutePath = this.absolutePath + '/' + element;
          });
          this.absolutePath = this.absolutePath + '/' + this.path[1];
          this.autoRoutingForm.controls['absolutePath'].setValue(this.absolutePath);
          break;
        } else if (node.children[i] && node.children[i].children.length) {
          this.childPath.push(node.children[i].name);
          this.extractPath(node.children[i], this.path);
        }
      }
    }
  }

  previous () {
    this.stepChange.emit(2);
  }

  save ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.autoRoutingForm.controls['invocationTrigger'].markAsTouched();
      this.autoRoutingForm.controls['projectCode'].markAsTouched();
      this.autoRoutingForm.controls['ruleName'].markAsTouched();
      this.autoRoutingForm.controls['eventType'].markAsTouched();
      if ((this.eventType === this.deliverTo || this.email === '') && (this.email === '' || this.email == null)) {
        this.showEmailRequiredError = true;
      }
      this.autoRoutingForm.markAsDirty();
    } else {

      if ((this.eventType === this.deliverTo || this.eventType === '') && (this.email === '' || this.email == null)) {
        this.showEmailRequiredError = true;
      } else if (this.eventType === this.moveToFolder && value.folderId === undefined) {
        this.toastController.error('Please select at least one folder');
      } else {
        this.showEmailRequiredError = false;
        this.autoRoutingForm.markAsPristine();
        // removed extra attribute from the json
        if (value.conditions.all !== undefined) {
          value.conditions.all.forEach(rule => {
            delete rule.operatorText;
            delete rule.factText;
          });
        }
        let eventValue = this.email;
        if (this.eventType === this.moveToFolder) {
          eventValue = value.folderId;
        }
        let reqData = {
          projectCode: value.projectCode,
          organizationCode: this.organizationCode,
          username: StorageService.get(StorageService.userName),
          active: true,
          invocationTrigger: value.invocationTrigger,
          ruleName: value.ruleName,
          event: {
            type: value.ruleName,
            params: {
              action: {
                name: value.eventType,
                value: eventValue,
                username: value.selectedFolderUsername
              }
            }
          },
          _id: undefined,
          conditions: value.conditions
        };
        reqData['ruleFor'] = StorageService.get(StorageService.autoRoutingRuleFor);
        if (this.autoRoutingId !== '' && this.autoRoutingId !== undefined) {
          reqData._id = this.autoRoutingId;
        }
        if (value.conditions === '') {
          reqData.conditions = {};
        }

        this.httpService.save(UrlDetails.$saveAutoRoutingUrl, reqData).subscribe(response => {
          this.toastController.success('Auto Routing Rule Saved Successfully');
          let base = SessionService.get('base-role');
          this._router.navigate(['/' + base + '/nQube-autorouting-rule', StorageService.get(StorageService.autoRoutingRuleFor)]);
        }, error => {
          console.log(error);
        });
      }

    }
  }

  gotoRoutingRuleList () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/nQube-autorouting-rule', StorageService.get(StorageService.autoRoutingRuleFor)]);
  }

  onChangeEvent (event: any) {
    if (event.value === this.moveToFolder) {
      this.showEmailList = false;
      this.eventType = this.moveToFolder;
    } else {
      this.showEmailList = true;
      this.eventType = this.deliverTo;
    }
  }

  showFileCabinet () {
    if (this.navigatorNodes != null && this.navigatorNodes.length > 0) {
      let moveToFolderDialogRef = this.dialog.open(RoutingRuleMoveToFolderComponent, this.dialogOptions);
      moveToFolderDialogRef.componentInstance.heading = this.moveToFolder;
      moveToFolderDialogRef.componentInstance.saveBtnTitle = 'OK';
      moveToFolderDialogRef.componentInstance.folderId = this.autoRoutingForm.get('folderId').value;
      moveToFolderDialogRef.componentInstance.navigatorNodes = this.navigatorNodes;
      moveToFolderDialogRef.componentInstance.initialize();
      moveToFolderDialogRef.afterClosed().subscribe((result) => {
        this.autoRoutingForm.controls['folderId'].setValue(moveToFolderDialogRef.componentInstance.folderId);
        this.autoRoutingForm.controls['absolutePath'].setValue(moveToFolderDialogRef.componentInstance.absolutePath);
        this.autoRoutingForm.controls['selectedFolderUsername'].setValue(moveToFolderDialogRef.componentInstance.selectedFolderUsername);
      });
    } else {
      this.toastController.error('File cabinet is empty');
    }
  }

  projectRoles: string = '';
  selectedRecipient;
  results = [];
  email: string = '';

  getRolesByClient () {
    this.httpService.get(UrlDetails.$exela_getClientRolesUrl, { organizationId: this.organizationId }).subscribe(response => {
      response.forEach(element => {
        this.projectRoles = this.projectRoles + ',' + element._id;
      });
      this.setEmailId();
    }, error => {
      console.log(error);
    });
  }

  selectMailAdmin (event) {
    this.autoRoutingForm.controls['lookupInput'].setValue(event.firstname + ' ' + event.lastname);
    this.selectedRecipient = event;
    this.email = event.username;
    this.showEmailRequiredError = false;
  }

  search (event) {
    this.selectedRecipient = '';
    let reqData = {
      lookupInput: event.query,
      projectRoles: this.projectRoles,
      organizationId: this.organizationId
    };
    this.httpService.get(UrlDetails.$lookupMailAdmin, reqData)
      .subscribe(response => {
        this.results = response;
      }, () => {});
  }
  onFocus (event) {
    if (this.autoRoutingForm.get('lookupInput').value === 'Select Email') {
      this.autoRoutingForm.controls['lookupInput'].setValue('');
    }
  }

  onClear () {
    this.email = '';
    this.showEmailRequiredError = true;
  }

}

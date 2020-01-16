import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { RuleGroupService } from './rule-group.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { RuleGroup } from './rule-group';
import { MatDialog } from '@angular/material';
import { AddEditRuleGroupComponent } from './add-edit-rule-group/add-edit-rule-group.component';
import { StorageService } from '../../../shared/providers/storage.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rule-group',
  templateUrl: './rule-group.component.html',
  providers: [RuleGroupService],
  styleUrls: ['./rule-group.component.scss']
})

export class RuleGroupComponent implements OnInit {
  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;
  ruleGroups: RuleGroup[];
  errorMessage: any;
  displayStatus: boolean = false;
  showDeactivateButton: boolean = true;
  deactivateStatus: boolean = false;
  organizationId: string = '';
  singleColummn: boolean = true;
    // deactivateStatusRow: boolean = false;

  columns: Array<any> = [
    {
      title: 'RULE GROUP NAME',
      key: 'groupName',
      sortable: true,
      filter: true,
      link: false
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
      text: 'Rule Group',
      base: false,
      link: '',
      active: true
    }

  ];

  dialogOptions: any = {
    width: '450px'
  };
  records: Array<any> = [];
  selectedEntities: any[];
    // active: any[];
  totalRows: number = 0;
  searchBox: boolean = true;
  hasActionButtons: boolean = true;
  hasSuperAdminRole: boolean = false;
  showClientList: boolean = false;
  clients;
  constructor (
    public dialog: MatDialog,
    private _router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private ruleGroupService: RuleGroupService,
    private httpService: HttpService,
    public toaster: ToastrService
  ) {

  }

  ngOnInit () {
    let userRoles = JSON.parse(StorageService.get(StorageService.userRoles));
    this.hasSuperAdminRole = userRoles.find((role) => {
      return role.roleName === 'SUPERADMIN';
    });

    if (this.hasSuperAdminRole) {
      this.showClientList = true;
      this.getAllClients();

    } else {
      this.organizationId = StorageService.get(StorageService.organizationId);
      this.getRuleGroupList();
    }
  }
  getAllClients () {
    this.loaderService.show();
    this.httpService.get(UrlDetails.$exela_getAllClientUrl, {}).subscribe(response => {
      this.loaderService.hide();
      if (response.length !== 0) {
        this.clients = response;
        this.onClientChange(this.clients[0]._id);
      }
    }, () => {
      this.loaderService.hide();
    });
  }

  onClientChange (value) {
    this.organizationId = value;
    this.getRuleGroupList();
  }

  checkBoxSelectionChange (data: any) {
    this.selectedEntities = data;
  }

  getRuleGroupList () {

    this.loaderService.show();
    const requestPayload = {
      organizationId: this.organizationId
    };
    this.ruleGroupService.getRuleGroups(requestPayload).subscribe(ruleGroups => {
      this.loaderService.hide();
      this.records = ruleGroups;
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
      this.toaster.error('Something went wrong');

    });
  }

  gotoLink (data: any) {
    this._router.navigate(['edit/' + data.row._id], { relativeTo: this.route });
  }

  saveRuleGroup (rule: RuleGroup) {
    this.ruleGroupService.saveRuleGroup(rule).subscribe(
      ruleGroups => this.ruleGroups = ruleGroups,
      error => this.errorMessage = error as any
    );
  }

  addOrUpdateRuleGroup (rule: RuleGroup) {
    this.ruleGroupService.addOrUpdateRuleGroup(rule).subscribe(
      ruleGroups => this.ruleGroups = ruleGroups,
      error => this.errorMessage = error as any
    );
  }

  createRuleGroupPopup () {
    let addRuleGrpDialogRef = this.dialog.open(AddEditRuleGroupComponent, this.dialogOptions);
    addRuleGrpDialogRef.componentInstance.organizationId = this.organizationId;
    addRuleGrpDialogRef.afterClosed().subscribe((result) => {
      this.loaderService.show();
      this.getRuleGroupList();
    });

  }

  editRuleGroupPopup (data: any) {
    let editUserDialogRef = this.dialog.open(AddEditRuleGroupComponent, this.dialogOptions);
    editUserDialogRef.componentInstance.heading = 'Edit Rule Group';
    editUserDialogRef.componentInstance.mode = 'Edit';
    editUserDialogRef.componentInstance.organizationId = this.organizationId;
    editUserDialogRef.componentInstance.setEditFormValues(data);
    editUserDialogRef.afterClosed().subscribe(result => {
      this.getRuleGroupList();
    });
  }

  deleteRuleGroup (data: any) {
    let txtMsg = 'Do you want to delete the ' + data.modelname + ' ?';
    this.showConfirmationMsg(txtMsg,() => {
      this.loaderService.show();
      const checkPayload = { ruleGroupId: data._id, organizationId: this.getClientId(), shouldCheckActive: false };
      this.ruleGroupService.checkDependentRuleGroups(checkPayload).subscribe(checkedRules => {
        const notSafeToDelete = (!isNullOrUndefined(checkedRules.ruleCount) && checkedRules.ruleCount > 0);
        if (notSafeToDelete) {
          this.toaster.error(`Rule Group cannot be deleted as it is assigned to some rule`);
          this.loaderService.hide();
        } else {
          this.ruleGroupService.deleteRuleGroup(data).subscribe(ruleSetups => {
            this.toaster.success('Rule Group deleted successfully !');
            this.loaderService.hide();
            this.getRuleGroupList();
          },(error) => {
            this.errorMessage = error as any;
            this.loaderService.hide();
            this.toaster.error('Something went wrong !');
          });
        }
      },() => {
        this.loaderService.hide();
        this.toaster.error('Something went wrong');
      });
    },() => {});
  }

  getClientId () {
    let organizationId = StorageService.get(StorageService.organizationId);
    return organizationId;
  }

  showConfirmationMsg (textMsg, callbackfn, noCallbackfn) {
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
    confimMsg.deleteConfirm(options, callbackfn, noCallbackfn);
  }
}

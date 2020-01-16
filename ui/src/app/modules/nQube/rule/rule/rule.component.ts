import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { RuleService } from './rule.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { Rule } from './rule';
import { MatDialog } from '@angular/material';
import { StorageService } from '../../../shared/providers/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  providers: [RuleService],
  styleUrls: ['./rule.component.scss']
})

export class RuleComponent implements OnInit {
  rules: Rule[];
  errorMessage: any;
  displayStatus: boolean = false;
  showDeactivateButton: boolean = true;
  deactivateStatus: boolean = false;
  showTestButton: boolean = true;
  organizationId: string = '';

  @ViewChild(NgDataTablesComponent)
    private dataTableComp: NgDataTablesComponent;

  columns: Array<any> = [
    {
      title: 'RULE NAME',
      key: 'rule',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'DATA SOURCE',
      key: 'dataSource',
      sortable: true,
      filter: true,
      link: false
    },
    {
      title: 'RULE GROUP',
      key: 'groupName',
      sortable: true,
      filter: true,
      link: false
    }

  ];

  records: Array<any> = [];
  selectedEntities: any[];
  active: any[];
  totalRows: number = 0;

  searchBox: boolean = true;

  hasActionButtons: boolean = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Rule',
      base: false,
      link: '',
      active: true
    }

  ];

  dialogOptions: any = {
    width: '450px'
  };
  selectedOrganization: any = null;
  hasSuperAdminRole: boolean = false;
  showClientList: boolean = false;
  clients;
  constructor (
    public dialog: MatDialog,
    private _router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private ruleService: RuleService,
    private httpService: HttpService,
    public toaster: ToastrService
  ) { }

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
      this.getRuleList();
    }
  }

  checkBoxSelectionChange (data: any) {
    this.selectedEntities = data;
    console.log(this.selectedEntities);
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
    this.getRuleList();
  }
  getRuleList () {
    this.loaderService.show();
    const payload = {
      organizationId: this.organizationId
    };
    this.ruleService.getRules(payload).subscribe(rules => {
      this.records = rules;
      this.records.forEach((rule) => {
        rule.groupName = rule.group.groupName;
        rule.group = rule.group._id;
      });
      this.dataTableComp.setPage(1);
      this.totalRows = this.records.length;
      this.loaderService.hide();
      console.log(this.records);
    }, () => {
      this.dataTableComp.setPage(1);
      this.loaderService.hide();
      this.toaster.error('Something went wrong');

    });
  }

  addOrUpdateRule (rule: Rule) {
    this.ruleService.addOrUpdateRule(rule).subscribe(
      rules => this.rules = rules,
      error => this.errorMessage = error as any
    );
  }

  editRule (data: any) {
    if (typeof data._id !== 'undefined') {
      this._router.navigate(['edit/' + data._id + '/' + this.organizationId], { relativeTo: this.route });
    }
  }

  deleteRule (data: any) {
    let txtMsg = 'Do you want to delete the ' + data.rule + ' ?';
    let deleteRoleSetUpAlert = new SweetAlertController();
    this.showConfirmationMsg(txtMsg,() => {
      this.loaderService.show();
      this.ruleService.deleteRule(data) .subscribe(rules => {
        this.loaderService.show();
        this.getRuleList();
        this.toaster.success('Rule deleted successfully');
      },(error) => {
        this.errorMessage = error as any,
        this.toaster.error('Something went wrong');
      },() => {
        this.loaderService.hide();
      });
    },() => {});
  }

  activateDeactivateRule (data: any) {
    let txtMsg = '';
    const self = this;
    if (data.active) {
      txtMsg = 'Do you want to activate the ' + data.rule + ' ?';
    } else {
      txtMsg = 'Do you want to deactivate the ' + data.rule + ' ?';
    }

    this.showConfirmationMsg(txtMsg,() => {
      this.loaderService.show();
      this.addOrUpdateRule(data);
      this.loaderService.hide();
      setTimeout(() => {
        self.getRuleList();
      }, 700);
    }, () => {
      data.active = !(data.active);
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

  executeSelectedRule (row) {
    this.loaderService.show();
    const payload = { ruleId: row._id };
    this.ruleService.executeRule(payload).subscribe(data => {
      this.loaderService.hide();
      this.toaster.success('Query was executed successfully');
    },() => {
      this.loaderService.hide();
      this.toaster.error('Something went wrong');
    });
  }

  getClientId () {
    let organizationId = StorageService.get(StorageService.organizationId);
    return organizationId;
  }

}

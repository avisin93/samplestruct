import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UrlDetails } from '../../../../models/url/url-details.model';
import { HttpService } from '../../../shared/providers/http.service';
import { StorageService } from '../../../shared/providers/storage.service';
import { SweetAlertController } from '../../../shared/controllers/sweet-alert.controller';
import { NgDataTablesComponent } from '../../../shared/modules/ng-data-tables/ng-data-tables.component';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { AddEditRuleConditionComponent } from './add-edit-rule-condition/add-edit-rule-condition-component';
import { SessionService } from '../../../shared/providers/session.service';

@Component({
  selector: 'app-rule-condition',
  templateUrl: './rule-condition.component.html',
  styleUrls: ['./rule-condition.component.scss']
})

export class RuleConditionComponent implements OnInit {

  @ViewChild(NgDataTablesComponent)
  private dataTableComp: NgDataTablesComponent;

  @Input('form') autoRoutingForm: any;
  @Input('id') autoRoutingId;

  @Output('stepChange') stepChange = new EventEmitter<any>();
  records: Array<any> = [];
  totalRows: number = 0;
  priority: number;

  fields: Array<any> = [{ text: 'Document Type', value: 'docType' },
                        { text: 'Batch Class', value: 'batchClass' },
                        { text: 'Batch Priority', value: 'batchPriority' },
                        { text: 'Sender Name', value: 'senderName' },
                        { text: 'Recipient  Name', value: 'recipientName' },
                        { text: 'Sender Email', value: 'senderEmail' },
                        { text: 'Courier Name', value: 'courierName' }];
  operations: Array<any> = [{ text: 'Equal', value: 'equal' }, { text: 'Not Equal', value: 'notEqual' }];

  addRuleConditionForm: FormGroup;
  columns: Array<any> = [
    {
      title: 'FIELD',
      key: 'factText',
      sortable: true,
      filter: true
    },
    {
      title: 'OPERATOR',
      key: 'operatorText',
      sortable: true,
      filter: true
    },
    {
      title: 'VALUE',
      key: 'value',
      sortable: true,
      filter: true
    }
  ];
  hasActionButtons: boolean = true;
  dialogOptions: any = {
    width: '630px',
    height: '250px'
  };

  ngOnInit () {
    if (this.autoRoutingId !== undefined && this.autoRoutingId !== '') {
      this.loaderService.show();
      this.httpService.getAll(UrlDetails.$getAutoRoutingConditions + this.autoRoutingId).subscribe(response => {
        this.loaderService.hide();
        let tmpRecords = {};
        let conditionsArray = response['conditions'];
        this.priority = conditionsArray['priority'];
        if (conditionsArray['all'] !== undefined) {
          conditionsArray['all'].forEach((item: any, index) => {
            tmpRecords = {};
            tmpRecords['operator'] = item.operator;
            tmpRecords['value'] = item.value;
            tmpRecords['id'] = index + 1;
            tmpRecords['fact'] = item.fact;
            tmpRecords['factText'] = this.getFieldName(item.fact);
            tmpRecords['operatorText'] = this.getOperatorName(item.operator);
            this.records.push(tmpRecords);
          });
        }
        this.dataTableComp.setPage(1);
        this.totalRows = this.records.length;
        this.loaderService.hide();
      });
    }
  }

  constructor (private httpService: HttpService, public _fb: FormBuilder, private dialog: MatDialog,
    private loaderService: LoaderService, private _router: Router) {
    this.addRuleConditionForm = this._fb.group({
      field: new FormControl('', Validators.required),
      operator: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    });
  }

  add () {
    let addRuleConditionDialogRef = this.dialog.open(AddEditRuleConditionComponent, this.dialogOptions);
    addRuleConditionDialogRef.componentInstance.selectedAction = {};
    addRuleConditionDialogRef.componentInstance.mode = 'add';
    addRuleConditionDialogRef.componentInstance.heading = 'Add Rule Condition';
    addRuleConditionDialogRef.afterClosed().subscribe((result) => {
      if (addRuleConditionDialogRef.componentInstance.record !== undefined) {
        addRuleConditionDialogRef.componentInstance.record.id = this.records.length + 1;
        addRuleConditionDialogRef.componentInstance.record.factText = this.getFieldName(addRuleConditionDialogRef.componentInstance.record.fact);
        addRuleConditionDialogRef.componentInstance.record.operatorText = this.getOperatorName(addRuleConditionDialogRef.componentInstance.record.operator);
        this.records.push(addRuleConditionDialogRef.componentInstance.record);
        this.totalRows = this.records.length;
        this.dataTableComp.setPage(1);
        this.updateConditions();
      }
    });
  }

  edit (action: any) {
    let addRuleConditionDialogRef = this.dialog.open(AddEditRuleConditionComponent, this.dialogOptions);
    addRuleConditionDialogRef.componentInstance.selectedAction = action;
    addRuleConditionDialogRef.componentInstance.mode = 'edit';
    addRuleConditionDialogRef.componentInstance.heading = 'Edit Rule Condition';
    addRuleConditionDialogRef.componentInstance.addRuleConditionForm.setValue({ 'operator': action.operator, 'fact': action.fact, 'value': action.value, 'id': action.id });
    addRuleConditionDialogRef.afterClosed().subscribe((result) => {
      if (addRuleConditionDialogRef.componentInstance.record !== undefined) {
        this.records.forEach(element => {
          if (addRuleConditionDialogRef.componentInstance.addRuleConditionForm.controls['id'].value === element.id) {
            element.operator = addRuleConditionDialogRef.componentInstance.record.operator;
            element.fact = addRuleConditionDialogRef.componentInstance.record.fact;
            element.factText = this.getFieldName(addRuleConditionDialogRef.componentInstance.record.fact);
            element.operatorText = this.getOperatorName(addRuleConditionDialogRef.componentInstance.record.operator);
            element.value = addRuleConditionDialogRef.componentInstance.record.value;
          }
        });
        this.updateConditions();
      }
    });
  }

  delete (record: any) {
    let deleteClientSetupAlert = new SweetAlertController();
    deleteClientSetupAlert.deleteConfirm({}, () => {
      this.records.forEach((element, index) => {
        if (record.id === element.id) {
          this.records.splice(index, 1);
          this.totalRows = this.records.length;
        }
      });
      this.updateConditions();
    });
  }

  next () {
    this.stepChange.emit(3);
  }

  updateConditions () {
    this.autoRoutingForm.controls['conditions'].setValue({
      priority: this.priority,
      all: this.records
    });
  }

  previous () {
    this.stepChange.emit(1);
  }

  gotoRoutingRuleList () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/nQube-autorouting-rule', StorageService.get(StorageService.autoRoutingRuleFor)]);
  }

  getFieldName (fieldName) {
    for (let index = 0; index < this.fields.length; index++) {
      if (this.fields[index].value === fieldName) {
        return this.fields[index].text;
      }
    }
  }

  getOperatorName (operator) {
    for (let index = 0; index < this.operations.length; index++) {
      if (this.operations[index].value === operator) {
        return this.operations[index].text;
      }
    }
  }

}

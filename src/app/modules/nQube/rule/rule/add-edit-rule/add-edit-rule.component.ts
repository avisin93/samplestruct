import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { MatDialog } from '@angular/material';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { UrlDetails } from '../../../../../models/url/url-details.model';
import { Router, ActivatedRoute } from '@angular/router';
import { RuleService } from '../rule.service';
import { Rule } from '../rule';
import { RuleGroupService } from '../../rule-group/rule-group.service';
import { RuleGroup } from '../../rule-group/rule-group';
import { AddEditRuleGroupComponent } from '../../rule-group/add-edit-rule-group/add-edit-rule-group.component';
import { SessionService } from '../../../../shared/providers/session.service';
import { isNullOrUndefined } from 'util';
import { ModelSetupService } from '../../../model/model-setup/model-setup.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
// import { QueryBuilder } from '../../../../shared/services/query-builder.service';

declare function require (url: string);
let dataOperations = require('./dataOperations.json');
let dataSourceDetails = require('./dataSourceDetails.json');
let userSourceDetails = require('./userDataSourceDetails.json');
const superAdminRole = 'SUPERADMIN';

@Component({
  selector: 'app-add-edit-rule',
  templateUrl: './add-edit-rule.component.html',
  styleUrls: ['./add-edit-rule.component.scss'],
  providers: [RuleService, RuleGroupService, ModelSetupService] // QueryBuilder
})

export class AddEditRuleComponent implements OnInit {

  @Input('heading') heading = 'Add Rule';
  @Input('saveButtonTitle') saveBtnTitle = 'Save';
  @Input('mode') mode = '';
  @Input('_id') _id = '';
  @Input('organizationId') organizationId;

  addEditRuleForm: FormGroup;
  rule = new Rule();
  selectedRuleCriteria: any;
  selectedQuery: any;
  selectedAttribute: any;
  selectedDataSource: any;
  selectedDatasourceDetails: any;
  selectedAttributeDataType: any;
  poiDetails: any;
  selectedAttributeTypes = [];
  rules: Rule[];
  activeRuleGroups: RuleGroup[];
  activeRuleGroupMaster: RuleGroup[];
  fieldNames: Array<any> = [];
  queryOutput: Array<any> = [];
  dataSources: Array<any> = [];
  userSource: Array<any> = [];
  logicalOperators = [{ 'value': '$and', 'logicalOperator': 'AND' }, { 'value': '$or', 'logicalOperator': 'OR' }];
  criteriaOperators: Array<any> = [];
  maxRuleCriterias: any = 500;
  errorMessage: string;
  isExcluded = false;
  isQueryRun = false;
  isAndOrVisible = false;
  groupNameError: boolean = false;
  dataSourceError: boolean = false;
  logicalOperatorError: boolean = false;
  criteriaOperatorError: boolean = false;
  criteriaValueError: boolean = false;
  fieldNameError: boolean = false;
  selectedUserEmail: string;
  userType: string;
  attributeValueTypes: string[] = ['text'];
  allCriteriaRules: any[] = [];

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Add Rule',
      base: false,
      link: '/',
      active: true
    }
  ];

  dialogOptions: any = {
    width: '450px'
  };
  isSuperadmin: boolean = false;

  constructor (
    private _fb: FormBuilder,
    public dialog: MatDialog,
    public _toastCtrl: ToastrService,
    private _router: Router,
    private ruleService: RuleService,
    public httpService: HttpService,
    private loaderService: LoaderService,
    private modelSetupService: ModelSetupService,
    private ruleGroupService: RuleGroupService,
    private _route: ActivatedRoute,
    private requestService: RequestService
  ) {
    this.addEditRuleForm = this._fb.group({
      _id: new FormControl(),
      rule: new FormControl('', [Validators.required]),
      dataSource: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      active: new FormControl(''),
      ruleCriterias: this._fb.array([this.initRuleCriteriaRows()])
    });
  }

  ngOnInit () {
    this.getPoiDetails();
    this.dataSources = dataSourceDetails.dataSources;
    this.userSource = userSourceDetails.dataSources;
    this._route.data.subscribe((dataParams: any) => {
      this.mode = dataParams.mode;
      if (this.mode === 'edit') {
        this.heading = 'Edit Rule';
        this._route.params.subscribe((params: any) => {
          this._id = params.id;
          this.loadRuleById(this._id);
        });
      }
    });
    this._route.params.subscribe((params: any) => {
      this.organizationId = params.organizationId;
      this.getActiveRuleGroupList();
    });
  }

  private markFormGroupTouched (formGroup?: FormGroup) {
    if (formGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        formGroup.get(key).markAsTouched();

        if (formGroup.get(key).value && formGroup.get(key).value.controls) {
          formGroup.get(key).value.controls.forEach(fg => {
            this.markFormGroupTouched(fg);
          });
        }
      });
    } else {
      Object.keys(this.addEditRuleForm.controls).forEach(key => {
        this.addEditRuleForm.get(key).markAsTouched();

        if (this.addEditRuleForm.get(key)['controls']) {
          this.addEditRuleForm.get(key)['controls'].forEach(fg => {
            this.markFormGroupTouched(fg);
          });
        }
      });
    }
  }

  checkForValidations (value: any) {
    this.markFormGroupTouched();
    if (value.group === '') {
      this.groupNameError = true;
    }

    if (value.dataSource === '') {
      this.dataSourceError = true;
    }

    if (value.ruleCriterias.length >= 1 && value.ruleCriterias[value.ruleCriterias.length - 1].logicalOperator === '') {
      // control refers to your formarray
      if (value.ruleCriterias.length > 1 && value.ruleCriterias[value.ruleCriterias.length - 2].logicalOperator === '') {
        const control = this.addEditRuleForm.controls['ruleCriterias'] as FormArray;
        const previousRow = control.controls[value.ruleCriterias.length - 2] as FormGroup;
        const logicalOperatorInLastRow = previousRow.controls['logicalOperator'] as FormControl;
        logicalOperatorInLastRow.setErrors({ 'required': true });
      }
      this.logicalOperatorError = true;
    }

    if (value.ruleCriterias[value.ruleCriterias.length - 1].fieldName === '') {
      this.fieldNameError = true;
    }

    if (value.ruleCriterias[value.ruleCriterias.length - 1].criteriaOperator === '') {
      this.criteriaOperatorError = true;
    }

    if (value.ruleCriterias[value.ruleCriterias.length - 1].criteriaValue === '') {
      this.criteriaValueError = true;
    }
  }

  addOrUpdateRule ({ value, valid }: { value: any, valid: boolean }) {
    this.loaderService.show();
    if (!valid) {
      this.loaderService.hide();
      this.checkForValidations(value);
      this.addEditRuleForm.markAsDirty();
    } else {
      this.addEditRuleForm.markAsPristine();
      this.rule = value;
      this.normalizeValues(this.rule.ruleCriterias);
      this.rule.organizationid = this.organizationId;
      if (!isNullOrUndefined(value._id)) {
        this.rule.id = value._id;
        this.rule.active = value.active;

      } else {
        this.rule.active = true;
      }

      this.ruleService.addOrUpdateRule(this.rule).subscribe(rules => {
        this.rules = rules;
        this.loaderService.hide();
        if (this.mode === 'edit') {
          this._toastCtrl.success('Rule updated Successfully');
        } else {
          this._toastCtrl.success('Rule added Successfully');
        }
        this.goToRuleScreen();
      },(error) => {
        this.errorMessage = error as any;
        this.loaderService.hide();
        this._toastCtrl.error('Something went wrong.Try again!');
      });
    }
  }

  loadRuleById (_id: any) {
    this.httpService.get(UrlDetails.$getRuleByIdUrl + '/' + this._id, {}).subscribe((response) => {
      this.selectedQuery = response[0].ruleQuery;
      this.setEditFormValues(response[0]);
    }, () => {
      console.log('exception while loading rule by id');
    });
  }

  normalizeValues (ruleCriterias) {
    if (!isNullOrUndefined(ruleCriterias) && ruleCriterias.length > 0) {
      ruleCriterias.forEach((rule) => {
        switch (rule.targetfieldName) {
          case 'boolean':
            rule.criteriaValue = rule.criteriaValue === 'true';
            break;
          case 'number':
            rule.criteriaValue = Number(rule.criteriaValue);
            break;
          default:
            break;
        }
      });
    }
  }

  initRuleCriteriaRows () {
    return new FormGroup({
      fieldName: new FormControl('', [Validators.required]),
      criteriaOperator: new FormControl('', [Validators.required]),
      criteriaValue: new FormControl('', [Validators.required]),
      logicalOperator: new FormControl('')
    });
  }

  addNewRow ({ value, valid }: { value: any, valid: boolean }) {
    this.checkForValidations(value);
    const control = this.addEditRuleForm.controls['ruleCriterias'] as FormArray;
    let logicOpr = value.ruleCriterias[value.ruleCriterias.length - 2];
    if (control.valid) {
      if (value.ruleCriterias.length === 1) {
        this.isAndOrVisible = true;
        console.log('eee1');
        this.logicalOperatorError = false;
        control.push(this.initRuleCriteriaRows());
      } else if (value.ruleCriterias.length > 1 && logicOpr.logicalOperator !== '') {
        this.isAndOrVisible = true;
        control.push(this.initRuleCriteriaRows());
      }

    }

  }

  deleteRow (index: number) {
    // control refers to your formarray
    const control = this.addEditRuleForm.controls['ruleCriterias'] as FormArray;
    // remove the chosen row
    control.removeAt(index);
    this.criteriaOperators.splice(index, 1);
    this.selectedAttributeTypes.splice(index, 1);

    const lastRow = control.controls[control.length - 1] as FormGroup;
    const logicalOperatorInLastRow = lastRow.controls['logicalOperator'] as FormControl;
    logicalOperatorInLastRow.setErrors({});
    logicalOperatorInLastRow.reset();
  }

  getControls (frmGrp: FormGroup, key: string) {
    const tempRuleCriterias = this.allCriteriaRules = (frmGrp.controls[key] as FormArray).controls;
    return tempRuleCriterias;
  }

  getActiveRuleGroupList () {
    this.loaderService.show();
    this.ruleGroupService.getActiveRuleGroupList({ organizationId: this.organizationId }).subscribe(activeRuleGroups => {
      this.activeRuleGroupMaster = activeRuleGroups;
      if (this.userType !== superAdminRole) {
        this.activeRuleGroups = this.activeRuleGroupMaster.slice(0);
      }
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
      this._toastCtrl.error('Something went wrong');
    });
  }

  getPoiDetails () {
    this.requestService.doGET('/api/reachout/poiDetails', 'API_CONTRACT').subscribe(response => {
      this.poiDetails = response;
    }, (error) => {
      console.log('Get POI detail Error', error);
    });
  }

  onDataSourceSelect (event) {
    this.selectedDataSource = event;
    this.selectedDatasourceDetails = this.userSource.find((source) => { return source.value === this.selectedDataSource; });

    this.fieldNames = this.selectedDatasourceDetails.data.operators;
  }

  onAttributeSelect (event, indexOfGroup) {
    this.selectedAttribute = event;
    const tempDataSourceArray = this.userSource.find((source) => {
      return source.value === this.selectedDataSource;
    });
    let dataSourceDetailsOfData = tempDataSourceArray.data.operators;
    let obj = dataSourceDetailsOfData.find((source) => { return source.key === this.selectedAttribute; });
    this.selectedAttributeDataType = obj.dataType;
    this.selectedAttributeTypes[indexOfGroup] = this.selectedAttributeDataType;
    this.attributeValueTypes[indexOfGroup] = dataOperations[this.selectedAttributeDataType].type;
    this.criteriaOperators[indexOfGroup] = dataOperations[this.selectedAttributeDataType].operators;
  }

  setEditFormValues (details?: any) {
    details['selectedClient'] = details.organizationid;
    this.selectedDataSource = details.dataSource;
    const self = this;
    if (this.mode === 'edit') {
      if (!isNullOrUndefined(details.ruleCriterias) && details.ruleCriterias.length > 0) {
        self.isAndOrVisible = details.ruleCriterias.length > 0;
        details.ruleCriterias.forEach((ruleCriteria, index) => {
          const tempArray = this.addEditRuleForm.controls['ruleCriterias'] as FormArray;
          if (index > 0) tempArray.push(this.initRuleCriteriaRows());
          self.onAttributeSelect(ruleCriteria['fieldName'], index);
        });
      }
    }

    this.addEditRuleForm.patchValue(details);
  }

  createRuleGroupPopup () {
    let addeRuleGroupDialogRef = this.dialog.open(AddEditRuleGroupComponent, this.dialogOptions);
    console.log('hi', this.organizationId);
    addeRuleGroupDialogRef.componentInstance.organizationId = this.organizationId;
    addeRuleGroupDialogRef.afterClosed().subscribe((result) => {
      this.getActiveRuleGroupList();
    });
  }

  cancel () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/nQube-rule']);
  }

  goToRuleScreen () {
    let base = SessionService.get('base-role');
    this._router.navigate(['/' + base + '/nQube-rule']);
  }
}

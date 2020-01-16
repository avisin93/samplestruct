import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/providers/http.service';
import { MatDialogRef } from '@angular/material';
import { Pattern } from '../../../../../models/util/pattern.model';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RuleGroupService } from '../rule-group.service';
import { RuleGroup } from '../rule-group';
import { ModelSetupService } from '../../../model/model-setup/model-setup.service';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-rule-group',
  templateUrl: './add-edit-rule-group.component.html',
  styleUrls: ['./add-edit-rule-group.component.scss'],
  providers: [RuleGroupService, ModelSetupService]

})

export class AddEditRuleGroupComponent implements OnInit {

  @Input('heading') heading = 'Create Rule Group';
  @Input('saveButtonTitle') saveBtnTitle = 'Save';
  @Input('mode') mode: string;
  @Input('organizationId')organizationId: string;
  addEditRuleGroupForm: FormGroup;
  rule = new RuleGroup();
  currentRuleGroupDetails = new RuleGroup();
  ruleGroups: RuleGroup[];
  errorMessage: string;
  userEmail: string = '';
  userType: string;
  clientList: any[] = [];

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboard',
      base: true,
      link: '/dashboard',
      active: false
    },
    {
      text: 'Add Rule Group',
      base: false,
      link: '/',
      active: true
    }
  ];

  constructor (
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddEditRuleGroupComponent>,
    public _toastCtrl: ToastrService,
    private ruleGroupService: RuleGroupService,
    public httpService: HttpService,
    private loaderService: LoaderService
  ) {}

  ngOnInit () {
    this.initializeFormGroup();
    if (this.mode === 'Edit') {
      this.addEditRuleGroupForm.patchValue(this.currentRuleGroupDetails);
    }

  }

  initializeFormGroup () {
    this.addEditRuleGroupForm = this._fb.group({
      _id: new FormControl(),
      groupName: new FormControl('', [Validators.required, Validators.pattern(Pattern.ALPHA_NUMERIC_WITH_SPACE)]),
      active: new FormControl(true)
    });
  }

  addOrUpdateRuleGroup ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      this.addEditRuleGroupForm.markAsDirty();
    } else {
      this.loaderService.show();
      this.addEditRuleGroupForm.markAsPristine();
      this.rule.groupName = value.groupName;
      this.rule.organizationid = this.organizationId;
      if (!isNullOrUndefined(value._id)) {
        this.rule._id = value._id;
        this.rule.active = value.active;
      } else {
        this.rule.active = true;
      }
      this.ruleGroupService.addOrUpdateRuleGroup(this.rule).subscribe(ruleGroups => {
        this.ruleGroups = ruleGroups;
        this.closePopup();
        this.loaderService.hide();
        if (this.mode === 'Edit') {
          this._toastCtrl.success('Rule Group updated Successfully !');
        } else {
          this._toastCtrl.success('Rule Group added Successfully !');
        }
      },(error) => {
        console.log('saveRuleGroup', error);
        this.errorMessage = error as any;
        this.loaderService.hide();
        this._toastCtrl.error('Something went wrong');
      },() => {
        this.loaderService.hide();
      });
    }
  }

  setEditFormValues (details?: any) {
    details['selectedClient'] = details.organizationid;
    this.currentRuleGroupDetails = details;
  }

  closePopup () {
    this._dialogRef.close();
  }
}

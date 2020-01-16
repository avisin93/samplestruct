import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpService } from '../../../../shared/providers/http.service';

@Component({
  selector: 'app-add-edit-rule-condition',
  templateUrl: './add-edit-rule-condition-component.html',
  styleUrls: ['./add-edit-rule-condition-component.scss']
})
export class AddEditRuleConditionComponent implements OnInit {

  fields: Array<any> = [{
    text: 'Document Type', value: 'docType'
  },
  {
    text: 'Batch Class', value: 'batchClass'
  },
  {
    text: 'Batch Priority', value: 'batchPriority'
  },
  {
    text: 'Sender Name', value: 'senderName'
  },
  {
    text: 'Recipient  Name', value: 'recipientName'
  },
  {
    text: 'Sender Email', value: 'senderEmail'
  },
  {
    text: 'Courier Name', value: 'courierName'
  }];

  operations: Array<any> = [{
    text: 'Equal', value: 'equal'
  },
  {
    text: 'Not Equal', value: 'notEqual'
  }
  ];

  @Input('form') autoRoutingForm: FormGroup;

  @Input('addRuleConditionForm') addRuleConditionForm: FormGroup;

  @Input('selectedAction') selectedAction = {};

  @Input('heading') heading;

  @Input('mode') mode = '';

  record: any;

  constructor (public _fb: FormBuilder, public _dialogRef: MatDialogRef<AddEditRuleConditionComponent>) {
    this.addRuleConditionForm = this._fb.group({
      fact: new FormControl('', Validators.required),
      operator: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      id: new FormControl('')
    });
  }

  ngOnInit () {
  }

  closePopup () {
    this._dialogRef.close();
  }

  addRuleCondition ({ value, valid }: { value: any, valid: boolean }) {

    if (!valid) {
      this.addRuleConditionForm.markAsDirty();
      this.addRuleConditionForm.controls['fact'].markAsTouched();
      this.addRuleConditionForm.controls['operator'].markAsTouched();
      this.addRuleConditionForm.controls['value'].markAsTouched();

    } else {
      this._dialogRef.close();
      this.addRuleConditionForm.markAsPristine();
      this.record = value;
    }
  }

}

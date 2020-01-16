import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Pattern } from '../../../../models/util/pattern.model';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/modules/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exela-add-escalation-method-setup',
  templateUrl: './exela-add-escalation-methods-setup.component.html',
  styleUrls: ['./exela-add-escalation-methods-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExelaAddEscalationMethodSetupComponent implements OnInit {

  @Input('selectedAction') selectedAction = {};
  @Input('heading') heading;
  @Input('mode') mode = '';
  isDisabled = false;
  addEscalationMethodForm: FormGroup;
  isAndOrVisible = false;
  showNameError: Boolean = false;
  showDisplayNameError: Boolean = false;
  maxRuleCriterias: number = 3;
  showErrMsg: boolean = false;
  hideAddBtn: boolean = true;
  editMode: boolean = false;
  allContactMethods = [];
  escaleList: Array<any> = [{}];
  contactmethod: Array<any> = [
    { value: 'sms', text: 'SMS', disabled: false }, { value: 'email', text: 'EMAIL', disabled: false }, { value: 'ivr', text: 'IVR', disabled: false }
  ];
  cmethod: String = '';
  maxatt: String = '';
  attempt: any = 0;
  escalationList: Array<any> = [];

  constructor (
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<ExelaAddEscalationMethodSetupComponent>,
    public _toastCtrl: ToastrService,
    private requestService: RequestService
  ) {
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_PATTERN;
    this.addEscalationMethodForm = this._fb.group({
      _id: new FormControl(),
      escalationmethod: new FormControl('', [Validators.required]),
      contactmethod: new FormControl(''),
      maxattempts: new FormControl(''),
      deleteFlag: false,
      active: true,
      escalationOrder: this._fb.array([this.initescalationRows()])
    });
  }

  initescalationRows () {
    const NUMBER_REGEX = Pattern.ONLY_NUMBER_UPTO_FIVE;
    return new FormGroup({
      contactmethod: new FormControl('', [Validators.required]),
      maxattempts: new FormControl('', [Validators.required, Validators.pattern(NUMBER_REGEX)])
    });
  }

  ngOnInit (): void {
    this.addEscalationMethodForm.patchValue(this.selectedAction);
    this.getEscalationMethodDetails();
    if (!this.editMode) {
      this.initMethodArray();
    }
  }

  initMethodArray (i?: number) {
    this.allContactMethods = [];
    for (let index = i ? i : 0; index < 3; index++) {
      const methodInstance = {
        selectedValue: '',
        methodArray: [{ value: 'sms', text: 'SMS', disabled: false }, { value: 'email', text: 'EMAIL', disabled: false }, { value: 'ivr', text: 'IVR', disabled: false }]
      };
      this.allContactMethods.push(methodInstance);
    }
  }

  saveEscalationMethodForm ({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      const control = this.addEscalationMethodForm.controls['escalationOrder'] as FormArray;
      control.controls.forEach(element => {
        element['controls'].contactmethod.markAsTouched();
        element['controls'].maxattempts.markAsTouched();
      });
    } else {
      this.cmethod = '';
      this.maxatt = '';
      if (value.escalationOrder.length === 1) {
        for (let i = 0; i < value.escalationOrder.length; i++) {
          this.cmethod += value.escalationOrder[i].contactmethod;
          this.maxatt += value.escalationOrder[i].maxattempts;
        }
      }
      if (value.escalationOrder.length > 1) {
        this.cmethod = '';
        this.maxatt = '';
        for (let i = 0; i < value.escalationOrder.length; i++) {
          if (i === value.escalationOrder.length - 1) {
            this.cmethod += value.escalationOrder[i].contactmethod;
            this.maxatt += value.escalationOrder[i].maxattempts;
          } else {
            this.cmethod += value.escalationOrder[i].contactmethod + ', ';
            this.maxatt += value.escalationOrder[i].maxattempts + ', ';
          }
        }
      }
      value.contactmethod = this.cmethod;
      value.maxattempts = this.maxatt;
      const newObject: any = {
        _id: value._id,
        escalation_method: value.escalationmethod,
        contact_method: value.contactmethod,
        max_attempts: value.maxattempts,
        active: value.active,
        escalation_order: value.escalationOrder
      };
      if (this.mode === 'add') {
        this.requestService.doPOST('/api/reachout/escalationMethodDetails', newObject, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Escalation method has been added Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          }
        });
      } else {
        this.requestService.doPUT(`/api/reachout/escalationMethodDetails/${value._id}`, newObject, 'API_CONTRACT').subscribe(response => {
          this._toastCtrl.success('Escalation method has been updated Successfully');
          this.closePopup();
        }, (error) => {
          if (error.status === 400) {
            this._toastCtrl.error(error.error);
          }
        });
      }
    }
  }

  removeContactMethod (value, index) {
    this.allContactMethods[index]['selectedValue'] = value;
    for (let rowIndex = index; rowIndex < 2; rowIndex++) {
      this.allContactMethods[rowIndex + 1]['methodArray'] = this.allContactMethods[rowIndex]['methodArray'].filter((method) => {
        return method.value !== this.allContactMethods[rowIndex]['selectedValue'];
      });
    }
  }

  addNewRow ({ value, valid }: { value: any, valid: boolean }, selectedMethod, index) {
    let escIndex = index;
    if (this.attempt < 3) {
      let selectValue;
      value.escalationOrder.forEach((data ,index) => {
        if (escIndex === index) {
          if (data.contactmethod === '' || data.maxattempts === '') {
            this.hideAddBtn = true;
            const control = this.addEscalationMethodForm.controls['escalationOrder'] as FormArray;
            control.controls.forEach(element => {
              element['controls'].contactmethod.markAsTouched();
              element['controls'].maxattempts.markAsTouched();
            });
          } else {
            this.attempt++;
            if (this.attempt === 2) {
              this.hideAddBtn = false;
            }
            selectValue = data.contactmethod;
            this.contactmethod.forEach((item, index) => {
              if (item.value === selectValue) {
                item.disabled = true;
                let text = {};

                this.escaleList.push(text);
              }

            });
            const control = this.addEscalationMethodForm.controls['escalationOrder'] as FormArray;
            control.push(this.initescalationRows());
          }
        }
      });
    }
  }

  deleteRow (index: number) {
    this.attempt--;
    if (this.attempt < 2) {
      this.hideAddBtn = true;
    }
    // control refers to your formarray
    const control = this.addEscalationMethodForm.controls['escalationOrder'] as FormArray;
    // remove the chosen row
    control.removeAt(index);
    control.controls.forEach((c, i) => {
      this.removeContactMethod(c.value.contactmethod, i);
    });
  }

  getControls (frmGrp: FormGroup, key: string) {
    return (frmGrp.controls[key] as FormArray).controls;
  }

  setEditFormValues (details?: any) {
    this.editMode = true;
    this.allContactMethods = [];
    this.isDisabled = true;
    details.escalationOrder.forEach((details, index) => {
      const tempArray = this.addEscalationMethodForm.controls['escalationOrder'] as FormArray;
      if (index > 0) tempArray.push(this.initescalationRows());

      const methodInstance = {
        selectedValue: details.contactmethod,
        methodArray: [{ value: 'sms', text: 'SMS', disabled: false }, { value: 'email', text: 'EMAIL', disabled: false }, { value: 'ivr', text: 'IVR', disabled: false }]
      };
      this.allContactMethods.push(methodInstance);
    });

    for (let i = this.allContactMethods.length; i < this.contactmethod.length; i++) {
      const methodInstance = {
        selectedValue: '',
        methodArray: this.contactmethod.filter(cm => this.allContactMethods.findIndex(x => x.selectedValue === cm.value) === -1)
      };
      this.allContactMethods.push(methodInstance);
    }

    this.addEscalationMethodForm.patchValue(details);
    if (details.escalationOrder.length === 3) {
      this.hideAddBtn = false;

    }
  }

  closePopup () {
    this._dialogRef.close();
  }

  getEscalationMethodDetails () {
    this.requestService.doGET('/api/reachout/escalationMethodDetails', 'API_CONTRACT').subscribe(response => {
      let tmpRecords = [];
      (response as Observable<any>).forEach((item: any) => {
        if (!(item.deleteFlag)) {
          tmpRecords.push(item);
        }
      });
      this.escalationList = tmpRecords;
    }, () => {
    });
  }
}

import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../../../../common/services/navigation.service';
import { CustomValidators } from '../../../../common';
import { ROUTER_LINKS_FULL_PATH } from '../../../../config';
import { RolePermission } from '@app/shared/role-permission';

declare var $: any;

@Component({
  selector: 'step-three-activation',
  templateUrl: './step-three-activation.component.html',
  styleUrls: ['./step-three-activation.component.scss']
})
export class StepThreeActivationComponent implements OnInit {
  step3Form: FormGroup;
  isAccepted: boolean = false;
  showAcceptanceErrorMsg: boolean = false;
  submittedFlag: boolean = false;
  showLoadingFlg: boolean = false;
  @Output() onSubmitStep3Form: EventEmitter<any> = new EventEmitter<any>();
  @Input() contractFileUrl: any = [];
  @Input() contractImagesArr: any = [];
  @Input() contractPdfLink: any;
  @Input() contractPdfName: any;
  constructor(private toastrService: ToastrService,
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private _rolePermission: RolePermission) { }

  ngOnInit() {
    this.createStep3Form();
  }
  createStep3Form() {
    this.step3Form = this.fb.group({
      isagreed: ['', [CustomValidators.required, Validators.pattern('true')]],
      name: ['', [CustomValidators.required]],
      taxId: ['', [CustomValidators.required]]
    })
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!this._rolePermission.disableButtonFlag) {
        this.submit();
      }
    }
  }
  termsAndConditionsAccepted(value) {
    this.isAccepted = value;
    this.showAcceptanceErrorMsg = !this.isAccepted;
  }
  submit() {
    this.submittedFlag = true;
    if (this.isAccepted) {
      this.submittedFlag = false;
      this.showAcceptanceErrorMsg = false;
      this._rolePermission.disableButtonFlag = true;
      this._rolePermission.spinnerFlag = true;
      this.onSubmitStep3Form.emit();
    } else {
      this.showAcceptanceErrorMsg = true;
    }
  }
}

import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ContractService } from '../contracts.service';
import { Router } from '@angular/router';
import { FixedPeriodComponent } from './fixed-period/fixed-period.component';
import { ToastrService } from 'ngx-toastr';
import { FixedPeriodWithoutRenewalComponent } from './fixed-period-without-renewal/fixed-period-without-renewal.component';
import { OpenEndedContractsComponent } from './open-ended-contracts/open-ended-contracts.component';
import { HttpParams } from '@angular/common/http';
import { SessionService } from '../../shared/providers/session.service';
import { MatTab, MatTabHeader, MatDialog, MatTabGroup } from '@angular/material';
import { PopUpComponent } from '../../pop-up/pop-up.component';

const moment = require('moment');

const FIXED_PERIOD: string = 'FIXED_PERIOD';
const FIXED_PERIOD_WITHOUT_RENEWAL: string = 'FIXED_PERIOD_WITHOUT_RENEWAL';
const OPEN_ENDED_CONTRACTS: string = 'OPEN_ENDED_CONTRACTS';

@Component({
  selector: 'cm-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {
  @Input() matgroup;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(FixedPeriodComponent) fixedPeriod: FixedPeriodComponent;
  @ViewChild(FixedPeriodWithoutRenewalComponent)
  fixedPeriodWithoutRenewalComponent: FixedPeriodWithoutRenewalComponent;
  @ViewChild(OpenEndedContractsComponent)
  openEndedContractsComponent: OpenEndedContractsComponent;

  typeOfContractTerm: string;
  minStartDate = null;
  maxStartDate = null;
  arrayTimePeriods = [];
  arrayRenewalTypes = [];

  isDirtyForm: boolean = false;

  selectedIndex = 0;

  constructor(
    private router: Router,
    private contractService: ContractService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.typeOfContractTerm = '';
  }

  ngOnInit() {
    this.isDirtyForm = false;
    this.tabGroup._handleClick = this.interceptTabChange.bind(this);

    this.contractService.getTimePeriods().subscribe((res: any) => {
      this.arrayTimePeriods = res;
    });
    this.contractService.getAllRenewalTypes().subscribe((res: any) => {
      this.arrayRenewalTypes = res;
    });

    let tab = 0;
    if (typeof this.contractService.contractData !== 'undefined' && this.contractService.contractData !== null && this.contractService.contractData.term !== undefined) {
      this.typeOfContractTerm = this.contractService.contractData.term.type_of_contract_term;
      if (this.typeOfContractTerm === FIXED_PERIOD) {
        tab = 0;
      } else if (this.typeOfContractTerm === FIXED_PERIOD_WITHOUT_RENEWAL) {
        tab = 1;
      } else if (this.typeOfContractTerm === OPEN_ENDED_CONTRACTS) {
        tab = 2;
      }
    }
    // @ts-ignore
    this.tabGroup.selectedIndex = tab;

    var acc = document.getElementsByClassName("accordion");
    var panel = document.getElementsByClassName('panel');

    for (var i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panel, 'show', 'remove');

        if (setClasses) {
          this.classList.toggle("active");
          this.nextElementSibling.classList.toggle("show");
        }
      });
    }


    function setClass(els, className, fnName) {
      for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
      }
    }
  }

  async interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (this.isDirtyForm) {
      let result = await this.openDialog().then(value => {
        return value;
      }).catch();

      if (result) {
        this.selectedIndex = idx;
        this.isDirtyForm = false;
        this.isDirty.emit(false);
      }
    } else {
      this.selectedIndex = idx;
      this.isDirtyForm = false;
    }
  }

  dirtyForm(changed: boolean) {
    this.isDirtyForm = changed;
    this.isDirty.emit(changed);
  }

  openDialog() {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: `All changes will be lost?`,
          'yes': 'Ok',
          'no': 'Cancel'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        setTimeout(() => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  cancel() {
    let base = SessionService.get('base-role');
    this.router.navigate(['/' + base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  validate(typeOfContractTerm): boolean {
    let componentToCheck;
    if (typeOfContractTerm === FIXED_PERIOD) {
      componentToCheck = this.fixedPeriod;
    } else if (typeOfContractTerm === FIXED_PERIOD_WITHOUT_RENEWAL) {
      componentToCheck = this.fixedPeriodWithoutRenewalComponent;
    } else if (typeOfContractTerm === OPEN_ENDED_CONTRACTS) {
      componentToCheck = this.openEndedContractsComponent;
    }

    let validate = true;
    Object.keys(componentToCheck.formGroup.controls).forEach(key => {
      componentToCheck.formGroup.get(key).markAsTouched();
      if (componentToCheck.formGroup.get(key).invalid) {
        validate = false;
      }
    });

    return validate;
  }

  saveAndContinueTermContract(typeOfContractTerm: string): void {
    if (!this.validate(typeOfContractTerm)) {
      return;
    }

    this.typeOfContractTerm = typeOfContractTerm;

    let objectData = {
      type: 'TERM',
      data: {
        term: {}
      }
    };
    if (typeOfContractTerm === FIXED_PERIOD) {
      const startDate = moment(this.fixedPeriod.formGroup.get('startDate').value);
      const endDate = moment(this.fixedPeriod.formGroup.get('endDate').value);
      objectData.data.term = {
        type_of_contract_term: FIXED_PERIOD,
        start_date: this.fixedPeriod.formGroup.get('startDate').value,
        end_date: this.fixedPeriod.formGroup.get('endDate').value,
        contract_term: endDate.diff(startDate, 'days'),
        contract_term_type_code: 'DAYS',
        signed_date: this.fixedPeriod.formGroup.get('signedDate').value,
        renewal_type_code: this.fixedPeriod.formGroup.get('renewalType').value,
        notice_period: this.fixedPeriod.formGroup.get('noticePeriod').value,
        notice_period_type_code: this.fixedPeriod.formGroup.get('noticePeriodType').value,
        grace_period: this.fixedPeriod.formGroup.get('gracePeriod').value,
        grace_period_type_code: this.fixedPeriod.formGroup.get('gracePeriodType').value,
        grace_period_description: this.fixedPeriod.formGroup.get('gracePeriodDescription').value
      };
    } else if (typeOfContractTerm === FIXED_PERIOD_WITHOUT_RENEWAL) {
      const startDate = moment(this.fixedPeriodWithoutRenewalComponent.formGroup.get('startDate').value);
      const endDate = moment(this.fixedPeriodWithoutRenewalComponent.formGroup.get('endDate').value);
      objectData.data.term = {
        type_of_contract_term: FIXED_PERIOD_WITHOUT_RENEWAL,
        start_date: this.fixedPeriodWithoutRenewalComponent.formGroup.get('startDate').value,
        end_date: this.fixedPeriodWithoutRenewalComponent.formGroup.get('endDate').value,
        contract_term: endDate.diff(startDate, 'days'),
        contract_term_type_code: 'DAYS',
        signed_date: this.fixedPeriodWithoutRenewalComponent.formGroup.get('signedDate').value,
        grace_period_description: this.fixedPeriodWithoutRenewalComponent.formGroup.get('gracePeriodDescription').value,
        grace_period: this.fixedPeriodWithoutRenewalComponent.formGroup.get('gracePeriod').value
      };
    } else if (typeOfContractTerm === OPEN_ENDED_CONTRACTS) {
      objectData.data.term = {
        type_of_contract_term: OPEN_ENDED_CONTRACTS,
        start_date: this.openEndedContractsComponent.formGroup.get('startDate').value,
        signed_date: this.openEndedContractsComponent.formGroup.get('signedDate').value,
        grace_period_description: this.openEndedContractsComponent.formGroup.get('gracePeriodDescription').value
      };
    } else {
      this.toastr.error('Error', 'Something went wrong(Invalid type of contract term)');
    }

    const urlParams = {
      contractId: `${this.contractService.contractId}`
    };
    this.contractService.updateContract(objectData, urlParams).subscribe((response: any) => {
      if (response.msg != null && response.msg === 'Failed') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success('Operation Complete', (typeOfContractTerm === 'FIXED_PERIOD' ? 'Fixed Period' :
          (typeOfContractTerm === 'FIXED_PERIOD_WITHOUT_RENEWAL' ? 'Fixed Period Without Renewal' : 'Open Ended Contracts'))
          + ' successfully updated');
      }
    });

    this.isDirty.emit(false);
    this.matgroup.selectedIndex += 1;
  }
  //   else {
  //     this.toastr.error(
  //       'Error',
  //       'Something went wrong(Invalid start date or signed date)'
  //     );
  //   }
  // }
}

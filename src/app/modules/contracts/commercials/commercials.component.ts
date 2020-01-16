import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '../contracts.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralTermsComponent } from './general-terms/general-terms.component';
import { MatTabGroup, MatTab, MatTabHeader, MatDialog } from '@angular/material';
import { SessionService } from '../../shared/providers/session.service';
import { PopUpComponent } from '../../pop-up/pop-up.component';

const GENERAL_TERMS = 'GENERAL_TERMS';

@Component({
  selector: 'cm-commercials',
  templateUrl: './commercials.component.html',
  styleUrls: ['./commercials.component.scss']
})
export class CommercialsComponent implements OnInit, AfterViewInit {

  @Input() generalInfoLocation: string;
  @Input() matgroup;
  isDirtyForm: boolean = false;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  addMode: boolean;
  indexOfHighestOpenedTab: number = 0;
  result: boolean = false;

  selectedIndex = 0;

  @ViewChild('matgroupCommercials') matgroupCommercials: MatTabGroup;
  @ViewChild(GeneralTermsComponent) generalTerms: GeneralTermsComponent;

  constructor(
    private router: Router,
    private contractService: ContractService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.addMode = this.contractService.addMode;
    this.indexOfHighestOpenedTab = this.contractService.indexOfHighestOpenedTabCommercials;
  }

  ngOnInit() {
    this.isDirtyForm = false;
    this.matgroupCommercials._handleClick = this.interceptTabChange.bind(this);
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

  ngAfterViewInit() {
    if (this.addMode && this.contractService.indexOfHighestOpenedTabCommercials) {
      this.matgroupCommercials._tabs.forEach((matTab, i) => {
        if (i <= this.contractService.indexOfHighestOpenedTabCommercials) {
          matTab.disabled = false;
        }
      });
    }
  }

  cancel(): void {
    let base = SessionService.get('base-role');
    this.router.navigate([base + '/dashboard/events-and-reminders']).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }

  validate(subType): boolean {
    let component;
    if (subType === GENERAL_TERMS) {
      component = this.generalTerms;
    }
    let validate = true;
    Object.keys(component.formGroup.controls).forEach(key => {
      component.formGroup.get(key).markAsTouched();
      if (component.formGroup.get(key).invalid) {
        validate = false;
      }
    });

    return validate;
  }

  saveAndContinueCommercials(subType: string): void {
    if (!this.validate(subType)) {
      return;
    }
    const objectData = {
      'type': 'COMMERCIALS_GENERAL_TERMS',
      'data': {}
    };

    if (subType === GENERAL_TERMS) {
      objectData.data = {
        'credit_period_type_code': this.generalTerms.formGroup.get('creditPeriodType').value,
        'billing_frequency_type_code': this.generalTerms.formGroup.get('billingFrequencyType').value,
        'credit_period': this.generalTerms.formGroup.get('creditPeriod').value,
        'billing_start_date': this.generalTerms.formGroup.get('billingStartDate').value,
        'billing_end_date': this.generalTerms.formGroup.get('billingEndDate').value,
        'billing_currency_type_code': this.generalTerms.formGroup.get('billingCurrency').value,
        'clause': this.generalTerms.formGroup.get('clause').value
      };
    } else {
      this.toastr.error('Error', 'Something went wrong(Invalid type of contract term)');
    }

    const urlParams = {
      'contractId': `${this.contractService.contractId}`
    };
    this.contractService.updateContract(objectData, urlParams).subscribe((response: any) => {
      if (response.msg != null && response.msg === 'Failed') {
        this.toastr.error('Error', 'Something went wrong');
      } else {
        this.contractService.contractId = response._id;
        this.contractService.contractData = response;
        this.toastr.success('Operation Complete', 'General Terms successfully updated');
      }
    }, (error) => {
      console.log(error);
      this.toastr.error('Error', 'Something went wrong(Cannot update contract)');
    });

    this.isDirty.emit(false);
    this.matgroupCommercials.selectedIndex += 1;
  }

  onTabChange() {

    if (this.addMode && this.indexOfHighestOpenedTab < this.matgroupCommercials.selectedIndex) {
      this.matgroupCommercials._tabs.forEach((matTab, i) => {
        if (i <= this.matgroupCommercials.selectedIndex) {
          matTab.disabled = false;
        }
      });
      this.indexOfHighestOpenedTab = this.matgroupCommercials.selectedIndex;
      this.contractService.indexOfHighestOpenedTabCommercials = this.matgroupCommercials.selectedIndex;
    }
  }

  openDialog() {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(PopUpComponent, {
        width: '450px',
        data: {
          message: `All changes will be lost?`,
          'yes': 'Ok',
          'no': 'Cancel',
          'fontSize': '15px'
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
}

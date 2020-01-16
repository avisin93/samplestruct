import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../contracts.service';
import { MatTabGroup, MatDialog, MatTab, MatTabHeader } from '@angular/material';
import { OtherCommercialTermsService } from './other-commercial-terms.service';
import { PopUpComponent } from '../../pop-up/pop-up.component';

@Component({
  selector: 'cm-other-commercial-terms',
  templateUrl: './other-commercial-terms.component.html',
  styleUrls: ['./other-commercial-terms.component.scss']
})
export class OtherCommercialTermsComponent implements OnInit, AfterViewInit {

  @Input() matgroup;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  isDirtyForm: boolean = false;

  addMode: boolean;
  indexOfHighestOpenedTab: number = 0;

  arrayTimePeriods: any[];
  arrayStatus: any[];
  arrayIncentiveStatus: any[];
  arrayEarlyPaymentDiscStatus: any[];
  arrayTerminationTerms: any[];
  arrayTerminationStatus: any[];
  arrayCurrencies: any[];

  selectedIndex = 0;

  @ViewChild('matgroupCommercials') matgroupCommercials: MatTabGroup;

  constructor(
    private router: Router,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private otherCommercialTermsService: OtherCommercialTermsService,
    public dialog: MatDialog
  ) {
    this.addMode = this.contractService.addMode;
    this.indexOfHighestOpenedTab = this.contractService.indexOfHighestOpenedTabOtherCommercialTerms;
  }

  ngOnInit() {
    this.matgroupCommercials._handleClick = this.interceptTabChange.bind(this);

    this.contractService.getTimePeriods().subscribe((res: any[]) => {
      this.arrayTimePeriods = res;
    });

    this.contractService.getAllStatus().subscribe((res: any[]) => {
      this.arrayStatus = res;
    });

    this.contractService.getAllIncentiveStatus().subscribe((res: any[]) => {
      this.arrayIncentiveStatus = res;
    });

    this.contractService.getAllEarlyPayDiscStatus().subscribe((res: any[]) => {
      this.arrayEarlyPaymentDiscStatus = res;
    });

    this.contractService.getAllTerminationStatus().subscribe((res: any[]) => {
      this.arrayTerminationStatus = res;
    });

    this.contractService.getAllTerminationTerm().subscribe((res: any[]) => {
      this.arrayTerminationTerms = res;
    });

    this.contractService.getAllCurrencies().subscribe((res: any[]) => {
      this.arrayCurrencies = res;
    });

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

  ngAfterViewInit() {
    if (this.addMode && this.contractService.indexOfHighestOpenedTabOtherCommercialTerms) {
      this.matgroupCommercials._tabs.forEach((matTab, i) => {
        if (i <= this.contractService.indexOfHighestOpenedTabOtherCommercialTerms) {
          matTab.disabled = false;
        }
      });
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

  isChildDirty(changed: boolean) {
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

  onTabChange() {
    if (this.addMode && this.indexOfHighestOpenedTab < this.matgroupCommercials.selectedIndex) {
      this.matgroupCommercials._tabs.forEach((matTab, i) => {
        if (i <= this.matgroupCommercials.selectedIndex) {
          matTab.disabled = false;
        }
      });
      this.indexOfHighestOpenedTab = this.matgroupCommercials.selectedIndex;
      this.contractService.indexOfHighestOpenedTabOtherCommercialTerms = this.matgroupCommercials.selectedIndex;
    }
  }
}

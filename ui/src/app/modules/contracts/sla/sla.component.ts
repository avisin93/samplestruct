import { Component, OnInit, ViewChild, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatTabGroup, MatDialog, MatTab, MatTabHeader } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../contracts.service';
import { OtherCommercialTermsService } from '../other-commercial-terms/other-commercial-terms.service';
import { PopUpComponent } from '../../pop-up/pop-up.component';

@Component({
  selector: 'cm-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss']
})
export class SlaComponent implements OnInit, AfterViewInit {

  @Input() matgroup;
  @Output() isDirty: EventEmitter<boolean> = new EventEmitter();

  arrayCurrencies: any[];

  addMode: boolean;
  indexOfHighestOpenedTab: number = 0;

  isDirtyForm: boolean = false;

  selectedIndex = 0;

  @ViewChild('matgroupSla') matgroupSla: MatTabGroup;

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.addMode = this.contractService.addMode;
    this.indexOfHighestOpenedTab = this.contractService.indexOfHighestOpenedTabSla;
  }

  ngOnInit() {
    this.isDirtyForm = false;
    this.matgroupSla._handleClick = this.interceptTabChange.bind(this);

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
    if (this.addMode && this.contractService.indexOfHighestOpenedTabSla) {
      this.matgroupSla._tabs.forEach((matTab, i) => {
        if (i <= this.contractService.indexOfHighestOpenedTabSla) {
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

  onTabChange() {
    if (this.addMode && this.indexOfHighestOpenedTab < this.matgroupSla.selectedIndex) {
      this.matgroupSla._tabs.forEach((matTab, i) => {
        if (i <= this.matgroupSla.selectedIndex) {
          matTab.disabled = false;
        }
      });
      this.indexOfHighestOpenedTab = this.matgroupSla.selectedIndex;
      this.contractService.indexOfHighestOpenedTabSla = this.matgroupSla.selectedIndex;
    }
  }
}

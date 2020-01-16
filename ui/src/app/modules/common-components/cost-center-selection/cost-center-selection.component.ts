import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-cost-center-selection',
  templateUrl: './cost-center-selection.component.html',
  styleUrls: ['./cost-center-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CostCenterSelectionComponent implements OnInit {

  selectedCostCenter: any = '';

  selectCostCenterError: boolean = false;

  costCenters: Array<any> = [];

  constructor (public _dialogRef: MatDialogRef<CostCenterSelectionComponent>) {

  }

  ngOnInit () {
    $('.cost-center-selection-popup-wrap').closest('.cdk-overlay-pane').addClass('costCenterSelectionPopup');
    this.getAllCostCenters();
  }

  getAllCostCenters () {
    this.costCenters = [
      {
        id: 1,
        costCenterName: 'BOA - NY',
        dealCode: 'BOA123NY'
      },
      {
        id: 2,
        costCenterName: 'BOA - XY',
        dealCode: 'BOA123NY'
      },
      {
        id: 3,
        costCenterName: 'BOA - AB',
        dealCode: 'BOA123NY'
      },
      {
        id: 4,
        costCenterName: 'BOA - CD',
        dealCode: 'BOA123CD'
      },
      {
        id: 5,
        costCenterName: 'BOA - EF',
        dealCode: 'BOA123NY'
      },
      {
        id: 6,
        costCenterName: 'BOA - GH',
        dealCode: 'BOA123NY'
      },
      {
        id: 7,
        costCenterName: 'BOA - NT',
        dealCode: 'BOA123NY'
      },
      {
        id: 8,
        costCenterName: 'BOA - TY',
        dealCode: 'BOA123TY'
      },
      {
        id: 9,
        costCenterName: 'BOA - RT',
        dealCode: 'BOA123RT'
      },
      {
        id: 10,
        costCenterName: 'BOA - WE',
        dealCode: 'BOA123WE'
      }
    ];
  }

  addSelectedCostCenter () {
    if (this.selectedCostCenter !== '') {
      this.selectCostCenterError = false;
      this._dialogRef.close(this.selectedCostCenter);
    } else {
      this.selectCostCenterError = true;
    }
  }

  closePopup () {
    this._dialogRef.close();
  }

}

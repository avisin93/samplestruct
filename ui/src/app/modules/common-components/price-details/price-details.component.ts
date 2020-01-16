import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-price-details',
  templateUrl: './price-details.component.html',
  styleUrls: ['./price-details.component.scss']
})

export class PriceDetailsComponent implements OnInit {

  @Input('info') info: any;

  details: Array<any> = [];

  constructor (public _dialogRef: MatDialogRef<PriceDetailsComponent>) {
    this.details = [
      {
        attribute: 'Binding',
        billingUnit: 'Per Copy',
        componentPrice: 1.56,
        count: 10,
        price: 15.60
      },
      {
        attribute: 'Impressions',
        billingUnit: 'Per Impressions',
        componentPrice: 0.03,
        count: 10,
        price: 0.27
      },
      {
        attribute: 'Impressions',
        billingUnit: 'Per Impressions',
        componentPrice: 1.56,
        count: 160,
        price: 21.04
      },
      {
        attribute: 'Paper Media',
        billingUnit: 'Per Impressions',
        componentPrice: 0.07,
        count: 170,
        price: 12.44
      }
    ];
  }

  ngOnInit (): void {
    console.log(this.info);
    $('.price-details-wrap').closest('.cdk-overlay-pane').addClass('priceDetailsPopup');
  }

  closePopup () {
    this._dialogRef.close();
  }

}

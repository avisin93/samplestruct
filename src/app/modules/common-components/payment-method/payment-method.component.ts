import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-job-details-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class JobDetailsPaymentMethodComponent implements OnInit {

  paymentMethod: any = 1;

  constructor (public _dialogRef: MatDialogRef<JobDetailsPaymentMethodComponent>) {

  }

  ngOnInit () {
    $('.payment-method-popup-wrap').closest('.cdk-overlay-pane').addClass('paymentMethodPopup');
  }

  closePopup () {
    this._dialogRef.close();
  }

}

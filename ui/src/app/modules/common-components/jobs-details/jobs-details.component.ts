import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { JobDetailsPaymentMethodComponent } from '../payment-method/payment-method.component';

@Component({
  selector: 'app-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss']
})

export class JobsDetailsComponent implements OnInit {

  breadcrumbs: Array<any> = [
    {
      text: 'Home',
      base: true,
      link: '/home',
      active: false
    },
    {
      text: 'Jobs',
      base: true,
      link: '/job-list',
      active: false
    },
    {
      text: 'Job 1 Details',
      base: false,
      link: '',
      active: true
    }
  ];

  constructor (private route: ActivatedRoute, public dialog: MatDialog) {

  }

  ngOnInit () {
    this.route.data.subscribe((dataParam: any) => {
      console.log(dataParam);
      let bIndex = this.breadcrumbs.findIndex((item: any) => {
        return item.text === 'Jobs';
      });

      this.breadcrumbs[bIndex].link = dataParam.jobsLink;
    });
  }

  paymentMethodPopup () {
    let paymentMethodDialogRef = this.dialog.open(JobDetailsPaymentMethodComponent, {
      width: '600px',
      height: '500px',
      panelClass: 'appModalPopup'
    });
  }

}

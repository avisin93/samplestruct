import { Component, OnInit } from '@angular/core';
import { ContractExpiryScheduleService } from './contract-expiry-schedule.service';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/providers/session.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'cm-status-time-circle',
  templateUrl: './contract-expiry-schedule.component.html',
  styleUrls: ['./contract-expiry-schedule.component.scss']
})
export class ContractExpiryScheduleComponent implements OnInit {
  oneWeekCircle = {
    index: 1,
    name: '1 Week',
    value: 0,
    type: 'WEEK'
  };

  oneMonthCircle = {
    index: 2,
    name: '1 Month',
    value: 0,
    type: 'MONTH'
  };

  oneThreeMonthCircle = {
    index: 3,
    name: '1 To 3 Months',
    value: 0,
    type: '3MONTH'
  };

  threeSixMonthCircle = {
    index: 4,
    name: '3 To 6 Months',
    value: 0,
    type: '6MONTH'
  };

  sixTwelveMonthCircle = {
    index: 5,
    name: '6 To 12 Months',
    value: 0,
    type: '12MONTH'
  };

  contractExpiryScheduleCircle = [
    this.oneWeekCircle,
    this.oneMonthCircle,
    this.oneThreeMonthCircle,
    this.threeSixMonthCircle,
    this.sixTwelveMonthCircle
  ];

  constructor (
    private router: Router,
    private contractExpiryScheduleService: ContractExpiryScheduleService,
    private loaderService: LoaderService
  ) {}

  ngOnInit () {
    this.loaderService.show();
    this.contractExpiryScheduleService.getContractsExpirySchedules().subscribe((data: any) => {
      this.loaderService.hide();
      this.contractExpiryScheduleCircle = data;
    });
  }

  navigateToContractList (contractExpirySchedule) {
    let base = SessionService.get('base-role');
    this.router.navigate([
      base + '/contract-list',
      { search: contractExpirySchedule.type }
    ]).then(nav => {
      console.log(nav);
    }, err => {
      console.log(err);
    });
  }
}

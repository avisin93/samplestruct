import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ContractService } from '../contracts/contracts.service';
import { RecentActivitiesService } from './recent-activities/recent-activities.service';
import { HttpParams } from '@angular/common/http';
import { StorageService } from '../shared/providers/storage.service';
interface Tasks {
  BUSSINES_PARTNER: string;
  CATEGORY: string;
  CONTRACT_TITLE: string;
  ASSIGNED_TO: string;
  AGE_IN_DAYS: number;
  COMPLETITION_STATUS: string;
  DUE_DATE: string;
}

interface RecentActivities {
  USER: string;
  ACTIVITY: string;
  DATE: string;
}

const ELEMENT_DATA: Tasks[] = [
  {
    BUSSINES_PARTNER: 'The Insolvency Exchange',
    CATEGORY: 'Customer',
    CONTRACT_TITLE: 'Mailroom',
    ASSIGNED_TO: 'John',
    AGE_IN_DAYS: 8,
    COMPLETITION_STATUS: '83',
    DUE_DATE: new DatePipe('en-US').transform(
      new Date('2018-05-09'),
      'MM/dd/yyyy'
    )
  },
  {
    BUSSINES_PARTNER: 'The Insolvency Exchange',
    CATEGORY: 'Customer',
    CONTRACT_TITLE: 'Mailroom',
    ASSIGNED_TO: 'John',
    AGE_IN_DAYS: 8,
    COMPLETITION_STATUS: '52',
    DUE_DATE: new DatePipe('en-US').transform(
      new Date('2018-10-20'),
      'MM/dd/yyyy'
    )
  },
  {
    BUSSINES_PARTNER: 'The Insolvency Exchange',
    CATEGORY: 'Customer',
    CONTRACT_TITLE: 'Mailroom',
    ASSIGNED_TO: 'John',
    AGE_IN_DAYS: 8,
    COMPLETITION_STATUS: '65',
    DUE_DATE: null
  },
  {
    BUSSINES_PARTNER: 'The Insolvency Exchange',
    CATEGORY: 'Customer',
    CONTRACT_TITLE: 'Mailroom',
    ASSIGNED_TO: 'John',
    AGE_IN_DAYS: 8,
    COMPLETITION_STATUS: '27',
    DUE_DATE: null
  }
];

@Component({
  selector: 'cm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnDestroy, OnInit {
  private alive = true;

  breadcrumbs: Array<any> = [
    {
      text: 'Dashboard',
      base: true,
      active: true
    }
  ];

  displayedColumns: string[] = [
    'BUSSINES_PARTNER',
    'CATEGORY',
    'CONTRACT_TITLE',
    'ASSIGNED_TO',
    'AGE_IN_DAYS',
    'COMPLETITION_STATUS'
  ];
  displayedColumnsRenewalsDue: string[] = [
    'BUSSINES_PARTNER',
    'CATEGORY',
    'CONTRACT_TITLE',
    'ASSIGNED_TO',
    'DUE_DATE'
  ];
  dataSource = ELEMENT_DATA;

  displayedColumnsRecentAct: string[] = ['USER', 'ACTIVITY', 'DATE'];

  arrayContractsStages: any[] = [];
  arrayContractsStagesView: any[] = [];
  arrayNumbersOfPageContractsStages: any[] = [];
  selectedPageContractsStages: number = 0;

  recentActivities: RecentActivities[];

  constructor (
    private contractService: ContractService,
    private recentActivitiesService: RecentActivitiesService
  ) {
  }

  ngOnDestroy () {
    this.alive = false;
  }

  dataSourceRecentAct = this.recentActivities;

  ngOnInit () {
    this.arrayContractsStagesView.push({});
    this.getClientUserDashboardStagesCards();
    this.recentActivitiesService.getRecentActivities().subscribe((response: any) => {
      this.recentActivities = response;
    });
  }

  getClientUserDashboardStagesCards (): void {
    const queryParams = new HttpParams().set('onlyVisibleStages', 'true');
    this.contractService.getContractsStagesCountByClientUserDashboardConfiguration(queryParams).subscribe((response: any) => {
      if (response) {
        this.arrayContractsStages = response;
        if (response.length > 4) {
          const modOfPages = this.arrayContractsStages.length % 4;
          const numOfPages = this.arrayContractsStages.length / 4;
          const lengthPage = modOfPages === 0 ? numOfPages : numOfPages + 1;
          this.arrayNumbersOfPageContractsStages = Array.apply(null, { length: lengthPage }).map(Number.call, Number);
          this.currentPageContractsStages(0);
        } else {
          this.arrayContractsStagesView = response;
        }
      }
    });
  }

  currentPageContractsStages (i: number): void {
    this.selectedPageContractsStages = i;
    this.arrayContractsStagesView = this.arrayContractsStages.slice(i * 4, (i + 1) * 4);
  }
}

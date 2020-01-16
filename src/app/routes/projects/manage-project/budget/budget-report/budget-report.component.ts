import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Common, NavigationService, TriggerService } from '@app/common';
import { BudgetTableComponent } from './budget-table/budget-table.component';
import { EVENT_TYPES, ROUTER_LINKS, ROUTER_LINKS_FULL_PATH } from '@app/config';
import { BUDGET_TYPE } from '../budget.constants';
import { ProjectsData } from '../../../projects.data';
declare var $: any;

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent implements OnInit, OnDestroy {
  @ViewChild('budgetTable') budgetTable: BudgetTableComponent;
  BUDGET_TYPE = BUDGET_TYPE;
  flag: Boolean =  false;
  budgetAmountDetailsFlag: Boolean = false;
  currencies: any[] = [
    { value: '0', label: 'EUR' },
    { value: '1', label: 'USD' },
    { value: '2', label: 'MXN' },
    { value: '3', label: 'GBP' },
  ];
  newData: any;
  tabType: string;
  constructor(private triggerService: TriggerService,
    private projectsData: ProjectsData,
  ) { }


  dataReceived(constantData) {
    if (constantData) {
      this.newData = constantData;
      this.budgetAmountDetailsFlag = true;
    }
  }

  ngOnInit() {
    this.updateBackToListPath();
    this.setEventType({ type: EVENT_TYPES.budgetReportEvent, prevValue: {}, currentValue: EVENT_TYPES.budgetReportEvent });
  }
  ngOnDestroy() {
    this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: {}, currentValue: '' });
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }

  setBudgetType(data , event) {
    this.tabType = data;
    // tslint:disable-next-line:triple-equals
    $(event.target).parents('ul').find('.nav-link').removeClass('active');
    $(event.target).addClass('active');
  }
/**
 * Updates list path to budget list
 */
  updateBackToListPath() {
    const url = Common.sprintf(ROUTER_LINKS_FULL_PATH.budgetSheets, [this.projectsData.projectId]);
   this.setEventType({ type: EVENT_TYPES.backToListEvent, prevValue: '', currentValue: url });
  }
}

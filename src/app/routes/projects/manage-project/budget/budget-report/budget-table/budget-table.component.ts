import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BUDGET_TYPE } from '../../budget.constants';
import { BudgetTableService } from './budget-table.services';
import { Common, TriggerService } from '@app/common';
import { ProjectsData } from '../../../../projects.data';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BudgetDetailsService } from '../../../budget/budget.services';
import * as _ from 'lodash';
import { EVENT_TYPES } from '@app/config';

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.scss']
})
export class BudgetTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tabType: any;
  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();
  BUDGET_TYPE = BUDGET_TYPE;
  tabHeading: any;
  constantData: any;

  projectId: String;
  projectBudgetId: String;
  showLoadingFlg: Boolean = false;
  BUDGET_LIST_QUERY_PARAMS = {
    'projectId': 'projectId',
    'projectBudgetId': 'projectBudgetId',
    'pageType': 'pageType',
  };
  tabSelectType: any = 0;
  aicpData: any;
  tempdata: any;
  projectDetails: any;
  constructor(private translate: TranslateService,
    private _budgetTableService: BudgetTableService,
    private _budgetDetailsService: BudgetDetailsService,
    private projectsData: ProjectsData,
    private route: ActivatedRoute,
    private triggerService: TriggerService) {

  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectBudgetId = params['id'];
    });
    this.projectId = this.projectsData.projectId;
    this.getBudgetData();
    this.getBudgetTableDetails();
  }

  ngOnDestroy() {
    this._budgetTableService.setBudgetReportData([]);
    this._budgetTableService.setObservableReportData([]);
    this.setEventType({ type: EVENT_TYPES.budgetTableEvent, prevValue: {}, currentValue: undefined });
  }

  /**
* Detects tab selection changes
* @param changes
*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes.tabType.currentValue !== undefined) {
      this.tabSelectType = changes.tabType.currentValue;
    }
    if (this.projectId) {
      this.getBudgetTableDetails();
    }
  }
  getBudgetAmountDetails() {
    if (!this.constantData) {
      this.constantData = {
        working: this.aicpData.working,
        actual: this.aicpData.actual,
        estimate: this.aicpData.estimate,
        budgetName: this.aicpData.budgetName
      };
      this.sendData.emit(this.constantData);
    }
  }

  /**
  * Query params to get service data
   */
  getQueryParam() {
    let params: HttpParams = new HttpParams();
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.projectId, this.projectId.toString());
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.projectBudgetId, this.projectBudgetId.toString());
    params = params.append(this.BUDGET_LIST_QUERY_PARAMS.pageType, this.tabSelectType.toString());
    return params;
  }


  getBudgetData() {
    this._budgetDetailsService.getBudgetDetails(this.projectId, this.projectBudgetId).subscribe((response: any) => {
      if (Common.checkStatusCodeInRange(response.header.statusCode)) {
        if (response.payload && response.payload.result) {
          this.projectDetails = response.payload.result;
          const budgetName = (this.projectDetails && this.projectDetails.budget && this.projectDetails.budget.name) ? this.projectDetails.budget.name : '';
          this.setEventType({ type: EVENT_TYPES.budgetTableEvent, prevValue: {}, currentValue: { budgetName: budgetName } });
        }
      }
    });
  }
  setEventType(event: any) {
    this.triggerService.setEvent(event);
  }
  /**
  * Gets budget sheet details from web service
 */
  getBudgetTableDetails() {
    this.showLoadingFlg = true;
    this.aicpData = [];
    this._budgetTableService.getbudgetTableData(this.projectId, this.projectBudgetId,
      this.getQueryParam(), this.tabSelectType.toString())
      .subscribe((response: any) => {
        if (response.header.statusCode && Common.checkStatusCodeInRange(response.header.statusCode)) {
          this.showLoadingFlg = false;
          if (response && response.payload) {
            const tempdata = response.payload.result;
            let index = 1;
            for (let i = 0; i <= tempdata.category.length; i++) {
              if (tempdata.category[i] && tempdata.category[i].isSubtotal !== true) {
                tempdata.category[i]['topSheetIndex'] = index;
                index++;
              }
            }
            this.aicpData = tempdata;
            this.getBudgetAmountDetails();
          }
        }
      });
  }

}

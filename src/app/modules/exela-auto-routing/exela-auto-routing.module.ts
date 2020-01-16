// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { AutoCompleteModule } from 'primeng/primeng';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ExelaAutoRoutingRoutingModule } from './exela-auto-routing-routing.module';

// Components
import { AutoRoutingComponent } from './auto-routing/auto-routing.component';
import { RuleExecutionComponent } from './auto-routing/rule-execution/rule-execution.component';
import { RuleConditionComponent } from './auto-routing/rule-condition/rule-condition.component';
import { InvocationTriggerComponent } from './auto-routing/invocation-trigger/invocation-trigger.component';
import { ExelaAutoRoutingComponent } from './exela-auto-routing.component';
import { AddEditRuleConditionComponent } from './auto-routing/rule-condition/add-edit-rule-condition/add-edit-rule-condition-component';
import { RoutingRuleMoveToFolderComponent } from './auto-routing/rule-execution/move-to-folder/routing-rule-move-to-folder.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ExelaAutoRoutingRoutingModule,
    PerfectScrollbarModule,
    TreeModule,
    AutoCompleteModule
  ],
  declarations: [
    AutoRoutingComponent,
    RuleExecutionComponent,
    RuleConditionComponent,
    InvocationTriggerComponent,
    ExelaAutoRoutingComponent,
    AddEditRuleConditionComponent,
    RoutingRuleMoveToFolderComponent
  ],
  exports: [
  ],
  entryComponents: [
    AddEditRuleConditionComponent,
    RoutingRuleMoveToFolderComponent
  ],
  providers: [
  ]
})
export class ExelaAutoRoutingModule { }

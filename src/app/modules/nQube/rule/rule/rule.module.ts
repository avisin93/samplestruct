// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '../../../shared/shared.module';
import { CommonComponentsModule } from '../../../common-components/common-components.module';
import { RuleRoutingModule } from './rule-routing.module';

// Components
import { RuleComponent } from './rule.component';
import { AddEditRuleComponent } from './add-edit-rule/add-edit-rule.component';
import { AddEditRuleGroupComponent } from '../rule-group/add-edit-rule-group/add-edit-rule-group.component';
import { RuleGroupModule } from '../rule-group/rule-group.module';
import { MaterialModule } from 'src/app/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    RuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,

    RuleGroupModule
  ],
  declarations: [
    RuleComponent,
    AddEditRuleComponent
    // AddEditRuleGroupComponent
  ],
  exports: [
    RuleComponent
  ],
  entryComponents: [
    AddEditRuleComponent
  // AddEditRuleGroupComponent
  ],
  providers: [
  ]
})
export class RuleModule { }

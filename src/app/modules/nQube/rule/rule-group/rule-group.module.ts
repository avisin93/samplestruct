// Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';

// Modules
import { SharedModule } from '../../../shared/shared.module';
import { CommonComponentsModule } from '../../../common-components/common-components.module';
import { RuleGroupRoutingModule } from './rule-group-routing.module';

// Components
import { RuleGroupComponent } from './rule-group.component';
import { AddEditRuleGroupComponent } from './add-edit-rule-group/add-edit-rule-group.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    RuleGroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ],
  declarations: [
    RuleGroupComponent,
    AddEditRuleGroupComponent
  ],
  exports: [
    RuleGroupComponent
  ],
  entryComponents: [
    AddEditRuleGroupComponent
  ],
  providers: [
  ]
})
export class RuleGroupModule { }

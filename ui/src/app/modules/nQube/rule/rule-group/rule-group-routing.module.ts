// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleGroupComponent } from './rule-group.component';
import { AddEditRuleGroupComponent } from './add-edit-rule-group/add-edit-rule-group.component';
import { RuleGroupService } from './rule-group.service';

// Components

const routes: Routes = [
  {
    path: '',
    component: RuleGroupComponent
  } ,
  {
    path: 'add',
    component: AddEditRuleGroupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditRuleGroupComponent,
    data: {
      mode: 'edit'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    RuleGroupService
  ]
})
export class RuleGroupRoutingModule { }

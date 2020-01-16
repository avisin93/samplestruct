// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleComponent } from './rule.component';
import { AddEditRuleComponent } from './add-edit-rule/add-edit-rule.component';
import { RuleService } from './rule.service';

// Components

const routes: Routes = [
  {
    path: '',
    component: RuleComponent
  } ,
  {
    path: 'add/:organizationId',
    component: AddEditRuleComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id/:organizationId',
    component: AddEditRuleComponent,
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
    RuleService
  ]
})
export class RuleRoutingModule { }

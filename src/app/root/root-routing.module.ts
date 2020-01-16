import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from '../modules/login/login.component';
import { AuthGuardService } from '../modules/auth/auth-guard.service';
import { ContractsComponent } from '../modules/contracts/contracts.component';
import { ContractResolve } from '../modules/contracts/contracts.resolve';
import { RoleComponent } from './role/role.component';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { ContractListComponent } from '../modules/contract-list/contract-list.component';
import { DocSearchComponent } from '../modules/doc-search/doc-search.component';
import { DocHistoryComponent } from '../modules/doc-search/doc-history/doc-history.component';
import { NotificationListComponent } from '../modules/notification/notification-list.component';
import { TrashComponent } from '../modules/trash/trash.component';
import { AddEditNotificationComponent } from '../modules/notification/add-edit-notification/add-edit-notification.component';
import { LoaderComponent } from '../modules/shared/components/loader/loader.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    loadChildren: '../modules/exela-landing-page/exela-landing-page.module#ExelaLandingPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: ':role',
    component: RoleComponent,
    canActivate: [AuthGuardService],
    data: {
      breadcrumb: ''
    },
    children: [
      {
        path: 'client-setup',
        loadChildren: '../modules/client-setup/client-setup.module#ClientSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'dmr-dashboard',
        redirectTo: 'exela-product-setup',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-client-setup',
        loadChildren: '../modules/exela-client-setup/exela-client-setup.module#ExelaClientSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-product-setup',
        loadChildren: '../modules/exela-product-setup/exela-product-setup.module#ExelaProductSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-client-user-setup',
        loadChildren: '../modules/exela-client-user-setup/exela-client-user-setup.module#ExelaClientUserSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-client-role-setup',
        loadChildren: '../modules/exela-client-role-setup/client-role-setup.module#ExelaClientRoleSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-storefront-setup',
        loadChildren: '../modules/exela-storefront-setup/storefront-setup.module#StoreFrontSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-project-setup',
        loadChildren: '../modules/exela-project-setup/exela-project-setup.module#ExelaProjectSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'my-profile',
        loadChildren: '../modules/shared/components/my-profile/my-profile.module#MyProfileModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'role-setup',
        loadChildren: '../modules/role-setup/role-setup.module#RoleSetupModule',
        canActivate: [AuthGuardService]
      },{
        path: 'exela-client-role-setup',
        loadChildren: '../modules/exela-client-role-setup/client-role-setup.module#ExelaClientRoleSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-lexicon',
        loadChildren: '../modules/lexicon/lexicon.module#LexiconModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-rule',
        loadChildren: '../modules/nQube/rule/rule/rule.module#RuleModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-rule-group',
        loadChildren: '../modules/nQube/rule/rule-group/rule-group.module#RuleGroupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-model-setup',
        loadChildren: '../modules/nQube/model/model-setup/model-setup.module#ModelSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-model-assignment',
        loadChildren: '../modules/nQube/model/model-assignment/model.assignment.module#ModelAssignmentModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'nQube-autorouting-rule/:ruleFor',
        loadChildren: '../modules/exela-auto-routing/exela-auto-routing.module#ExelaAutoRoutingModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'reachout-setup',
        loadChildren: '../modules/exela-reachout-setup/exela-reachout-setup.module#ExelaReachoutSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'ro-poi',
        loadChildren: '../modules/exela-reachout-setup/exela-poi-setup/exela-poi-setup.module#ExelaPoiSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'ro-event-notification',
        loadChildren: '../modules/exela-reachout-setup/exela-event-notification-setup/exela-event-notification-setup.module#ExelaEventNotificationSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'ro-esc-method',
        loadChildren: '../modules/exela-reachout-setup/exela-escalation-methods-setup/exela-escalation-methods-setup.module#ExelaEscalationMethodsSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'ro-customer-group',
        loadChildren: '../modules/exela-reachout-setup/exela-customer-group-setup/exela-customer-setup.module#ExelaCustomerSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'exela-mail-template',
        loadChildren: '../modules/exela-mail-template/exela-mail-template.module#ExelaMailTemplateModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'pulse-setup',
        loadChildren: '../modules/exela-pulse-setup/exela-pulse-setup.module#ExelaPulseSetupModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'CM-dashboard',
        redirectTo: 'dashboard/events-and-reminders',
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'dashboard',
        redirectTo: 'dashboard/events-and-reminders',
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'dashboard/events-and-reminders',
        component: DashboardComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'dashboard/financials',
        component: DashboardComponent,
        data: {
          breadcrumb: '',
          title: 'Dashboard'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'CM-contracts',
        redirectTo: 'contracts/contract-list',
        data: {
          breadcrumb: 'Contracts'
        }
      },
      {
        path: 'contract-list',
        component: ContractListComponent,
        data: {
          breadcrumb: 'Contract List',
          title: 'Contract List'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'doc-search',
        component: DocSearchComponent,
        data: {
          breadcrumb: 'Doc Search',
          title: 'Doc Search'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'contracts/doc-search/doc-history',
        component: DocHistoryComponent,
        data: {
          breadcrumb: 'Doc Search',
          title: 'Doc Search'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'contracts/:id',
        component: ContractsComponent,
        data: {
          breadcrumb: 'Add Contracts',
          title: 'Add Contracts'
        },
        resolve: {
          contract: ContractResolve
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'CM-notification',
        redirectTo: 'notification/notification-list',
        data: {
          breadcrumb: 'Contracts'
        }
      },
      {
        path: 'trash',
        component: TrashComponent,
        data: {
          breadcrumb: 'Trash',
          title: 'Trash'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'notification/notification-list',
        component: NotificationListComponent,
        data: {
          breadcrumb: 'Notification',
          title: 'Notification'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'notification/:id',
        component: AddEditNotificationComponent,
        data: {
          breadcrumb: 'Add Notification',
          title: 'Add Notification'
        },
        canActivate: [AuthGuardService]
      },
      {
        path: 'forms',
        loadChildren: '../modules/add-contract-meta-model/add-contract-meta-model.module#AddContractMetaModelModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'contract-meta',
        loadChildren: '../modules/contracts-meta/contracts-meta.module#ContractsMetaModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'dashboard-configuration',
        loadChildren: '../modules/dashboard-configuration/dashboard-configuration.module#DashboardConfigurationModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'drafting-tool',
        loadChildren: '../modules/drafting-tool/drafting-tool.module#DraftingToolModule',
        canActivate: [AuthGuardService]
      },
      {
        path: 'loading',
        component: LoaderComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

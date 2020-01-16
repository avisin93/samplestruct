import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../modules/auth/auth-guard.service';
import { PagesComponent } from './pages.component';
import { ContractsComponent } from '../modules/contracts/contracts.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { DocHistoryComponent } from './doc-search/doc-history/doc-history.component';
import { ContractResolve } from './contracts/contracts.resolve';
import { NotificationListComponent } from './notification/notification-list.component';
import { AddEditNotificationComponent } from './notification/add-edit-notification/add-edit-notification.component';

const routes: Routes = [
  {
    path: ':role',
    component: PagesComponent,
    canActivate: [AuthGuardService],
    data: {
      breadcrumb: ''
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: ''
        },
        children: [
          {
            path: 'dashboard/events-and-reminders',
            component: DashboardComponent,
            data: {
              breadcrumb: '',
              title: 'Dashboard'
            }
          },
          {
            path: 'dashboard/financials',
            component: DashboardComponent,
            data: {
              breadcrumb: '',
              title: 'Dashboard'
            }
          }
        ]
      },
      {
        path: '',
        data: {
          breadcrumb: 'Contracts'
        },
        children: [
          {
            path: 'contracts/contract-list',
            component: ContractListComponent,
            data: {
              breadcrumb: 'Contract List',
              title: 'Contract List'
            }
          },
          {
            path: 'contracts/doc-search',
            component: DocSearchComponent,
            data: {
              breadcrumb: 'Doc Search',
              title: 'Doc Search'
            }
          },
          {
            path: 'contracts/doc-search/doc-history',
            component: DocHistoryComponent,
            data: {
              breadcrumb: 'Doc Search',
              title: 'Doc Search'
            }
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
            }
          }
        ]
      },
      {
        path: 'notification/notification-list',
        component: NotificationListComponent,
        data: {
          breadcrumb: 'Notification',
          title: 'Notification'
        }
      },
      {
        path: 'notification/:id',
        component: AddEditNotificationComponent,
        data: {
          breadcrumb: 'Add Notification',
          title: 'Add Notification'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}


import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '@app/config';
import { ManageBidComponent } from './manage-bid.component';
import { BasicInfoModule } from './basic-info/basic-info.module';
import { RoleGuard } from '../../../common';
export const manageBidRoutes: Routes = [
  {
    path: '',
    component: ManageBidComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-info',
        pathMatch: 'full'
      },
      {
        path: 'basic-info',
        loadChildren: './basic-info/basic-info.module#BasicInfoModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidBasicInfo
        },
      },
      {
        path: 'business-terms',
        loadChildren: './business-terms/business-terms.module#BuisnessTermsModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidBusinessTerms
        },
      },
      {
        path: 'production-parameters',
        loadChildren: './production-parameters/production-parameters.module#ProductionParametersModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidProductionParameters
        }
      },
      {
        path: 'talent',
        loadChildren: './talent-info/talent-info.module#TalentInfoModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidTalent
        }
      },
      {
        path: 'editing-and-post',
        loadChildren: './editing-and-post/editing-and-post.module#EditingAndPostModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidEditingAndPost
        }
      },
      {
        path: 'aicp',
        loadChildren: './aicp/aicp.module#AicpModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidAicp
        }
      },
      {
        path: 'aicp/:passId',
        loadChildren: './aicp/aicp.module#AicpModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidAicp
        }
      },
      {
        path: 'passes',
        loadChildren: './passes/passes.module#PassesModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.bidPasses
        }
      },
      {
        path: 'master-configuration',
        loadChildren: '../manage-master-configuration/manage-master-configuration.module#ManageMasterConfigurationModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.projectMasterConfiguration,
          isBiddingList: false
        },
        canActivate: [RoleGuard]
      },
      {
        path: 'approval-hierarchy',
        loadChildren: '../bid-approval-hierarchy/bid-approval-hierarchy.module#BidApprovalHierarchyModule',
        data: {
          type: ACTION_TYPES.EDIT,
          moduleID: MODULE_ID.projectApprovalHierarchy,
          isBiddingList: false
        }
      },
      { path: '**', redirectTo: '' }
    ]
  }

];

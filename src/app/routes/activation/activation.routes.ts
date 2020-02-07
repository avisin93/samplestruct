/**
* Component     : Routing
 
* Creation Date : 27th April 2018
*/

import { Routes } from '@angular/router';
import { ACTION_TYPES, MODULE_ID } from '../../config';
import { ActivationComponent } from './activation.component';

export const activationRoutes: Routes = [{
  path: '',
  component: ActivationComponent,
  children: [
    {
      path: 'freelancer/:token',
      loadChildren: './freelancer-activation/freelancer-activation.module#FreelancerActivationModule',
    },
    {
      path: 'vendor/:token',
      loadChildren: './vendor-activation/vendor-activation.module#VendorActivationModule',
    },
    {
      path: 'vendor',
      loadChildren: './vendor-activation/vendor-activation.module#VendorActivationModule',
    },
    {
      path: 'freelancer',
      loadChildren: './freelancer-activation/freelancer-activation.module#FreelancerActivationModule',
    }
  ]
}];

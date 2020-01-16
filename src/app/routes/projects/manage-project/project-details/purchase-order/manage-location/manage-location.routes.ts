import { Routes } from '@angular/router';

import { AddPoLocationComponent } from './add-po-location/add-po-location.component';
import { AddSubPoLocationComponent } from './add-sub-po-location/add-sub-po-location.component';

import { ManageLocationComponent } from './manage-location.component';

export const manageLocationRoutes: Routes = [
  {
    path: '',
    component: ManageLocationComponent,
    children: [
      {
        path: '',
        component: AddPoLocationComponent
      },

    ]
  }
];

// Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExelaPoiSetupComponent } from './exela-poi-setup.component';
import { ExelaCreatePoiSetupComponent } from './exela-create-poi-setup/exela-create-poi-setup.component';
import { UploadListComponent } from './upload-list/upload-list-poi.component';

const routes: Routes = [
  {
    path: '',
    component: ExelaPoiSetupComponent,
    data: {
      organizationId: ''

    }
  },
  {
    path: 'create-poi/:id',
    component: ExelaCreatePoiSetupComponent,
    data: {
      mode: 'add'
    }
  },
  {
    path: 'edit/:id',
    component: ExelaCreatePoiSetupComponent,
    data: {
      mode: 'edit',
      PoiData: {}
    }
  },
  {
    path: 'app-upload-list-poi',
    component: UploadListComponent
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

  ]
})
export class ExelaPoiSetupRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error403Component } from './error403.component';
import { CoreCommonModule } from '@app/shared/core-common.module';

const routes: Routes = [
  { path: '', component: Error403Component }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule
  ],
  declarations: [Error403Component],
  exports: [
    RouterModule
  ]
})

export class Error403Module { }

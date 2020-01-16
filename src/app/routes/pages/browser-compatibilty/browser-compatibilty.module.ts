import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@app/shared/core-common.module';
import { BrowserCompatibiltyComponent } from './browser-compatibilty.component';

const routes: Routes = [
  { path: '', component: BrowserCompatibiltyComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule
  ],
  declarations: [BrowserCompatibiltyComponent],
  exports: [
    RouterModule
  ]
})

export class BrowserCompatibiltyModule { }

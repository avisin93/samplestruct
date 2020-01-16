import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoverComponent } from './recover.component';
import { CoreCommonModule } from '@app/shared/core-common.module';

const routes: Routes = [
  { path: '', component: RecoverComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule
  ],
  declarations: [RecoverComponent],
  exports: [
    RouterModule
  ]
})

export class RecoverModule { }

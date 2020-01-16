import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractsMetaComponent } from './contracts-meta.component';
import { ContractMetaResolve } from './contracts-meta.resolve';

const routes: Routes = [
  {
    path: '',
    component: ContractsMetaComponent
  },
  {
    path: ':id',
    component: ContractsMetaComponent,
    resolve: {
      contract: ContractMetaResolve
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
  providers: []
})
export class ContractsMetaRoutingModule {}

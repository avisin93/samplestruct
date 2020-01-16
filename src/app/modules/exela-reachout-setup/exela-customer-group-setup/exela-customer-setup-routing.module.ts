import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExelaCreateCustomerSetupComponent } from './exela-customer-create-setup/exela-create-customer-setup.component';
import { ExelaCustomerSetupComponent } from './exela-customer-setup.component';
const routes: Routes = [
  {
    path: '',
    component: ExelaCustomerSetupComponent
  },
  {
    path: 'create-customer',
    component: ExelaCreateCustomerSetupComponent,
    data: {
      mode: 'add'
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
export class ExelaCustomerSetupRoutingModule { }
